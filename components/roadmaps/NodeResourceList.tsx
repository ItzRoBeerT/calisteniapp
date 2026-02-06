'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { NodeResourceListProps, RoadmapResource, ResourceType } from '@/types/Roadmap';

// Helper para añadir locale a URLs internas
const getLocalizedUrl = (url: string, locale: string): string => {
  const isInternal = url.startsWith('/') && !url.startsWith('//');
  if (isInternal) {
    return `/${locale}${url}`;
  }
  return url;
};

// Iconos SVG por tipo de recurso
const ResourceIcons: Record<ResourceType, React.FC<{ className?: string }>> = {
  video: ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  ),
  article: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  documentation: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  course: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  tool: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  github: ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  exercise: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  workout: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  post: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
};

// Colores por tipo de recurso
const resourceColors: Record<ResourceType, { bg: string; border: string; text: string; hover: string }> = {
  video: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    hover: 'hover:border-red-500/60 hover:bg-red-500/15',
  },
  article: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hover: 'hover:border-blue-500/60 hover:bg-blue-500/15',
  },
  documentation: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-500/60 hover:bg-emerald-500/15',
  },
  course: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    hover: 'hover:border-purple-500/60 hover:bg-purple-500/15',
  },
  tool: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    hover: 'hover:border-yellow-500/60 hover:bg-yellow-500/15',
  },
  github: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    hover: 'hover:border-gray-500/60 hover:bg-gray-500/15',
  },
  exercise: {
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/30',
    text: 'text-primary-400',
    hover: 'hover:border-primary-500/60 hover:bg-primary-500/15',
  },
  workout: {
    bg: 'bg-secondary-500/10',
    border: 'border-secondary-500/30',
    text: 'text-secondary-400',
    hover: 'hover:border-secondary-500/60 hover:bg-secondary-500/15',
  },
  post: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    hover: 'hover:border-orange-500/60 hover:bg-orange-500/15',
  },
};

// Componente de tarjeta de recurso individual
const ResourceCard = ({ resource }: { resource: RoadmapResource }) => {
  const t = useTranslations('RoadmapViewer');
  const locale = useLocale();
  const colors = resourceColors[resource.type];
  const IconComponent = ResourceIcons[resource.type];

  return (
    <a
      href={getLocalizedUrl(resource.url, locale)}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex items-start gap-3 p-3.5 rounded-xl border-2
        transition-all duration-300 ease-out
        ${colors.bg} ${colors.border} ${colors.hover}
        hover:scale-[1.02] hover:shadow-lg
      `}
    >
      {/* Icono del tipo de recurso */}
      <div className={`shrink-0 mt-0.5 ${colors.text}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold text-foreground truncate group-hover:text-primary-300 transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {resource.title}
        </h4>

        {/* Metadatos */}
        <div className="flex items-center gap-2 mt-1 text-xs text-foreground/50">
          {resource.provider && <span>{resource.provider}</span>}
          {resource.duration && (
            <>
              <span className="w-1 h-1 rounded-full bg-foreground/30" />
              <span>{resource.duration}</span>
            </>
          )}
        </div>

        {/* Descripción */}
        {resource.description && (
          <p
            className="text-xs text-foreground/60 mt-2 line-clamp-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {resource.description}
          </p>
        )}
      </div>

      {/* Badge de gratis */}
      {resource.isFree && (
        <span
          className="shrink-0 text-xs px-2 py-0.5 rounded-full
                     bg-secondary-500/20 text-secondary-400 border border-secondary-500/30
                     font-medium uppercase tracking-wide"
        >
          {t('free')}
        </span>
      )}

      {/* Icono de link externo */}
      <svg
        className="shrink-0 w-4 h-4 text-foreground/30 group-hover:text-foreground/60 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
};

// Componente principal de lista de recursos
export default function NodeResourceList({ resources }: NodeResourceListProps) {
  const t = useTranslations('RoadmapViewer');

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-foreground/5 flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-sm text-foreground/40 italic">{t('noResources')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
