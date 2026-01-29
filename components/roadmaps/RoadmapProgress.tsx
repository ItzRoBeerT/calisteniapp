'use client';

import { useTranslations } from 'next-intl';
import type { RoadmapProgressProps } from '@/types/Roadmap';

export default function RoadmapProgress({
  completedNodes,
  totalNodes,
  percentage,
}: RoadmapProgressProps) {
  const t = useTranslations('RoadmapViewer');

  // Determinar el color de la barra según el progreso
  const getProgressColor = () => {
    if (percentage >= 100) return 'from-secondary-500 to-secondary-400';
    if (percentage >= 50) return 'from-primary-500 to-tertiary-500';
    return 'from-primary-600 to-primary-400';
  };

  // Determinar el glow según el progreso
  const getGlowColor = () => {
    if (percentage >= 100) return 'shadow-[0_0_20px_rgba(50,215,75,0.4)]';
    if (percentage >= 50) return 'shadow-[0_0_15px_rgba(187,134,252,0.3)]';
    return 'shadow-[0_0_10px_rgba(187,134,252,0.2)]';
  };

  return (
    <div className="bg-surface/80 backdrop-blur-md rounded-2xl p-5 border border-foreground/10">
      {/* Header con stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-sm font-semibold text-foreground/60 uppercase tracking-wider"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('progressBar.title')}
          </h3>
          <p
            className="text-xs text-foreground/40 mt-0.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('progressBar.completed', { count: completedNodes, total: totalNodes })}
          </p>
        </div>

        {/* Porcentaje grande */}
        <div className="text-right">
          <span
            className={`text-3xl font-bold tabular-nums ${
              percentage >= 100 ? 'text-secondary-400' : 'text-primary-400'
            }`}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {percentage}
          </span>
          <span className="text-lg text-foreground/40 ml-0.5">%</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="relative">
        {/* Track de fondo */}
        <div className="h-3 bg-foreground/10 rounded-full overflow-hidden">
          {/* Barra de progreso animada */}
          <div
            className={`
              h-full rounded-full transition-all duration-700 ease-out
              bg-gradient-to-r ${getProgressColor()}
              ${getGlowColor()}
            `}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            {/* Efecto de brillo interno */}
            <div className="h-full w-full bg-gradient-to-b from-white/20 to-transparent rounded-full" />
          </div>
        </div>

        {/* Marcadores de progreso (cada 25%) */}
        <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div
              key={mark}
              className={`w-0.5 h-full transition-colors duration-300 ${
                percentage >= mark ? 'bg-transparent' : 'bg-foreground/10'
              }`}
              style={{ opacity: mark === 0 || mark === 100 ? 0 : 1 }}
            />
          ))}
        </div>
      </div>

      {/* Indicadores de milestone */}
      <div className="flex justify-between mt-2 text-xs text-foreground/30">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      {/* Mensaje motivacional */}
      {percentage >= 100 && (
        <div
          className="mt-4 p-3 rounded-xl bg-secondary-500/10 border border-secondary-500/30
                     flex items-center gap-2 animate-fade-in"
        >
          <svg
            className="w-5 h-5 text-secondary-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            className="text-sm text-secondary-400 font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('progressBar.complete')}
          </span>
        </div>
      )}
    </div>
  );
}
