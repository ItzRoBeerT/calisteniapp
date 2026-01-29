'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { TodoNodeData } from '@/types/RoadmapNodes';

interface TodoNodeProps {
  data: TodoNodeData;
  selected?: boolean;
}

const TodoNode: React.FC<TodoNodeProps> = ({ data, selected = false }) => {
  const isViewer = data.mode === 'viewer';
  const isChecked = data.checked;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isViewer) {
      // En viewer mode, toggle checkbox
      data.onCheckedChange?.(!isChecked);
    } else {
      // En builder mode, seleccionar
      data.onSelect?.();
    }
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={150}
      minHeight={36}
      onlyResizeWidth={true}
      className={`
        rounded-lg transition-all duration-200
        ${selected ? 'ring-2 ring-primary-500/50' : ''}
      `}
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isChecked ? 'rgba(50, 215, 75, 0.5)' : 'rgba(255,255,255,0.1)',
      }}
    >
      <div
        onClick={handleToggle}
        className={`
          flex items-center gap-3 px-3 py-2 w-full h-full
          ${isViewer ? 'cursor-pointer hover:bg-white/5' : ''}
        `}
      >
        {/* Checkbox */}
        <div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
            transition-all duration-200
            ${isChecked
              ? 'bg-secondary-500 border-secondary-500'
              : 'bg-transparent border-foreground/30 hover:border-foreground/50'
            }
          `}
        >
          {isChecked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Label */}
        <span
          className={`
            text-sm flex-1
            ${isChecked ? 'text-foreground/50 line-through' : 'text-foreground/80'}
          `}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {data.label}
        </span>
      </div>
    </BaseNode>
  );
};

export default memo(TodoNode);
