/*
  # Create Admin User

  1. New Operations
    - Insert admin user into auth.users table with encrypted password
    - Insert corresponding profile into public.users table
    - Set up proper authentication credentials for admin@test.com

  2. Security
    - Uses proper password encryption with bcrypt
    - Creates user with authenticated role
    - Links auth user with public profile

  3. Admin Credentials
    - Email: admin@test.com
    - Password: admin123
    - Role: admin
*/

-- Create admin user in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "admin@test.com"}'
) ON CONFLICT (email) DO NOTHING;

-- Create corresponding profile in public.users table
INSERT INTO public.users (id, username, email, role, created_at)
SELECT 
  id, 
  'admin', 
  'admin@test.com', 
  'admin',
  NOW()
FROM auth.users 
WHERE email = 'admin@test.com'
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  username = 'admin';