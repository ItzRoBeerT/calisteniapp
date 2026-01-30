'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { SubTopicNodeData } from '@/types/RoadmapNodes';
import type { NodeProgress } from '@/types/Roadmap';

// Estilos CSS para animaciones de progreso
const progressAnimationStyles = `
@keyframes pulse-glow-subtopic {
  0%, 100% {
    box-shadow: 0 0 15px rgba(50, 215, 75, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(50, 215, 75, 0.6);
  }
}

@keyframes pulse-border-subtopic {
  0%, 100% {
    box-shadow: 0 0 10px rgba(187, 134, 252, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(187, 134, 252, 0.6);
  }
}

.subtopic-completed {
  animation: pulse-glow-subtopic 2s ease-in-out infinite;
}

.subtopic-in-progress {
  animation: pulse-border-subtopic 2s ease-in-out infinite;
}
`;

// Iconos de estado
const CheckIcon = () => (
  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ProgressSpinner = () => (
  <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

// Badge de estado (más pequeño para subtopic)
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

// Función para hacer un color más suave/claro
const softenColor = (color: string, amount: number = 0.3): string => {
  // Simple conversion: reduce opacity effect
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
        minHeight={40}
        resizerColor={baseColor}
        className={`rounded-lg ${getProgressClass()}`}
        style={{
          backgroundColor: bgColor,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: selected ? baseColor : 'rgba(255,255,255,0.15)',
          boxShadow: selected
            ? `0 0 15px ${baseColor}40`
            : 'none',
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

        {/* Contenido del nodo */}
        <div className="flex items-center justify-center gap-2 px-3 py-2 text-white/90 w-full h-full relative z-10">
          {IconComponent && (
            <div className="shrink-0 opacity-70">
              <IconComponent size={16} className="text-white/80" />
            </div>
          )}
          <span
            className="font-medium text-xs leading-tight text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {data.label}
          </span>
        </div>

        {/* Indicador de descripción */}
        {data.description && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-white/60 rounded-full z-10"
            title="Tiene descripción"
          />
        )}
      </BaseNode>
    </>
  );
};

export default memo(SubTopicNode);
