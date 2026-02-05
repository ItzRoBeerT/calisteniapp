'use client';

import React, { memo } from 'react';
import { useLocale } from 'next-intl';
import BaseNode from '../BaseNode';
import { CalistenicsIcons } from '../../CalistenicsIcons';
import type { ButtonNodeData } from '@/types/RoadmapNodes';

interface ButtonNodeProps {
  data: ButtonNodeData;
  selected?: boolean;
}

const ButtonNode: React.FC<ButtonNodeProps> = ({ data, selected = false }) => {
  const locale = useLocale();
  const backgroundColor = data.backgroundColor || '#BB86FC';
  const textColor = data.textColor || '#ffffff';
  const variant = data.variant || 'solid';

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

    console.log('ButtonNode clicked:', {
      label: data.label,
      mode: data.mode,
      url: data.url,
    });
    e.stopPropagation();

    // En modo viewer, abrir URL
    if (data.mode === 'viewer' && data.url) {
      window.open(getLocalizedUrl(data.url), '_blank', 'noopener,noreferrer');
    } else {
      // En modo builder, seleccionar el nodo
      data.onSelect?.();
    }
  };

  // Estilos según variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderStyle: 'solid' as const,
          borderColor: backgroundColor,
          color: backgroundColor,
        };
      case 'ghost':
        return {
          backgroundColor: `${backgroundColor}20`,
          borderWidth: 0,
          color: backgroundColor,
        };
      case 'solid':
      default:
        return {
          backgroundColor,
          borderWidth: 0,
          color: textColor,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={80}
      minHeight={36}
      resizerColor={backgroundColor}
      className={`
        rounded-lg transition-all duration-200
        ${data.mode === 'viewer' ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-white/50' : ''}
      `}
      style={{
        ...variantStyles,
        boxShadow: selected ? `0 0 20px ${backgroundColor}40` : undefined,
      }}
    >
      <div
        onClick={handleClick}
        className="flex items-center justify-center gap-2 px-4 py-2 w-full h-full"
        style={{ color: variantStyles.color }}
      >
        {IconComponent && (
          <div className="shrink-0">
            <IconComponent size={16} />
          </div>
        )}
        <span
          className="font-semibold text-sm"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {data.label}
        </span>
        {/* Icono de enlace externo en viewer mode */}
        {data.mode === 'viewer' && data.url && (
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </div>
    </BaseNode>
  );
};

export default memo(ButtonNode);
