'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { TopicNodeData } from '@/types/RoadmapNodes';

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

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={120}
      minHeight={50}
      resizerColor={bgColor}
      className="rounded-xl"
      style={{
        backgroundColor: bgColor,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: selected ? '#fff' : 'rgba(255,255,255,0.3)',
      }}
    >
      {/* Contenido del nodo */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 text-white w-full h-full">
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
        <div className="absolute -bottom-1 -right-1 flex gap-0.5">
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
  );
};

export default memo(TopicNode);
