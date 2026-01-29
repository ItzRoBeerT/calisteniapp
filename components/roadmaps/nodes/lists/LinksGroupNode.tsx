'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { LinksGroupNodeData } from '@/types/RoadmapNodes';

interface LinksGroupNodeProps {
  data: LinksGroupNodeData;
  selected?: boolean;
}

const LinksGroupNode: React.FC<LinksGroupNodeProps> = ({ data, selected = false }) => {
  const items = data.items || [];
  const isViewer = data.mode === 'viewer';

  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isViewer && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={160}
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
      <div className="flex flex-col w-full h-full p-3">
        {/* Header */}
        {data.label && (
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span
              className="text-sm font-semibold text-foreground/90"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {data.label}
            </span>
          </div>
        )}

        {/* Links */}
        <div className="flex-1 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const IconComponent = item.icon && item.icon !== 'none'
              ? CalistenicsIcons[item.icon]
              : null;

            return (
              <div
                key={item.id}
                onClick={(e) => handleLinkClick(item.url, e)}
                className={`
                  flex items-center gap-2 p-1.5 rounded
                  ${isViewer ? 'cursor-pointer hover:bg-primary-500/10' : ''}
                  transition-colors
                `}
              >
                {/* Icon */}
                {IconComponent ? (
                  <div className="text-primary-400 shrink-0">
                    <IconComponent size={14} />
                  </div>
                ) : (
                  <svg className="w-3.5 h-3.5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}

                {/* Label */}
                <span
                  className={`
                    text-xs flex-1 truncate
                    ${isViewer ? 'text-primary-400 hover:underline' : 'text-foreground/70'}
                  `}
                >
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* Empty state */}
          {items.length === 0 && (
            <div className="text-xs text-foreground/30 text-center py-2">
              Sin enlaces
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
};

export default memo(LinksGroupNode);
