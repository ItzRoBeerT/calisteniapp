'use client';

import React, { memo, useState } from 'react';
import BaseNode from '../BaseNode';
import type { ImageNodeData } from '@/types/RoadmapNodes';

interface ImageNodeProps {
  data: ImageNodeData;
  selected?: boolean;
}

const ImageNode: React.FC<ImageNodeProps> = ({ data, selected = false }) => {
  const [imageError, setImageError] = useState(false);
  const objectFit = data.objectFit || 'cover';
  const borderRadius = data.borderRadius || 8;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (data.mode === 'viewer' && data.linkUrl) {
      window.open(data.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      data.onSelect?.();
    }
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={100}
      minHeight={80}
      className={`
        overflow-hidden transition-all duration-200
        ${data.mode === 'viewer' && data.linkUrl ? 'hover:scale-[1.02] cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-primary-500/50' : ''}
      `}
      style={{
        borderRadius,
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
      }}
    >
      <div
        onClick={handleClick}
        className="w-full h-full relative"
        style={{ borderRadius }}
      >
        {data.imageUrl && !imageError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt={data.alt || data.label}
              onError={() => setImageError(true)}
              className="w-full h-full"
              style={{
                objectFit,
                borderRadius,
              }}
            />
            {/* Overlay con link indicator en viewer mode */}
            {data.mode === 'viewer' && data.linkUrl && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            )}
          </>
        ) : (
          // Placeholder cuando no hay imagen o hay error
          <div className="w-full h-full flex flex-col items-center justify-center text-foreground/30">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">
              {imageError ? 'Error al cargar' : 'Sin imagen'}
            </span>
          </div>
        )}

        {/* Label overlay */}
        {data.label && data.imageUrl && !imageError && (
          <div
            className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 text-white text-xs truncate"
            style={{
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              }}
          >
            {data.label}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default memo(ImageNode);
