-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create user_enrollments table to track user enrollments
CREATE TABLE IF NOT EXISTS user_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service VARCHAR(100) NOT NULL, -- 'book-club', 'classes', etc.
    level VARCHAR(50), -- 'Free Plan', 'Premium', 'Pro+'
    amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'completed'
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user_id ON user_enrollments(user_id);