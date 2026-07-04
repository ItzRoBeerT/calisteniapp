import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface RoadmapRow {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  locale: string;
  user_id: string | null;
  author: string | null;
  is_public: boolean;
  is_template: boolean;
  total_nodes: number | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  nodes?: unknown[];
  edges?: unknown[];
}

// Fila de la tabla roadmaps -> forma que consume el front (types/Roadmap.ts)
function toRoadmap(row: RoadmapRow) {
  return {
    id: row.slug,
    title: row.title,
    description: row.description ?? '',
    author: row.author ?? undefined,
    authorId: row.user_id ?? undefined,
    category: row.category ?? undefined,
    locale: row.locale,
    isPublic: row.is_public,
    isTemplate: row.is_template,
    totalNodes: row.total_nodes ?? 0,
    completedNodes: 0,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    nodes: row.nodes ?? [],
    edges: row.edges ?? [],
  };
}

const SUMMARY_COLUMNS =
  'slug, title, description, category, locale, user_id, author, is_public, is_template, total_nodes, thumbnail_url, created_at, updated_at';

// GET - Lista de roadmaps (públicos + propios) o uno concreto por slug
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!supabase) {
    // Modo demo sin Supabase: no hay roadmaps persistidos
    return id
      ? NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })
      : NextResponse.json([]);
  }

  if (id) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('slug', id)
      .maybeSingle();

    if (error) {
      console.error('Error reading roadmap:', error);
      return NextResponse.json({ error: 'Error reading roadmap' }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }
    return NextResponse.json(toRoadmap(data));
  }

  const [{ data: rows, error }, { data: userData }] = await Promise.all([
    supabase.from('roadmaps').select(SUMMARY_COLUMNS).order('updated_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (error) {
    console.error('Error listing roadmaps:', error);
    return NextResponse.json({ error: 'Error reading roadmaps' }, { status: 500 });
  }

  const currentUserId = userData?.user?.id ?? null;
  const summaries = (rows ?? []).map((row) => ({
    ...toRoadmap(row),
    isOwner: currentUserId !== null && row.user_id === currentUserId,
  }));

  return NextResponse.json(summaries);
}

// POST - Crear o actualizar un roadmap del usuario autenticado
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id || !body.title) {
    return NextResponse.json(
      { error: 'Missing required fields: id and title' },
      { status: 400 }
    );
  }

  const slug = String(body.id)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-');

  // Si el slug existe y pertenece a otro usuario, no se puede sobrescribir
  const { data: existing } = await supabase
    .from('roadmaps')
    .select('user_id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing && existing.user_id !== user.id) {
    return NextResponse.json(
      { error: 'A roadmap with this name already exists' },
      { status: 409 }
    );
  }

  // Nombre visible del autor desde su perfil (si existe)
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name')
    .eq('user_id', user.id)
    .maybeSingle();
  const author = profile?.username || profile?.full_name || user.email || null;

  const record = {
    slug,
    title: body.title,
    description: body.description ?? '',
    category: body.category ?? null,
    locale: body.locale ?? 'es',
    user_id: user.id,
    author,
    is_public: body.isPublic ?? true,
    nodes: body.nodes ?? [],
    edges: body.edges ?? [],
    total_nodes: body.totalNodes ?? (Array.isArray(body.nodes) ? body.nodes.length : 0),
  };

  const { error } = await supabase.from('roadmaps').upsert(record, { onConflict: 'slug' });

  if (error) {
    console.error('Error saving roadmap:', error);
    return NextResponse.json({ error: 'Error saving roadmap' }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: slug, message: 'Roadmap saved successfully' });
}

// DELETE - Borrar un roadmap propio
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing roadmap id' }, { status: 400 });
  }

  // RLS limita el borrado a filas propias; comprobamos el resultado para responder 404
  const { data, error } = await supabase
    .from('roadmaps')
    .delete()
    .eq('slug', id)
    .select('slug');

  if (error) {
    console.error('Error deleting roadmap:', error);
    return NextResponse.json({ error: 'Error deleting roadmap' }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Roadmap deleted' });
}
