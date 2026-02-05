'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { SubTopicNodeData } from '@/types/RoadmapNodes';
import type { NodeProgress } from '@/types/Roadmap';

// Estilos CSS para animaciones de progreso (más sutiles que topic)
const progressAnimationStyles = `
@keyframes pulse-glow-subtopic {
  0%, 100% {
    box-shadow: 0 0 12px rgba(50, 215, 75, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(50, 215, 75, 0.5);
  }
}

@keyframes pulse-border-subtopic {
  0%, 100% {
    box-shadow: 0 0 10px rgba(187, 134, 252, 0.4);
  }
  50% {
    box-shadow: 0 0 18px rgba(187, 134, 252, 0.5);
  }
}

.subtopic-completed {
  animation: pulse-glow-subtopic 2s ease-in-out infinite;
}

.subtopic-in-progress {
  animation: pulse-border-subtopic 2s ease-in-out infinite;
}
`;

// Iconos de estado (más pequeños que topic)
const CheckIcon = () => (
  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ProgressSpinner = () => (
  <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

// Badge de estado (más pequeño que topic)
const StatusBadge = ({ progress }: { progress: NodeProgress }) => {
  if (progress === 'not_started' || progress === 'skipped') return null;

  return (
    <div
      className={`
        absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full z-20
        flex items-center justify-center
        ${progress === 'completed'
          ? 'bg-secondary-500 shadow-[0_0_8px_rgba(50,215,75,0.6)]'
          : 'bg-primary-500 shadow-[0_0_8px_rgba(187,134,252,0.6)]'}
      `}
    >
      {progress === 'completed' ? <CheckIcon /> : <ProgressSpinner />}
    </div>
  );
};

interface SubTopicNodeProps {
  data: SubTopicNodeData;
  selected?: boolean;
}

// Función para hacer un color más apagado/oscuro
const softenColor = (color: string, amount: number = 0.3): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Blend with background (darker)
  const blend = (c: number) => Math.round(c * (1 - amount) + 30 * amount);

  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
};

const SubTopicNode: React.FC<SubTopicNodeProps> = ({ data, selected = false }) => {
  const IconComponent = data.icon && data.icon !== 'none'
    ? CalistenicsIcons[data.icon]
    : null;

  const baseColor = data.color || '#9A64D6';
  const bgColor = softenColor(baseColor, 0.4);
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
          borderWidth: 2,
        };
      case 'in_progress':
        return {
          borderColor: '#BB86FC',
          borderWidth: 2,
        };
      default:
        return {};
    }
  };

  const getProgressClass = () => {
    if (!isViewer) return '';
    if (progress === 'completed') return 'subtopic-completed';
    if (progress === 'in_progress') return 'subtopic-in-progress';
    return '';
  };

  return (
    <>
      <style>{progressAnimationStyles}</style>
      <BaseNode
        data={data}
        selected={selected}
        minWidth={100}
        minHeight={36}
        resizerColor={baseColor}
        className={`rounded-lg ${getProgressClass()}`}
        style={{
          backgroundColor: bgColor,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: selected ? '#fff' : 'rgba(255,255,255,0.2)',
          ...getProgressStyles(),
        }}
      >
        {/* Badge de estado (solo en viewer) */}
        {isViewer && <StatusBadge progress={progress} />}

        {/* Overlay de progreso */}
        {isViewer && progress === 'completed' && (
          <div className="absolute inset-0 rounded-lg bg-secondary-500/10 pointer-events-none" />
        )}
        {isViewer && progress === 'in_progress' && (
          <div className="absolute inset-0 rounded-lg bg-primary-500/10 pointer-events-none" />
        )}

        {/* Contenido del nodo - igual que topic pero más pequeño */}
        <div className="flex items-center justify-center gap-1.5 px-3 py-2 text-white w-full h-full relative z-10">
          {IconComponent && (
            <div className="shrink-0 opacity-80">
              <IconComponent size={16} className="text-white" />
            </div>
          )}
          <span
            className="font-medium text-xs leading-tight text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {data.label}
          </span>
        </div>

        {/* Indicadores de contenido - igual que topic pero más pequeños */}
        {hasContent && (
          <div className="absolute -bottom-0.5 -right-0.5 flex gap-0.5 z-10">
            {data.description && (
              <div
                className="w-2 h-2 bg-white rounded-full border"
                style={{ borderColor: bgColor }}
                title="Tiene descripción"
              />
            )}
            {data.resources && data.resources.length > 0 && (
              <div
                className="w-2 h-2 bg-tertiary-400 rounded-full border"
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

export default memo(SubTopicNode);
