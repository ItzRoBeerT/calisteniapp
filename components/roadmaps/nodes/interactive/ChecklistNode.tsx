'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { ChecklistNodeData } from '@/types/RoadmapNodes';

interface ChecklistNodeProps {
  data: ChecklistNodeData;
  selected?: boolean;
}

const ChecklistNode: React.FC<ChecklistNodeProps> = ({ data, selected = false }) => {
  const isViewer = data.mode === 'viewer';
  const items = data.items || [];
  const completedCount = items.filter((item) => item.checked).length;

  const handleItemToggle = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isViewer) {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        data.onItemChange?.(itemId, !item.checked);
      }
    }
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isViewer) {
      data.onSelect?.();
    }
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={180}
      minHeight={80}
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
      <div onClick={handleNodeClick} className="flex flex-col w-full h-full p-3">
        {/* Header con título y progreso */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm font-semibold text-foreground/90"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {data.label}
          </span>
          <span className="text-xs text-foreground/50">
            {completedCount}/{items.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-foreground/10 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-secondary-500 rounded-full transition-all duration-300"
            style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
          />
        </div>

        {/* Items */}
        <div className="flex-1 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={(e) => handleItemToggle(item.id, e)}
              className={`
                flex items-center gap-2 p-1.5 rounded
                ${isViewer ? 'cursor-pointer hover:bg-white/5' : ''}
              `}
            >
              {/* Checkbox mini */}
              <div
                className={`
                  w-4 h-4 rounded border flex items-center justify-center shrink-0
                  transition-all duration-200
                  ${item.checked
                    ? 'bg-secondary-500 border-secondary-500'
                    : 'bg-transparent border-foreground/30'
                  }
                `}
              >
                {item.checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Item text */}
              <span
                className={`
                  text-xs flex-1
                  ${item.checked ? 'text-foreground/40 line-through' : 'text-foreground/70'}
                `}
              >
                {item.text}
              </span>
            </div>
          ))}

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

export default memo(ChecklistNode);
