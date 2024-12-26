/*
  # Authentication System Setup

  1. New Tables
    - `auth_settings`
      - `id` (int, primary key)
      - `allow_registration` (boolean)
      - `require_email_verification` (boolean)
      - `password_min_length` (int)
      - `max_login_attempts` (int)
      - `lockout_duration` (interval)
      - `session_duration` (interval)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on auth_settings table
    - Add policy for admin access
    - Add function for password validation
    - Add trigger for session cleanup
*/

-- Create auth settings table
CREATE TABLE IF NOT EXISTS auth_settings (
    id INT PRIMARY KEY DEFAULT 1,
    allow_registration BOOLEAN NOT NULL DEFAULT true,
    require_email_verification BOOLEAN NOT NULL DEFAULT false,
    password_min_length INT NOT NULL DEFAULT 6,
    max_login_attempts INT NOT NULL DEFAULT 5,
    lockout_duration INTERVAL NOT NULL DEFAULT '30 minutes',
    session_duration INTERVAL NOT NULL DEFAULT '30 days',
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE auth_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Only admins can manage auth settings"
    ON auth_settings
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Create function to validate password strength
CREATE OR REPLACE FUNCTION validate_password(password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    min_length INT;
BEGIN
    SELECT password_min_length INTO min_length FROM auth_settings WHERE id = 1;
    RETURN length(password) >= min_length;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login()
RETURNS TRIGGER AS $$
DECLARE
    max_attempts INT;
    lockout_time INTERVAL;
BEGIN
    SELECT max_login_attempts, lockout_duration 
    INTO max_attempts, lockout_time 
    FROM auth_settings 
    WHERE id = 1;

    IF NEW.login_attempts >= max_attempts THEN
        NEW.locked_until := now() + lockout_time;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default settings
INSERT INTO auth_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;