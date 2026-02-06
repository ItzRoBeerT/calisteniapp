'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { HorizontalLineNodeData } from '@/types/RoadmapNodes';

interface HorizontalLineNodeProps {
  data: HorizontalLineNodeData;
  selected?: boolean;
}

const HorizontalLineNode: React.FC<HorizontalLineNodeProps> = ({ data, selected = false }) => {
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
      data={{ ...data, handles: { left: true, right: true, top: false, bottom: false } }}
      selected={selected}
      minWidth={50}
      minHeight={thickness + 8}
      maxHeight={thickness + 8}
      onlyResizeWidth={true}
      showHandles={data.mode === 'builder'}
      transparent={true}
      className={selected ? 'ring-1 ring-primary-500/30 rounded' : ''}
    >
      <div className="flex items-center justify-center w-full h-full px-1">
        <div
          style={{
            width: '100%',
            height: 0,
            borderTopWidth: thickness,
            borderTopStyle: getBorderStyle(),
            borderTopColor: color,
          }}
        />
      </div>
    </BaseNode>
  );
};

export default memo(HorizontalLineNode);
