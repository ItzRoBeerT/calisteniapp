'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { VerticalLineNodeData } from '@/types/RoadmapNodes';

interface VerticalLineNodeProps {
  data: VerticalLineNodeData;
  selected?: boolean;
}

const VerticalLineNode: React.FC<VerticalLineNodeProps> = ({ data, selected = false }) => {
  const color = data.color || '#8E8E93';
  const thickness = data.thickness || 2;
  const lineStyle = data.lineStyle || 'solid';

  // Convertir lineStyle a borderStyle CSS
  const getBorderStyle = () => {
    switch (lineStyle) {
      case 'dashed':
        return 'dashed';
      case 'dotted':
        return 'dotted';
      case 'solid':
      default:
        return 'solid';
    }
  };

  return (
    <BaseNode
      data={{ ...data, handles: { top: true, bottom: true, left: false, right: false } }}
      selected={selected}
      minWidth={thickness + 8}
      maxWidth={thickness + 8}
      minHeight={50}
      onlyResizeHeight={true}
      showHandles={data.mode === 'builder'}
      transparent={true}
      className={selected ? 'ring-1 ring-primary-500/30 rounded' : ''}
    >
      <div className="flex items-center justify-center w-full h-full py-1">
        <div
          style={{
            width: 0,
            height: '100%',
            borderLeftWidth: thickness,
            borderLeftStyle: getBorderStyle(),
            borderLeftColor: color,
          }}
        />
      </div>
    </BaseNode>
  );
};

export default memo(VerticalLineNode);
