"use client";
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

interface RoadmapSummary {
  id: string;
  title: string;
  description?: string;
  totalNodes?: number;
  completedNodes?: number;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
}

export default function RoadmapsList() {
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDebug = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch('/api/roadmaps');
        if (!response.ok) {
          throw new Error('Error al cargar roadmaps');
        }
        const data = await response.json();
        setRoadmaps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

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
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid de roadmaps */}
      <section className="w-full">
        {roadmaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No hay roadmaps disponibles.</p>
            {isDebug && (
              <Link
                href="/roadmaps/build"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear primer roadmap
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <Link
                key={roadmap.id}
                href={{ pathname: '/roadmaps/[id]', params: { id: roadmap.id } }}
                className="group relative border border-white/10 rounded-xl p-5 bg-surface/50 backdrop-blur-sm
                         shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                         hover:border-primary-500/50 hover:bg-surface/80"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <h2
                    className="text-lg font-bold mb-2 text-foreground group-hover:text-primary-400 transition-colors"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {roadmap.title}
                  </h2>

                  {roadmap.description && (
                    <p
                      className="text-sm text-foreground/60 mb-4 line-clamp-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {roadmap.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-foreground/40">
                    {roadmap.totalNodes !== undefined && roadmap.totalNodes > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        {roadmap.totalNodes} nodos
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
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100
                              transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}

            {/* Create new roadmap card */}
            {isDebug && (
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
                <span
                  className="text-sm font-medium text-foreground/60 group-hover:text-primary-400 transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Crear nuevo roadmap
                </span>
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
