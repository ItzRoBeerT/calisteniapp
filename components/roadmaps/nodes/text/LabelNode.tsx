'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { LabelNodeData } from '@/types/RoadmapNodes';

interface LabelNodeProps {
  data: LabelNodeData;
  selected?: boolean;
}

const LabelNode: React.FC<LabelNodeProps> = ({ data, selected = false }) => {
  const fontSize = data.fontSize || 12;
  const color = data.color || 'rgba(255,255,255,0.7)';
  const backgroundColor = data.backgroundColor || 'rgba(255,255,255,0.05)';
  const padding = data.padding || 8;

  return (
    <BaseNode
      data={data}
      selected={selected}
      transparent={false}
      minWidth={60}
      minHeight={28}
      // Solo crece horizontalmente
      onlyResizeWidth={true}
      className={`rounded-md ${selected ? 'ring-2 ring-primary-500/30' : ''}`}
      style={{
        backgroundColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: selected ? 'rgba(187, 134, 252, 0.5)' : 'rgba(255,255,255,0.1)',
      }}
    >
      <div
        className="flex items-center justify-center w-full h-full whitespace-nowrap"
        style={{ padding }}
      >
        <span
          style={{
            fontSize,
            color,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
          }}
        >
          {data.label}
        </span>
      </div>
    </BaseNode>
  );
};

export default memo(LabelNode);
