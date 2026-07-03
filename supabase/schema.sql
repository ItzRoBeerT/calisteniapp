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
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "Workout" ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

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
    "order" INTEGER DEFAULT 0,
    rir INTEGER DEFAULT NULL,
    superset_group TEXT DEFAULT NULL
);

ALTER TABLE "WorkoutExercise" ADD COLUMN IF NOT EXISTS rir INTEGER DEFAULT NULL;
ALTER TABLE "WorkoutExercise" ADD COLUMN IF NOT EXISTS superset_group TEXT DEFAULT NULL;

-- =============================================
-- WORKOUT TAGS
-- =============================================
CREATE TABLE IF NOT EXISTS "WorkoutTags" (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- =============================================
-- USER PROFILES
-- =============================================
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
-- WORKOUT FAVORITES
-- =============================================
CREATE TABLE IF NOT EXISTS workout_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, workout_id)
);

-- =============================================
-- WORKOUT COMPLETIONS (history for contribution graph)
-- =============================================
CREATE TABLE IF NOT EXISTS workout_completions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES "Workout"(id) ON DELETE SET NULL,
    workout_name TEXT NOT NULL,
    duration_seconds INTEGER,
    exercises_count INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EXERCISE PROGRESSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS exercise_progressions (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER NOT NULL REFERENCES "Exercise"(id) ON DELETE CASCADE,
    prerequisites INTEGER[] DEFAULT '{}',
    variations INTEGER[] DEFAULT '{}',
    progressions INTEGER[] DEFAULT '{}'
);
CREATE UNIQUE INDEX IF NOT EXISTS exercise_progressions_exercise_id_idx ON exercise_progressions(exercise_id);

-- =============================================
-- EXERCISE REQUESTS
-- =============================================
CREATE TABLE IF NOT EXISTS exercise_requests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    muscle_group TEXT[] DEFAULT '{}',
    category TEXT,
    type TEXT,
    difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 5),
    equipment TEXT[] DEFAULT '{}',
    locale TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_exercise_difficulty ON "Exercise"(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercise_muscle_group ON "Exercise" USING GIN(muscle_group);
CREATE INDEX IF NOT EXISTS idx_workout_user ON "Workout"(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_is_public ON "Workout"(is_public);
CREATE INDEX IF NOT EXISTS idx_workout_difficulty ON "Workout"(difficulty);
CREATE INDEX IF NOT EXISTS idx_workout_exercise_workout ON "WorkoutExercise"(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_tags_workout ON "WorkoutTags"(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_favorites_user ON workout_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_completions_user_date ON workout_completions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_exercise_progressions_exercise ON exercise_progressions(exercise_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =============================================

-- Enable RLS on tables
ALTER TABLE "Exercise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_progressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkoutExercise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkoutTags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_completions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running this script
DROP POLICY IF EXISTS "Exercises are viewable by everyone" ON "Exercise";
DROP POLICY IF EXISTS "Workouts are viewable by everyone" ON "Workout";
DROP POLICY IF EXISTS "Users can create their own workouts" ON "Workout";
DROP POLICY IF EXISTS "Users can update their own workouts" ON "Workout";
DROP POLICY IF EXISTS "Users can delete their own workouts" ON "Workout";
DROP POLICY IF EXISTS "Workout exercises viewable by everyone" ON "WorkoutExercise";
DROP POLICY IF EXISTS "Users can manage exercises of their workouts" ON "WorkoutExercise";
DROP POLICY IF EXISTS "Users can update exercises of their workouts" ON "WorkoutExercise";
DROP POLICY IF EXISTS "Users can delete exercises of their workouts" ON "WorkoutExercise";
DROP POLICY IF EXISTS "Workout tags viewable by everyone" ON "WorkoutTags";
DROP POLICY IF EXISTS "Users can manage tags of their workouts" ON "WorkoutTags";
DROP POLICY IF EXISTS "Users can update tags of their workouts" ON "WorkoutTags";
DROP POLICY IF EXISTS "Users can delete tags of their workouts" ON "WorkoutTags";
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Exercise: Everyone can read
CREATE POLICY "Exercises are viewable by everyone" ON "Exercise"
    FOR SELECT USING (true);

-- Exercise progressions: Everyone can read
DROP POLICY IF EXISTS "Exercise progressions are viewable by everyone" ON exercise_progressions;
CREATE POLICY "Exercise progressions are viewable by everyone" ON exercise_progressions
    FOR SELECT USING (true);

-- Workout: Public workouts visible to all, private only to owner
CREATE POLICY "Workouts are viewable by everyone" ON "Workout"
    FOR SELECT USING (is_public = true OR (select auth.uid()) = user_id);

CREATE POLICY "Users can create their own workouts" ON "Workout"
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own workouts" ON "Workout"
    FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own workouts" ON "Workout"
    FOR DELETE USING ((select auth.uid()) = user_id);

-- WorkoutExercise: Follow workout permissions
CREATE POLICY "Workout exercises viewable by everyone" ON "WorkoutExercise"
    FOR SELECT USING (true);

CREATE POLICY "Users can manage exercises of their workouts" ON "WorkoutExercise"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutExercise".workout_id
            AND "Workout".user_id = (select auth.uid())
        )
    );

CREATE POLICY "Users can update exercises of their workouts" ON "WorkoutExercise"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutExercise".workout_id
            AND "Workout".user_id = (select auth.uid())
        )
    );

CREATE POLICY "Users can delete exercises of their workouts" ON "WorkoutExercise"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutExercise".workout_id
            AND "Workout".user_id = (select auth.uid())
        )
    );

-- WorkoutTags: Follow workout permissions
CREATE POLICY "Workout tags viewable by everyone" ON "WorkoutTags"
    FOR SELECT USING (true);

CREATE POLICY "Users can manage tags of their workouts" ON "WorkoutTags"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutTags".workout_id
            AND "Workout".user_id = (select auth.uid())
        )
    );

CREATE POLICY "Users can update tags of their workouts" ON "WorkoutTags"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutTags".workout_id
            AND "Workout".user_id = (select auth.uid())
        )
    );

CREATE POLICY "Users can delete tags of their workouts" ON "WorkoutTags"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "Workout"
            WHERE "Workout".id = "WorkoutTags".workout_id
            AND "Workout".user_id = (select auth.uid())
        )
    );

-- Workout Favorites: Users can manage their own favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON workout_favorites;
DROP POLICY IF EXISTS "Anyone can view favorites" ON workout_favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON workout_favorites;
DROP POLICY IF EXISTS "Users can remove favorites" ON workout_favorites;

-- Allow anyone (including anonymous) to read favorites so like counts are always visible
CREATE POLICY "Anyone can view favorites" ON workout_favorites
    FOR SELECT USING (true);

CREATE POLICY "Users can add favorites" ON workout_favorites
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can remove favorites" ON workout_favorites
    FOR DELETE USING ((select auth.uid()) = user_id);

-- Explicit table grants for API roles
GRANT SELECT ON TABLE workout_favorites TO anon;
GRANT SELECT ON TABLE workout_favorites TO authenticated;

-- Profiles: Everyone can read, owners can modify
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Exercise Requests: Anyone can submit, only owner can view their own
ALTER TABLE exercise_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can submit exercise requests" ON exercise_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON exercise_requests;

CREATE POLICY "Users can submit exercise requests" ON exercise_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own requests" ON exercise_requests
    FOR SELECT USING ((select auth.uid()) = user_id OR user_id IS NULL);

-- Workout Completions: Users can manage their own completions
DROP POLICY IF EXISTS "Users can view their own completions" ON workout_completions;
DROP POLICY IF EXISTS "Users can add completions" ON workout_completions;

CREATE POLICY "Users can view their own completions" ON workout_completions
    FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can add completions" ON workout_completions
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- =============================================
-- TRIGGER: Auto-create profile on user signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ROADMAPS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9_-]+$'),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT,
    locale TEXT NOT NULL DEFAULT 'es',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_template BOOLEAN NOT NULL DEFAULT false,
    nodes JSONB NOT NULL DEFAULT '[]',
    edges JSONB NOT NULL DEFAULT '[]',
    total_nodes INTEGER NOT NULL DEFAULT 0,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS roadmaps_public_idx ON roadmaps(is_public) WHERE is_public = true;

-- updated_at automático
CREATE OR REPLACE FUNCTION public.set_roadmaps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS roadmaps_set_updated_at ON roadmaps;
CREATE TRIGGER roadmaps_set_updated_at
    BEFORE UPDATE ON roadmaps
    FOR EACH ROW EXECUTE FUNCTION public.set_roadmaps_updated_at();

-- RLS
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public roadmaps are viewable by everyone" ON roadmaps;
CREATE POLICY "Public roadmaps are viewable by everyone" ON roadmaps
    FOR SELECT USING (is_public = true OR (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own roadmaps" ON roadmaps;
CREATE POLICY "Users can create their own roadmaps" ON roadmaps
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own roadmaps" ON roadmaps;
CREATE POLICY "Users can update their own roadmaps" ON roadmaps
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON roadmaps;
CREATE POLICY "Users can delete their own roadmaps" ON roadmaps
    FOR DELETE USING ((select auth.uid()) = user_id);


-- =============================================
-- GRANTS
-- =============================================
-- Explicit grants for the Supabase API roles. Cloud projects usually get
-- these via default privileges, but local stacks (supabase CLI) do not,
-- so declare them explicitly. Row Level Security still governs access.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
