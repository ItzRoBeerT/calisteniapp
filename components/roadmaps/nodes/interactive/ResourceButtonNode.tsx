'use client';

import React, { memo } from 'react';
import { useLocale } from 'next-intl';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { ResourceButtonNodeData } from '@/types/RoadmapNodes';

interface ResourceButtonNodeProps {
  data: ResourceButtonNodeData;
  selected?: boolean;
}

const ResourceButtonNode: React.FC<ResourceButtonNodeProps> = ({ data, selected = false }) => {
  const locale = useLocale();
  const backgroundColor = data.backgroundColor || '#32D74B';
  const textColor = data.textColor || '#ffffff';
  const badgeText = data.badgeText || '';
  const badgeTextColor = data.badgeTextColor || '#ffffff';
  const badgeBackgroundColor = data.badgeBackgroundColor || 'rgba(0,0,0,0.3)';

  const IconComponent = data.icon && data.icon !== 'none'
    ? CalistenicsIcons[data.icon]
    : null;

  const getLocalizedUrl = (url: string): string => {
    const isInternal = url.startsWith('/') && !url.startsWith('//');
    if (isInternal) {
      return `/${locale}${url}`;
    }
    return url;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (data.mode === 'viewer' && data.url) {
      window.open(getLocalizedUrl(data.url), '_blank', 'noopener,noreferrer');
    } else {
      data.onSelect?.();
    }
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={120}
      minHeight={44}
      resizerColor={backgroundColor}
      className={`
        rounded-xl transition-all duration-200
        ${data.mode === 'viewer' ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-white/50' : ''}
      `}
      style={{
        backgroundColor,
        boxShadow: selected ? `0 0 20px ${backgroundColor}40` : undefined,
      }}
    >
      <div
        onClick={handleClick}
        className="flex items-center gap-3 px-4 py-2.5 w-full h-full relative"
        style={{ color: textColor }}
      >
        {/* Icon */}
        {IconComponent && (
          <div className="shrink-0">
            <IconComponent size={18} />
          </div>
        )}

        {/* Label */}
        <span
          className="font-semibold text-sm flex-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {data.label}
        </span>

        {/* Badge */}
        {badgeText && (
          <div
            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
            style={{
              backgroundColor: badgeBackgroundColor,
              color: badgeTextColor,
            }}
          >
            {badgeText}
          </div>
        )}

        {/* Flecha */}
        <svg className="w-4 h-4 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </BaseNode>
  );
};

export default memo(ResourceButtonNode);
