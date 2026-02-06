'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { CalistenicsIcons, type CalistenicsIconType } from './CalistenicsIcons';
import type { RoadmapResource } from '@/types/Roadmap';

export interface BuilderNodeData {
  label: string;
  icon?: CalistenicsIconType;
  color?: string;
  description?: string;
  tips?: string;
  resources?: RoadmapResource[];
  onSelect?: () => void;
  selected?: boolean;
}

interface BuilderNodeProps {
  data: BuilderNodeData;
  selected?: boolean;
}

// Colores predefinidos para nodos
export const nodeColors = [
  { value: '#2563eb', label: 'Azul' },
  { value: '#7c3aed', label: 'Púrpura' },
  { value: '#059669', label: 'Verde' },
  { value: '#dc2626', label: 'Rojo' },
  { value: '#d97706', label: 'Naranja' },
  { value: '#0891b2', label: 'Cian' },
  { value: '#be185d', label: 'Rosa' },
  { value: '#4f46e5', label: 'Índigo' },
  { value: '#eab308', label: 'Amarillo' },
  { value: '#64748b', label: 'Gris' },
];

const BuilderNode: React.FC<BuilderNodeProps> = ({ data, selected = false }) => {
  const IconComponent = data.icon && data.icon !== 'none'
    ? CalistenicsIcons[data.icon]
    : null;

  const bgColor = data.color || '#2563eb';
  const isSelected = selected || data.selected;

  return (
    <>
      {/* Resizer para cambiar tamaño */}
      <NodeResizer
        color={bgColor}
        isVisible={isSelected}
        minWidth={100}
        minHeight={50}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 2,
        }}
      />

      <div
        onClick={(e) => {
          e.stopPropagation();
          data.onSelect?.();
        }}
        className={`
          relative cursor-pointer transition-all duration-200
          rounded-xl border-2 backdrop-blur-sm
          flex items-center justify-center gap-2
          min-w-[100px] min-h-[50px] w-full h-full
          ${isSelected ? 'ring-2 ring-white/50 shadow-lg' : 'hover:shadow-md'}
        `}
        style={{
          backgroundColor: bgColor,
          borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >
        {/* Handles de conexión */}
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="!w-3 !h-3 !bg-white/80 !border-2 !border-white hover:!scale-125 transition-transform"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!w-3 !h-3 !bg-white/80 !border-2 !border-white hover:!scale-125 transition-transform"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!w-3 !h-3 !bg-white/80 !border-2 !border-white hover:!scale-125 transition-transform"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!w-3 !h-3 !bg-white/80 !border-2 !border-white hover:!scale-125 transition-transform"
        />

        {/* Contenido del nodo */}
        <div className="flex items-center gap-2 px-3 py-2 text-white">
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
        <div className="absolute -bottom-1 -right-1 flex gap-0.5">
          {data.description && (
            <div className="w-2.5 h-2.5 bg-white rounded-full border-2"
                 style={{ borderColor: bgColor }} title="Tiene descripción" />
          )}
          {data.resources && data.resources.length > 0 && (
            <div className="w-2.5 h-2.5 bg-tertiary-400 rounded-full border-2"
                 style={{ borderColor: bgColor }} title={`${data.resources.length} recursos`} />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(BuilderNode);
