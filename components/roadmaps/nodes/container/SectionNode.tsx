'use client';

import React, { memo } from 'react';
import BaseNode from '../BaseNode';
import type { SectionNodeData } from '@/types/RoadmapNodes';

interface SectionNodeProps {
  data: SectionNodeData;
  selected?: boolean;
}

const SectionNode: React.FC<SectionNodeProps> = ({ data, selected = false }) => {
  const backgroundColor = data.backgroundColor || 'rgba(30, 30, 30, 0.5)';
  const borderColor = data.borderColor || 'rgba(187, 134, 252, 0.3)';
  const padding = data.padding || 16;

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={200}
      minHeight={150}
      resizerColor="#BB86FC"
      className={`
        rounded-2xl transition-all duration-200
        ${selected ? 'ring-2 ring-primary-500/50' : ''}
      `}
      style={{
        backgroundColor,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: selected ? '#BB86FC' : borderColor,
        padding,
      }}
    >
      {/* Título de la sección */}
      {data.label && (
        <div
          className="absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: '#BB86FC',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {data.label}
        </div>
      )}

      {/* Área vacía para contener otros nodos */}
      <div className="w-full h-full flex items-center justify-center">
        {/* En el builder, mostrar hint */}
        {data.mode === 'builder' && (
          <div className="text-foreground/20 text-xs text-center pointer-events-none">
            <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Arrastra nodos aquí
          </div>
        )}
      </div>

      {/* Badge de grupo */}
      <div
        className="absolute -bottom-2 right-4 px-2 py-0.5 rounded text-xs"
        style={{
          backgroundColor: 'rgba(187, 134, 252, 0.2)',
          color: 'rgba(187, 134, 252, 0.8)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Sección
      </div>
    </BaseNode>
  );
};

export default memo(SectionNode);
