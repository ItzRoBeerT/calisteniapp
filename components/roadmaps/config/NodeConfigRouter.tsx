'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData } from '@/types/RoadmapNodes';

// Config panels
import TextConfigPanel from './TextConfigPanel';
import ContentConfigPanel from './ContentConfigPanel';
import ImageConfigPanel from './ImageConfigPanel';
import VideoConfigPanel from './VideoConfigPanel';
import InteractiveConfigPanel from './InteractiveConfigPanel';
import ListConfigPanel from './ListConfigPanel';
import LineConfigPanel from './LineConfigPanel';
import SectionConfigPanel from './SectionConfigPanel';

interface NodeConfigRouterProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const NodeConfigRouter: React.FC<NodeConfigRouterProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const nodeType = node.data.nodeType;

  // Mapeo de tipo de nodo a panel de configuración
  switch (nodeType) {
    // Nodos de texto
    case 'title':
    case 'paragraph':
    case 'label':
      return (
        <TextConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodos de contenido
    case 'topic':
    case 'subtopic':
      return (
        <ContentConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodo de imagen
    case 'image':
      return (
        <ImageConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodo de video
    case 'video':
      return (
        <VideoConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodos interactivos
    case 'button':
    case 'resourceButton':
    case 'todo':
    case 'checklist':
      return (
        <InteractiveConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodos de lista
    case 'legend':
    case 'linksGroup':
      return (
        <ListConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodos de línea
    case 'horizontalLine':
    case 'verticalLine':
      return (
        <LineConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    // Nodo contenedor
    case 'section':
      return (
        <SectionConfigPanel
          node={node as Node<AnyNodeData>}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={onClose}
        />
      );

    default:
      // Panel genérico para tipos desconocidos
      return (
        <div className="w-80 h-full flex flex-col items-center justify-center p-4 border-l border-foreground/10 bg-surface/95">
          <p className="text-foreground/60 text-sm text-center">
            No hay configuración disponible para este tipo de nodo.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      );
  }
};

export default NodeConfigRouter;
