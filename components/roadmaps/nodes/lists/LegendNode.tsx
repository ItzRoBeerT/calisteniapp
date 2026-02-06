'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { LegendNodeData } from '@/types/RoadmapNodes';

interface LegendNodeProps {
  data: LegendNodeData;
  selected?: boolean;
}

const LegendNode: React.FC<LegendNodeProps> = ({ data, selected = false }) => {
  const items = data.items || [];
  const orientation = data.orientation || 'vertical';

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={orientation === 'horizontal' ? 200 : 140}
      minHeight={orientation === 'horizontal' ? 50 : 80}
      className={`
        rounded-xl transition-all duration-200
        ${selected ? 'ring-2 ring-primary-500/50' : ''}
      `}
      style={{
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: selected ? 'rgba(187, 134, 252, 0.5)' : 'rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex flex-col w-full h-full p-3">
        {/* Header */}
        {data.label && (
          <div className="mb-2">
            <span
              className="text-xs font-semibold text-foreground/60 uppercase tracking-wider"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {data.label}
            </span>
          </div>
        )}

        {/* Items */}
        <div
          className={`
            flex gap-2 flex-1
            ${orientation === 'horizontal' ? 'flex-row flex-wrap items-center' : 'flex-col'}
          `}
        >
          {items.map((item) => {
            const IconComponent = item.icon && item.icon !== 'none'
              ? CalistenicsIcons[item.icon]
              : null;

            return (
              <div
                key={item.id}
                className="flex items-center gap-2"
              >
                {/* Icon or color dot */}
                {IconComponent ? (
                  <div style={{ color: item.color || '#BB86FC' }}>
                    <IconComponent size={14} />
                  </div>
                ) : (
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#BB86FC' }}
                  />
                )}

                {/* Label */}
                <span
                  className="text-xs text-foreground/70"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* Empty state */}
          {items.length === 0 && (
            <div className="text-xs text-foreground/30 text-center py-2">
              Sin elementos
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
};

export default memo(LegendNode);
