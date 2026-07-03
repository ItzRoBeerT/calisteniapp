-- =============================================
-- ROADMAPS TABLE (issue #25)
-- Reflejar también en supabase/schema.sql
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

-- Grants (RLS sigue mandando)
GRANT SELECT, INSERT, UPDATE, DELETE ON roadmaps TO anon, authenticated, service_role;
