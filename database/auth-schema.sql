-- Enhanced User Profile Schema for Authentication & Onboarding
-- This extends the existing users table with PRD 1 requirements

-- Add new columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS alias text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS faith_view text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS incognito boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at timestamp with time zone;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity timestamp with time zone DEFAULT now();

-- Create user_sessions table for device/session management
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name text,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT now() + interval '7 days',
  revoked boolean DEFAULT false
);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Create email_verification_tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Create login_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  ip_address inet,
  success boolean,
  attempted_at timestamp with time zone DEFAULT now(),
  user_agent text
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Password reset tokens are not directly accessible via RLS
CREATE POLICY "No direct access to password reset tokens" ON password_reset_tokens
  FOR ALL USING (false);

-- Email verification tokens are not directly accessible via RLS
CREATE POLICY "No direct access to email verification tokens" ON email_verification_tokens
  FOR ALL USING (false);

-- Login attempts are not directly accessible via RLS (admin only)
CREATE POLICY "No direct access to login attempts" ON login_attempts
  FOR ALL USING (false);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_alias ON users(alias);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);

-- Function to generate unique alias
CREATE OR REPLACE FUNCTION generate_unique_alias(first_name text)
RETURNS text AS $$
DECLARE
  base_alias text;
  final_alias text;
  counter int := 1;
BEGIN
  -- Create base alias from first name
  base_alias := lower(regexp_replace(first_name, '[^a-zA-Z0-9]', '', 'g'));
  
  -- If empty, use default
  IF base_alias = '' THEN
    base_alias := 'blessed';
  END IF;
  
  final_alias := base_alias;
  
  -- Check if alias exists and increment until unique
  WHILE EXISTS (SELECT 1 FROM users WHERE alias = final_alias) LOOP
    final_alias := base_alias || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_alias;
END;
$$ LANGUAGE plpgsql;
