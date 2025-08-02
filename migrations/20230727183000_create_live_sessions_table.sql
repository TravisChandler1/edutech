-- Create live_sessions table
CREATE TABLE IF NOT EXISTS live_sessions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  meeting_url VARCHAR(512),
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  max_participants INTEGER,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
  plan_id INTEGER REFERENCES plans(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create table for session participants
CREATE TABLE IF NOT EXISTS session_participants (
  session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  PRIMARY KEY (session_id, user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_live_sessions_created_by ON live_sessions(created_by);
CREATE INDEX idx_live_sessions_group_id ON live_sessions(group_id);
CREATE INDEX idx_live_sessions_plan_id ON live_sessions(plan_id);
CREATE INDEX idx_session_participants_user_id ON session_participants(user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_live_sessions_modtime
BEFORE UPDATE ON live_sessions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
