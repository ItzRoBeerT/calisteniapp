'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { TopicNodeData } from '@/types/RoadmapNodes';
import type { NodeProgress } from '@/types/Roadmap';

// Estilos CSS para animaciones de progreso
const progressAnimationStyles = `
@keyframes pulse-glow-topic {
  0%, 100% {
    box-shadow: 0 0 20px rgba(50, 215, 75, 0.5);
  }
  50% {
    box-shadow: 0 0 35px rgba(50, 215, 75, 0.7);
  }
}

@keyframes pulse-border-topic {
  0%, 100% {
    box-shadow: 0 0 15px rgba(187, 134, 252, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(187, 134, 252, 0.7);
  }
}

.topic-completed {
  animation: pulse-glow-topic 2s ease-in-out infinite;
}

.topic-in-progress {
  animation: pulse-border-topic 2s ease-in-out infinite;
}
`;

// Iconos de estado
const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ProgressSpinner = () => (
  <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

// Badge de estado
const StatusBadge = ({ progress }: { progress: NodeProgress }) => {
  if (progress === 'not_started' || progress === 'skipped') return null;

  return (
    <div
      className={`
        absolute -top-2 -right-2 w-5 h-5 rounded-full z-20
        flex items-center justify-center
        ${progress === 'completed'
          ? 'bg-secondary-500 shadow-[0_0_10px_rgba(50,215,75,0.6)]'
          : 'bg-primary-500 shadow-[0_0_10px_rgba(187,134,252,0.6)]'}
      `}
    >
      {progress === 'completed' ? <CheckIcon /> : <ProgressSpinner />}
    </div>
  );
};

interface TopicNodeProps {
  data: TopicNodeData;
  selected?: boolean;
}

const TopicNode: React.FC<TopicNodeProps> = ({ data, selected = false }) => {
  const IconComponent = data.icon && data.icon !== 'none'
    ? CalistenicsIcons[data.icon]
    : null;

  const bgColor = data.color || '#BB86FC';
  const hasContent = data.description || (data.resources && data.resources.length > 0);
  const progress = data.progress || 'not_started';
  const isViewer = data.mode === 'viewer';

  // Determinar estilos según el progreso (solo en viewer)
  const getProgressStyles = (): React.CSSProperties => {
    if (!isViewer) return {};

    switch (progress) {
      case 'completed':
        return {
          borderColor: '#32D74B',
          borderWidth: 3,
        };
      case 'in_progress':
        return {
          borderColor: '#BB86FC',
          borderWidth: 3,
        };
      default:
        return {};
    }
  };

  const getProgressClass = () => {
    if (!isViewer) return '';
    if (progress === 'completed') return 'topic-completed';
    if (progress === 'in_progress') return 'topic-in-progress';
    return '';
  };

  return (
    <>
      <style>{progressAnimationStyles}</style>
      <BaseNode
        data={data}
        selected={selected}
        minWidth={120}
        minHeight={50}
        resizerColor={bgColor}
        className={`rounded-xl ${getProgressClass()}`}
        style={{
          backgroundColor: bgColor,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: selected ? '#fff' : 'rgba(255,255,255,0.3)',
          ...getProgressStyles(),
        }}
      >
        {/* Badge de estado (solo en viewer) */}
        {isViewer && <StatusBadge progress={progress} />}

        {/* Overlay de progreso */}
        {isViewer && progress === 'completed' && (
          <div className="absolute inset-0 rounded-xl bg-secondary-500/10 pointer-events-none" />
        )}
        {isViewer && progress === 'in_progress' && (
          <div className="absolute inset-0 rounded-xl bg-primary-500/10 pointer-events-none" />
        )}

        {/* Contenido del nodo */}
        <div className="flex items-center justify-center gap-2 px-4 py-3 text-white w-full h-full relative z-10">
          {IconComponent && (
            <div className="shrink-0 opacity-90">
              <IconComponent size={20} className="text-white" />
            </div>
          )}
          <span
            className="font-medium text-sm leading-tight text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {data.label}
          </span>
        </div>

        {/* Indicadores de contenido */}
        {hasContent && (
          <div className="absolute -bottom-1 -right-1 flex gap-0.5 z-10">
            {data.description && (
              <div
                className="w-2.5 h-2.5 bg-white rounded-full border-2"
                style={{ borderColor: bgColor }}
                title="Tiene descripción"
              />
            )}
            {data.resources && data.resources.length > 0 && (
              <div
                className="w-2.5 h-2.5 bg-tertiary-400 rounded-full border-2"
                style={{ borderColor: bgColor }}
                title={`${data.resources.length} recursos`}
              />
            )}
          </div>
        )}
      </BaseNode>
    </>
  );
};

export default memo(TopicNode);
