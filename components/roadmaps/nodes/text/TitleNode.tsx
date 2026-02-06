'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { TitleNodeData } from '@/types/RoadmapNodes';

interface TitleNodeProps {
  data: TitleNodeData;
  selected?: boolean;
}

const TitleNode: React.FC<TitleNodeProps> = ({ data, selected = false }) => {
  const fontSize = data.fontSize || 32;
  const fontWeight = data.fontWeight || 700;
  const color = data.color || '#ffffff';
  const textAlign = data.textAlign || 'center';

  return (
    <BaseNode
      data={data}
      selected={selected}
      transparent={true}
      minWidth={100}
      minHeight={30}
      className={`
        ${selected ? 'ring-2 ring-primary-500/30 ring-offset-2 ring-offset-transparent rounded-lg' : ''}
      `}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div
        className="flex items-center justify-center w-full h-full px-2"
        style={{ textAlign }}
      >
        <h1
          style={{
            fontSize,
            fontWeight,
            color,
            fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
            lineHeight: 1.2,
            margin: 0,
            textAlign,
            width: '100%',
          }}
        >
          {data.label}
        </h1>
      </div>
    </BaseNode>
  );
};

export default memo(TitleNode);
