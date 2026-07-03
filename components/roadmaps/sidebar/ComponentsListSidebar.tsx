'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, RoadmapNodeType } from '@/types/RoadmapNodes';

interface ComponentsListSidebarProps {
  nodes: Node<AnyNodeData>[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

// Mapeo de tipo de nodo a etiqueta legible
const nodeTypeLabels: Record<RoadmapNodeType, string> = {
  title: 'Título',
  topic: 'Tema',
  subtopic: 'Subtema',
  image: 'Imagen',
  video: 'Video',
  section: 'Sección',
};

// Colores por tipo de nodo
const nodeTypeColors: Record<RoadmapNodeType, string> = {
  title: '#BB86FC',
  topic: '#BB86FC',
  subtopic: '#9A64D6',
  image: '#64748b',
  video: '#FF3B30',
  section: 'rgba(187, 134, 252, 0.5)',
};

const ComponentsListSidebar: React.FC<ComponentsListSidebarProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
}) => {
  // Ordenar nodos: sections primero, luego por posición Y
  const sortedNodes = [...nodes].sort((a, b) => {
    // Sections primero
    if (a.data.nodeType === 'section' && b.data.nodeType !== 'section') return -1;
    if (b.data.nodeType === 'section' && a.data.nodeType !== 'section') return 1;
    // Luego por posición Y
    return a.position.y - b.position.y;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span
            className="text-sm font-semibold text-foreground/90"
          >
            Componentes
          </span>
        </div>
        <span className="text-xs text-foreground/50 bg-foreground/10 px-2 py-0.5 rounded">
          {nodes.length}
        </span>
      </div>

      {/* Lista de componentes */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedNodes.length === 0 ? (
          <div className="text-center py-8 text-foreground/30 text-sm">
            <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Sin componentes
          </div>
        ) : (
          sortedNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const nodeType = node.data.nodeType;
            const color = nodeTypeColors[nodeType] || '#BB86FC';

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                  transition-all duration-150 group
                  ${isSelected
                    ? 'bg-primary-500/20 border border-primary-500/50'
                    : 'hover:bg-foreground/5 border border-transparent'
                  }
                `}
              >
                {/* Indicador de color */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />

                {/* Label del nodo */}
                <span
                  className={`
                    flex-1 text-sm truncate
                    ${isSelected ? 'text-primary-400 font-medium' : 'text-foreground/70'}
                  `}
                >
                  {node.data.label || 'Sin nombre'}
                </span>

                {/* Tipo de nodo */}
                <span
                  className={`
                    text-xs px-1.5 py-0.5 rounded shrink-0
                    ${isSelected ? 'bg-primary-500/30 text-primary-300' : 'bg-foreground/10 text-foreground/40'}
                  `}
                >
                  {nodeTypeLabels[nodeType] || nodeType}
                </span>

                {/* Botón de eliminar (visible en hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`¿Eliminar "${node.data.label}"?`)) {
                      onDeleteNode(node.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20
                           text-foreground/30 hover:text-red-400 transition-all shrink-0"
                  title="Eliminar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ComponentsListSidebar;
