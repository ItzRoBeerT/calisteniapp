'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { NodeDetailPanelProps, NodeProgress } from '@/types/Roadmap';
import { progressConfig } from '@/types/Roadmap';
import NodeResourceList from './NodeResourceList';

// Iconos SVG
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TipIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// Botón de estado de progreso
const ProgressButton = ({
  status,
  currentProgress,
  onClick,
  label,
}: {
  status: NodeProgress;
  currentProgress: NodeProgress;
  onClick: () => void;
  label: string;
}) => {
  const isActive = currentProgress === status;
  const config = progressConfig[status];

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300
        font-medium tracking-wide
        ${
          isActive
            ? `${config.bgColor} ${config.color} border-current shadow-lg`
            : 'border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground/70'
        }
      `}
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {label}
    </button>
  );
};

export default function NodeDetailPanel({
  node,
  nodeId,
  isOpen,
  onClose,
  onProgressChange,
}: NodeDetailPanelProps) {
  const t = useTranslations('RoadmapViewer');

  // Cerrar con ESC
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el panel está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  const content = node?.content;
  const currentProgress = content?.progress || 'not_started';

  return (
    <>
      {/* Backdrop oscuro */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Panel lateral */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-full sm:w-96 z-50
          bg-surface/95 backdrop-blur-xl
          border-l border-primary-500/20
          shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
          transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          overflow-hidden flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Efecto de brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

        {/* Header con glassmorphism */}
        <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-foreground/10 p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2
                className="text-xl font-bold text-foreground truncate"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {content?.title || node?.label || t('noTitle')}
              </h2>
              {node?.nodeType && (
                <span className="text-xs text-primary-400/70 uppercase tracking-wider mt-1 block">
                  {node.nodeType}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg text-foreground/50 hover:text-foreground
                         hover:bg-foreground/10 transition-colors"
              aria-label={t('close')}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {content ? (
            <>
              {/* Estado de progreso */}
              <section className="space-y-3">
                <h3
                  className="text-sm font-semibold text-foreground/60 uppercase tracking-wider"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t('progress')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(['not_started', 'in_progress', 'completed'] as NodeProgress[]).map((status) => (
                    <ProgressButton
                      key={status}
                      status={status}
                      currentProgress={currentProgress}
                      onClick={() => nodeId && onProgressChange(nodeId, status)}
                      label={t(`status.${status}`)}
                    />
                  ))}
                </div>
              </section>

              {/* Descripción */}
              <section className="space-y-3">
                <h3
                  className="text-sm font-semibold text-foreground/60 uppercase tracking-wider"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t('description')}
                </h3>
                <p
                  className="text-foreground/80 leading-relaxed"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {content.description}
                </p>
              </section>

              {/* Tips/Consejos */}
              {content.tips && (
                <section className="space-y-2">
                  <div
                    className="bg-tertiary-500/10 border border-tertiary-500/30 rounded-xl p-4
                               shadow-[inset_0_1px_0_rgba(3,218,197,0.1)]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-tertiary-400">
                        <TipIcon />
                      </span>
                      <h3
                        className="text-sm font-semibold text-tertiary-400"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {t('tips')}
                      </h3>
                    </div>
                    <p
                      className="text-sm text-foreground/70 leading-relaxed"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {content.tips}
                    </p>
                  </div>
                </section>
              )}

              {/* Recursos */}
              <section className="space-y-3">
                <h3
                  className="text-sm font-semibold text-foreground/60 uppercase tracking-wider"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t('resources')} ({content.resources?.length || 0})
                </h3>
                <NodeResourceList resources={content.resources || []} />
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-foreground/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-foreground/50">{t('noContent')}</p>
            </div>
          )}
        </div>

        {/* Footer con efecto de brillo */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      </aside>
    </>
  );
}
