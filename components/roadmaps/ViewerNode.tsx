'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { ViewerNodeProps, NodeProgress } from '@/types/Roadmap';

// Estilos CSS para animaciones de nodos
const nodeAnimationStyles = `
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(50, 215, 75, 0.4), inset 0 0 8px rgba(50, 215, 75, 0.1);
  }
  50% {
    box-shadow: 0 0 35px rgba(50, 215, 75, 0.5), inset 0 0 12px rgba(50, 215, 75, 0.15);
  }
}

@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 0 15px rgba(187, 134, 252, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(187, 134, 252, 0.4);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}
`;

// Iconos SVG inline para evitar dependencias
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ProgressIcon = () => (
  <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

// Estilos base del nodo según el estado
const getNodeStyles = (progress: NodeProgress, selected: boolean) => {
  const baseStyles = `
    relative cursor-pointer transition-all duration-300 ease-out
    rounded-xl font-medium
    flex items-center justify-center text-center
    border-2 backdrop-blur-sm
  `;

  const stateStyles: Record<NodeProgress, string> = {
    not_started: `
      bg-[#2a2a2a]/90 border-[#555] text-foreground/70
      hover:border-primary-500/60 hover:shadow-[0_0_20px_rgba(187,134,252,0.2)]
    `,
    in_progress: `
      bg-[#2a2a2a]/90 border-primary-500 text-foreground
      shadow-[0_0_25px_rgba(187,134,252,0.3)]
      animate-pulse-border
    `,
    completed: `
      bg-[#1a2f1a]/90 border-secondary-500 text-foreground
      shadow-[0_0_25px_rgba(50,215,75,0.4)]
      animate-pulse-glow
    `,
    skipped: `
      bg-[#2a2a2a]/50 border-[#444] text-foreground/40
      opacity-60
    `,
  };

  const selectedStyles = selected
    ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-background scale-105'
    : 'hover:scale-[1.03] hover:-translate-y-1';

  return `${baseStyles} ${stateStyles[progress]} ${selectedStyles}`;
};

// Componente del badge de estado
const StatusBadge = ({ progress }: { progress: NodeProgress }) => {
  if (progress === 'not_started' || progress === 'skipped') return null;

  const badgeStyles: Record<string, string> = {
    in_progress: 'bg-primary-500 text-white shadow-[0_0_10px_rgba(187,134,252,0.6)]',
    completed: 'bg-secondary-500 text-white shadow-[0_0_10px_rgba(50,215,75,0.6)]',
  };

  return (
    <div
      className={`
        absolute -top-2 -right-2 w-5 h-5 rounded-full
        flex items-center justify-center z-10
        ${badgeStyles[progress]}
      `}
    >
      {progress === 'completed' ? <CheckIcon /> : <ProgressIcon />}
    </div>
  );
};

// Handle invisible para mantener las conexiones sin mostrar los puntos
const InvisibleHandle = ({
  type,
  position,
  id,
}: {
  type: 'source' | 'target';
  position: Position;
  id: string;
}) => (
  <Handle
    type={type}
    position={position}
    id={id}
    className="!w-0 !h-0 !min-w-0 !min-h-0 !border-0 !bg-transparent !opacity-0 !pointer-events-none"
  />
);

// Componente principal del nodo
const ViewerNode: React.FC<ViewerNodeProps> = ({ data, selected = false }) => {
  const progress = data.progress || data.content?.progress || 'not_started';
  const width = data.width || 160;
  const height = data.height || 70;
  const fontSize = data.fontSize || 14;

  return (
    <>
      <style>{nodeAnimationStyles}</style>
      <div
      onClick={(e) => {
        e.stopPropagation();
        data.onSelect?.();
      }}
      className={getNodeStyles(progress, selected || !!data.selected)}
      style={{
        width,
        height,
        fontSize,
      }}
    >
      {/* Handles invisibles para mantener conexiones */}
      <InvisibleHandle type="target" position={Position.Top} id="top" />
      <InvisibleHandle type="target" position={Position.Left} id="left" />
      <InvisibleHandle type="source" position={Position.Right} id="right" />
      <InvisibleHandle type="source" position={Position.Bottom} id="bottom" />

      {/* Badge de estado */}
      <StatusBadge progress={progress} />

      {/* Efecto de borde brillante para nodos activos */}
      {(progress === 'in_progress' || progress === 'completed') && (
        <div
          className={`
            absolute inset-0 rounded-xl pointer-events-none
            ${progress === 'completed' ? 'bg-secondary-500/5' : 'bg-primary-500/5'}
          `}
        />
      )}

      {/* Contenido del nodo */}
      <div className="px-3 py-2 z-10 relative">
        <span
          className="block leading-tight"
          style={{
            fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
            fontWeight: progress === 'completed' ? 600 : 500,
          }}
        >
          {data.label}
        </span>
      </div>

      {/* Indicador visual de tipo de nodo */}
      {data.nodeType === 'milestone' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-tertiary-500" />
      )}
    </div>
    </>
  );
};

export default memo(ViewerNode);
