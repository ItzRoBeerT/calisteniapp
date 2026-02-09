-- =============================================
-- OpenCalisthenics Database Schema for Supabase
-- =============================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- EXERCISES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS "Exercise" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    muscle_group TEXT[] DEFAULT '{}',
    difficulty INTEGER DEFAULT 0 CHECK (difficulty >= 0 AND difficulty <= 5),
    resources JSONB DEFAULT '[]',
    equipment TEXT[] DEFAULT '{}',
    category TEXT,
    type TEXT
);

-- Add columns if they don't exist (for existing databases)
ALTER TABLE "Exercise" ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';
ALTER TABLE "Exercise" ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}';
ALTER TABLE "Exercise" ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE "Exercise" ADD COLUMN IF NOT EXISTS type TEXT;

-- =============================================
-- WORKOUTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS "Workout" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    duration INTEGER,
    muscle_groups TEXT[] DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- WORKOUT EXERCISES (junction table)
-- =============================================
CREATE TABLE IF NOT EXISTS "WorkoutExercise" (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES "Exercise"(id) ON DELETE SET NULL,
    exercise_name TEXT,
    sets INTEGER DEFAULT 3,
    reps INTEGER DEFAULT 10,
    rest INTEGER DEFAULT 60,
    "order" INTEGER DEFAULT 0
);

-- =============================================
-- WORKOUT TAGS
-- =============================================
CREATE TABLE IF NOT EXISTS "WorkoutTags" (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- Also create snake_case version for compatibility
CREATE TABLE IF NOT EXISTS workout_tags (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE CASCADE,
    tag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES "Exercise"(id) ON DELETE SET NULL,
    sets INTEGER DEFAULT 3,
    reps INTEGER DEFAULT 10,
    rest INTEGER DEFAULT 60,
    "order" INTEGER DEFAULT 0
);

-- =============================================
-- USER PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS "Profile" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    workouts_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Also create snake_case version for compatibility
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    workouts_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_exercise_difficulty ON "Exercise"(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercise_muscle_group ON "Exercise" USING GIN(muscle_group);
CREATE INDEX IF NOT EXISTS idx_workout_user ON "Workout"(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_difficulty ON "Workout"(difficulty);
CREATE INDEX IF NOT EXISTS idx_workout_exercise_workout ON "WorkoutExercise"(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_tags_workout ON "WorkoutTags"(workout_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =============================================

-- Enable RLS on tables
ALTER TABLE "Exercise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkoutExercise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkoutTags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running this script
DROP POLICY IF EXISTS "Exercises are viewable by everyone" ON "Exercise";
DROP POLICY IF EXISTS "Workouts are viewable by everyone" ON "Workout";
DROP POLICY IF EXISTS "Users can create their own workouts" ON "Workout";
DROP POLICY IF EXISTS "Users can update their own workouts" ON "Workout";
DROP POLICY IF EXISTS "Users can delete their own workouts" ON "Workout";
DROP POLICY IF EXISTS "Workout exercises viewable by everyone" ON "WorkoutExercise";
DROP POLICY IF EXISTS "Users can manage exercises of their workouts" ON "WorkoutExercise";
DROP POLICY IF EXISTS "Workout tags viewable by everyone" ON "WorkoutTags";
DROP POLICY IF EXISTS "Users can manage tags of their workouts" ON "WorkoutTags";
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON "Profile";
DROP POLICY IF EXISTS "Users can update their own profile" ON "Profile";

-- Exercise: Everyone can read
CREATE POLICY "Exercises are viewable by everyone" ON "Exercise"
    FOR SELECT USING (true);

-- Workout: Everyone can read, owners can modify
CREATE POLICY "Workouts are viewable by everyone" ON "Workout"
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own workouts" ON "Workout"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" ON "Workout"
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" ON "Workout"
    FOR DELETE USING (auth.uid() = user_id);

-- WorkoutExercise: Follow workout permissions
CREATE POLICY "Workout exercises viewable by everyone" ON "WorkoutExercise"
    FOR SELECT USING (true);

CREATE POLICY "Users can manage exercises of their workouts" ON "WorkoutExercise"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutExercise".workout_id
            AND "Workout".user_id = auth.uid()
        )
    );

-- WorkoutTags: Follow workout permissions
CREATE POLICY "Workout tags viewable by everyone" ON "WorkoutTags"
    FOR SELECT USING (true);

CREATE POLICY "Users can manage tags of their workouts" ON "WorkoutTags"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutTags".workout_id
            AND "Workout".user_id = auth.uid()
        )
    );

-- Profile: Everyone can read, owners can modify
CREATE POLICY "Profiles are viewable by everyone" ON "Profile"
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON "Profile"
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- TRIGGER: Auto-create profile on user signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Profile" (user_id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

    INSERT INTO public.profiles (user_id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
