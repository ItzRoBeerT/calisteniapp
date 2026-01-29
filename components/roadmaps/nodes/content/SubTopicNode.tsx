'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { SubTopicNodeData } from '@/types/RoadmapNodes';

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

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={100}
      minHeight={40}
      resizerColor={baseColor}
      className="rounded-lg"
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: selected ? baseColor : 'rgba(255,255,255,0.15)',
        boxShadow: selected
          ? `0 0 15px ${baseColor}40`
          : 'none',
      }}
    >
      {/* Contenido del nodo */}
      <div className="flex items-center justify-center gap-2 px-3 py-2 text-white/90 w-full h-full">
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
          className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-white/60 rounded-full"
          title="Tiene descripción"
        />
      )}
    </BaseNode>
  );
};

export default memo(SubTopicNode);
