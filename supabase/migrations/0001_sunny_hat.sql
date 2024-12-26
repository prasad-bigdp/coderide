/*
  # Create settings table with RLS

  1. New Tables
    - `settings`
      - `id` (int, primary key)
      - `site_name` (text)
      - `site_url` (text)
      - `support_email` (text)
      - `max_file_size` (int)
      - `enable_registration` (boolean)
      - `enable_notifications` (boolean)
      - `enable_emails` (boolean)
      - `maintenance_mode` (boolean)
      - `backup_frequency` (text)
      - `retention_days` (int)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `settings` table
    - Add policy for admin access
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table first since it's needed for RLS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'faculty', 'student')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name TEXT NOT NULL DEFAULT 'CodeRide',
    site_url TEXT NOT NULL DEFAULT 'https://coderide.com',
    support_email TEXT NOT NULL DEFAULT 'support@coderide.com',
    max_file_size INT NOT NULL DEFAULT 10,
    enable_registration BOOLEAN NOT NULL DEFAULT true,
    enable_notifications BOOLEAN NOT NULL DEFAULT true,
    enable_emails BOOLEAN NOT NULL DEFAULT true,
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    backup_frequency TEXT NOT NULL DEFAULT 'daily',
    retention_days INT NOT NULL DEFAULT 30,
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Only admins can manage settings"
    ON settings
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Insert default settings
INSERT INTO settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;