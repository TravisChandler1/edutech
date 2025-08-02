-- Add role support to existing users table
-- This migration adds the missing columns and tables for role-based functionality

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS selected_plan VARCHAR(20) CHECK (selected_plan IN ('Novice', 'Beginner', 'Intermediate', 'Advanced'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS selected_category VARCHAR(20) CHECK (selected_category IN ('Group', 'Individual'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Create index on role for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create roles table for role-based permissions
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Create teacher approval requests table
CREATE TABLE IF NOT EXISTS teacher_approval_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    selected_plan VARCHAR(20) CHECK (selected_plan IN ('Novice', 'Beginner', 'Intermediate', 'Advanced')),
    selected_category VARCHAR(20) CHECK (selected_category IN ('Group', 'Individual')),
    bio TEXT,
    qualifications TEXT,
    experience TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT
);

-- Create index on teacher approval requests
CREATE INDEX IF NOT EXISTS idx_teacher_approval_requests_status ON teacher_approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_teacher_approval_requests_email ON teacher_approval_requests(email);

-- Create live_sessions table for teacher sessions
CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(20) CHECK (level IN ('Novice', 'Beginner', 'Intermediate', 'Advanced')),
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_participants INTEGER DEFAULT 10,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    meeting_url VARCHAR(500),
    recording_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create session_participants table
CREATE TABLE IF NOT EXISTS session_participants (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    UNIQUE(session_id, user_id)
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'General' CHECK (category IN ('General', 'Study Group', 'Cultural Discussion', 'Practice Partners')),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, user_id)
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES 
('admin', 'Administrator with full access', '["admin", "teacher", "student"]'),
('teacher', 'Teacher with teaching permissions', '["teacher", "student"]'),
('student', 'Student with basic access', '["student"]')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_live_sessions_updated_at ON live_sessions;
CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON live_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();