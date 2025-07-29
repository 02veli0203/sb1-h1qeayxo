import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { Database } from '../types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface ExtendedUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  userProfile: ExtendedUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Auto-create admin user if it doesn't exist
  const createAdminUser = async () => {
    try {
      // Try to sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@test.com',
        password: 'admin123',
      });

      if (data.user && !error) {
        // Create admin profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username: 'admin',
            email: 'admin@test.com',
            role: 'admin'
          });

        if (profileError) {
          console.log('Admin profile already exists or error creating:', profileError);
        }
      } else if (error && error.message.includes('already registered')) {
        // Admin user already exists, which is fine
        console.log('Admin user already exists');
      }
    } catch (err) {
      console.log('Error creating admin user:', err);
    }
  };

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

  useEffect(() => {
    let mounted = true;

    // Initialize admin user
    createAdminUser();

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
    user: authState.user,
    userProfile: authState.userProfile,
    isLoading: authState.isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.userProfile?.role === 'admin',
  };
};

export default useAuth;