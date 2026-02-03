'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import type { BaseNodeData } from '@/types/RoadmapNodes';

// Estilos CSS para el nodo base
const baseNodeStyles = `
.base-node {
  transition: all 0.2s ease-out;
}

.base-node.selected {
  ring: 2px;
  ring-color: rgba(187, 134, 252, 0.5);
}

.base-node-handle {
  width: 10px !important;
  height: 10px !important;
  background: rgba(187, 134, 252, 0.6) !important;
  border: 2px solid rgba(187, 134, 252, 0.8) !important;
  transition: all 0.2s ease-out !important;
}

.base-node-handle:hover {
  background: rgba(187, 134, 252, 0.9) !important;
  transform: scale(1.2) !important;
}

.base-node-handle-hidden {
  width: 8px !important;
  height: 8px !important;
  min-width: 8px !important;
  min-height: 8px !important;
  border: none !important;
  background: transparent !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
`;

export interface BaseNodeProps {
  children: React.ReactNode;
  data: BaseNodeData;
  selected?: boolean;
  // Configuración de resizer
  resizable?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  // Restricción de resize
  lockAspectRatio?: boolean;
  onlyResizeWidth?: boolean;
  onlyResizeHeight?: boolean;
  // Configuración de handles
  showHandles?: boolean;
  // Estilo
  transparent?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Color del resizer
  resizerColor?: string;
}

const BaseNode: React.FC<BaseNodeProps> = ({
  children,
  data,
  selected = false,
  resizable = true,
  minWidth = 50,
  minHeight = 30,
  maxWidth,
  maxHeight,
  onlyResizeWidth = false,
  onlyResizeHeight = false,
  showHandles = true,
  transparent = false,
  className = '',
  style = {},
  resizerColor = '#BB86FC',
}) => {
  const isBuilder = data.mode === 'builder';
  const isSelected = selected || data.selected;

  // Determinar qué handles mostrar
  const handles = data.handles ?? { top: true, bottom: true, left: true, right: true };

  // Clase para handles según modo
  const handleClass = isBuilder && showHandles ? 'base-node-handle' : 'base-node-handle-hidden';

  // Calcular minHeight/maxHeight si solo resize en una dirección
  const effectiveMinHeight = onlyResizeWidth ? minHeight : minHeight;
  const effectiveMaxHeight = onlyResizeWidth ? minHeight : maxHeight;
  const effectiveMinWidth = onlyResizeHeight ? minWidth : minWidth;
  const effectiveMaxWidth = onlyResizeHeight ? minWidth : maxWidth;

  return (
    <>
      <style>{baseNodeStyles}</style>

      {/* Resizer solo en modo builder */}
      {isBuilder && resizable && (
        <NodeResizer
          color={resizerColor}
          isVisible={isSelected}
          minWidth={effectiveMinWidth}
          minHeight={effectiveMinHeight}
          maxWidth={effectiveMaxWidth}
          maxHeight={effectiveMaxHeight}
          handleStyle={{
            width: 8,
            height: 8,
            borderRadius: 2,
          }}
        />
      )}

      {/* Contenedor principal */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          data.onSelect?.();
        }}
        className={`
          base-node relative cursor-pointer
          ${isSelected ? 'selected ring-2 ring-primary-500/50' : ''}
          ${transparent ? '' : 'backdrop-blur-sm'}
          ${className}
        `}
        style={{
          width: '100%',
          height: '100%',
          minWidth,
          minHeight,
          ...style,
        }}
      >
        {/* Handles de conexión - Top */}
        {handles.top && (
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            className={handleClass}
          />
        )}

        {/* Handles de conexión - Left */}
        {handles.left && (
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className={handleClass}
          />
        )}

        {/* Handles de conexión - Right */}
        {handles.right && (
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className={handleClass}
          />
        )}

        {/* Handles de conexión - Bottom */}
        {handles.bottom && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className={handleClass}
          />
        )}

        {/* Contenido específico del tipo de nodo */}
        {children}
      </div>
    </>
  );
};

export default memo(BaseNode);
