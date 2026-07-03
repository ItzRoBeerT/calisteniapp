import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import RoadmapViewer from '@/components/roadmaps/RoadmapViewer';
import RoadmapActions from '@/components/roadmaps/RoadmapActions';
import type { Roadmap } from '@/types/Roadmap';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';

// RLS decide la visibilidad: públicos para todos, privados solo para su dueño
const getRoadmap = cache(async (slug: string): Promise<Roadmap | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.slug,
    title: data.title,
    description: data.description ?? '',
    author: data.author ?? undefined,
    authorId: data.user_id ?? undefined,
    category: data.category ?? undefined,
    locale: data.locale,
    isPublic: data.is_public,
    isTemplate: data.is_template,
    totalNodes: data.total_nodes ?? 0,
    completedNodes: 0,
    thumbnailUrl: data.thumbnail_url ?? undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    nodes: data.nodes ?? [],
    edges: data.edges ?? [],
  };
});

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const roadmap = await getRoadmap(id);
  if (!roadmap || !roadmap.isPublic) return {};

  return {
    title: `${roadmap.title} | OpenCalisthenics`,
    description: roadmap.description,
    openGraph: {
      title: roadmap.title,
      description: roadmap.description,
      type: 'article',
      siteName: 'OpenCalisthenics',
      ...(roadmap.thumbnailUrl ? { images: [{ url: roadmap.thumbnailUrl }] } : {}),
    },
    twitter: {
      card: 'summary',
      title: roadmap.title,
      description: roadmap.description,
    },
  };
}

export default async function RoadmapDetailPage({ params }: Props) {
  const { id } = await params;
  const [roadmap, t] = await Promise.all([getRoadmap(id), getTranslations('RoadmapViewer')]);

  if (!roadmap) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header del roadmap */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/roadmaps"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              title={t('backToRoadmaps')}
            >
              <svg className="w-5 h-5 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading truncate">
              {roadmap.title}
            </h1>
            {roadmap.category && (
              <span className="hidden sm:inline-block shrink-0 px-3 py-1 text-xs uppercase tracking-wider bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
                {roadmap.category}
              </span>
            )}
          </div>
          <RoadmapActions roadmap={roadmap} />
        </div>
        <p className="text-foreground/60 max-w-2xl ml-10">
          {roadmap.description}
        </p>
        {roadmap.author && (
          <p className="text-sm text-foreground/40 mt-2 ml-10">
            {t('by')} <span className="text-primary-400">{roadmap.author}</span>
          </p>
        )}
      </header>

      {/* Visor del roadmap */}
      <RoadmapViewer roadmap={roadmap} />
    </main>
  );
}
