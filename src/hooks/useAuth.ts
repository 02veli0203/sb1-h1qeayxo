import { useState, useEffect } from 'react';
import { supabase, User } from '../lib/supabase';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User doesn't exist in users table, create one
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            const newUserProfile = {
              id: authUser.user.id,
              username: authUser.user.email?.split('@')[0] || 'user',
              email: authUser.user.email || '',
              role: 'user',
            };

            const { error: insertError } = await supabase
              .from('users')
              .insert([newUserProfile]);

            if (insertError) {
              console.error('Error creating user profile:', insertError);
              // Fallback to temporary user object
              setUser({
                ...newUserProfile,
                created_at: new Date().toISOString()
              });
            } else {
              // Re-fetch the newly created user profile
              const { data: newData, error: refetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

              if (refetchError) {
                console.error('Error re-fetching user profile:', refetchError);
                setUser({
                  ...newUserProfile,
                  created_at: new Date().toISOString()
                });
              } else {
                setUser(newData);
              }
            }
          }
        } else {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email,
            username,
            role: 'user',
          },
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;