"use client";
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { RoadmapSummary } from '@/types/Roadmap';

function RoadmapCard({
  roadmap,
  onDelete,
}: {
  roadmap: RoadmapSummary;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('RoadmapsPage');

  return (
    <div
      className="group relative border border-white/10 rounded-xl bg-surface/50 backdrop-blur-sm
               shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1
               hover:border-primary-500/50 hover:bg-surface/80"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/5 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <Link
        href={{ pathname: '/roadmaps/[id]', params: { id: roadmap.id } }}
        className="block p-5"
      >
        <div className="relative">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-lg font-bold text-foreground group-hover:text-primary-400 transition-colors font-heading">
              {roadmap.title}
            </h2>
            {roadmap.isTemplate && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-secondary-500/15 text-secondary-400 rounded-full border border-secondary-500/30">
                {t('template')}
              </span>
            )}
          </div>

          {roadmap.description && (
            <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
              {roadmap.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-foreground/40">
            {roadmap.totalNodes > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                {t('nodesCount', { count: roadmap.totalNodes })}
              </span>
            )}

            {roadmap.updatedAt && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(roadmap.updatedAt).toLocaleDateString()}
              </span>
            )}

            {roadmap.author && !roadmap.isTemplate && (
              <span className="truncate">{t('by', { author: roadmap.author })}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Acciones del dueño */}
      {roadmap.isOwner && (
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={{ pathname: '/roadmaps/build', query: { id: roadmap.id } }}
            title={t('edit')}
            className="p-1.5 rounded-lg bg-surface/80 border border-foreground/10 text-foreground/50
                     hover:text-primary-400 hover:border-primary-500/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => {
              if (confirm(t('confirmDelete', { title: roadmap.title }))) {
                onDelete(roadmap.id);
              }
            }}
            title={t('delete')}
            className="p-1.5 rounded-lg bg-surface/80 border border-foreground/10 text-foreground/50
                     hover:text-red-400 hover:border-red-500/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function CreateCard({ label }: { label: string }) {
  return (
    <Link
      href="/roadmaps/build"
      className="group flex flex-col items-center justify-center border-2 border-dashed border-white/20
               rounded-xl p-5 min-h-[160px] transition-all duration-300
               hover:border-primary-500/50 hover:bg-primary-500/5"
    >
      <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center
                    mb-3 group-hover:bg-primary-500/30 transition-colors">
        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-sm font-medium text-foreground/60 group-hover:text-primary-400 transition-colors">
        {label}
      </span>
    </Link>
  );
}

export default function RoadmapsList() {
  const t = useTranslations('RoadmapsPage');
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch('/api/roadmaps');
        if (!response.ok) throw new Error();
        setRoadmaps(await response.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const response = await fetch(`/api/roadmaps?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert(t('deleteError'));
    }
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{t('loadError')}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  const mine = roadmaps.filter((r) => r.isOwner);
  const publicOnes = roadmaps.filter((r) => !r.isOwner);

  return (
    <div className="w-full space-y-10">
      {roadmaps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">{t('empty')}</p>
          <Link
            href="/roadmaps/build"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('createFirst')}
          </Link>
        </div>
      ) : (
        <>
          {mine.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 font-heading">
                {t('myRoadmaps')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mine.map((roadmap) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} onDelete={handleDelete} />
                ))}
                <CreateCard label={t('createNew')} />
              </div>
            </section>
          )}

          <section>
            {mine.length > 0 && (
              <h2 className="text-xl font-bold text-foreground mb-4 font-heading">
                {t('publicRoadmaps')}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicOnes.map((roadmap) => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} onDelete={handleDelete} />
              ))}
              {mine.length === 0 && <CreateCard label={t('createNew')} />}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
