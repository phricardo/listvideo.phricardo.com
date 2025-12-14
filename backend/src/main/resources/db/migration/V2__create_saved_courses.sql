CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE saved_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    youtube_playlist_id TEXT NOT NULL,
    youtube_channel_id TEXT NOT NULL,
    youtube_channel_title TEXT NOT NULL,
    custom_title TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_key TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uq_saved_course_user_playlist UNIQUE (user_id, youtube_playlist_id)
);

CREATE INDEX idx_saved_courses_user_id ON saved_courses(user_id);
CREATE INDEX idx_saved_courses_playlist ON saved_courses(youtube_playlist_id);

CREATE OR REPLACE FUNCTION set_saved_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_saved_courses_updated_at
BEFORE UPDATE ON saved_courses
FOR EACH ROW EXECUTE FUNCTION set_saved_courses_updated_at();
