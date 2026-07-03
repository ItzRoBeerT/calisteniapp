'use client';

import { use, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import RoadmapViewer from '@/components/roadmaps/RoadmapViewer';
import type { Roadmap } from '@/types/Roadmap';
import { Link } from '@/i18n/navigation';

export default function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('RoadmapViewer');

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'notFound' | 'loadError' | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`/api/roadmaps?id=${encodeURIComponent(id)}`);
        if (!response.ok) {
          setError(response.status === 404 ? 'notFound' : 'loadError');
          return;
        }
        const data = await response.json();
        setRoadmap(data);
      } catch {
        setError('loadError');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-center items-center py-24">
          <div className="loader" />
        </div>
      </main>
    );
  }

  if (error || !roadmap) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {t(error === 'loadError' ? 'loadError' : 'notFound')}
          </h1>
          <p className="text-foreground/60 mb-6">
            {t('notFoundDescription')}
          </p>
          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToRoadmaps')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header del roadmap */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <Link
              href="/roadmaps"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title={t('backToRoadmaps')}
            >
              <svg className="w-5 h-5 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {roadmap.title}
            </h1>
          </div>
          {roadmap.category && (
            <span className="shrink-0 px-3 py-1 text-xs uppercase tracking-wider bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
              {roadmap.category}
            </span>
          )}
        </div>
        <p
          className="text-foreground/60 max-w-2xl ml-10"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
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
