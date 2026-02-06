'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { ParagraphNodeData } from '@/types/RoadmapNodes';

interface ParagraphNodeProps {
  data: ParagraphNodeData;
  selected?: boolean;
}

const ParagraphNode: React.FC<ParagraphNodeProps> = ({ data, selected = false }) => {
  const fontSize = data.fontSize || 14;
  const color = data.color || 'rgba(255,255,255,0.8)';
  const textAlign = data.textAlign || 'left';
  const lineHeight = data.lineHeight || 1.5;

  return (
    <BaseNode
      data={data}
      selected={selected}
      transparent={true}
      minWidth={150}
      minHeight={50}
      className={`
        ${selected ? 'ring-2 ring-primary-500/30 ring-offset-2 ring-offset-transparent rounded-lg' : ''}
      `}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div
        className="flex items-start w-full h-full px-2 py-1 overflow-hidden"
        style={{ textAlign }}
      >
        <p
          style={{
            fontSize,
            color,
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight,
            margin: 0,
            textAlign,
            width: '100%',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.label}
        </p>
      </div>
    </BaseNode>
  );
};

export default memo(ParagraphNode);
