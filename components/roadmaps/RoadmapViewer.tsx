'use client';

import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ViewerNode from './ViewerNode';
import { viewerNodeTypes } from './nodes';
import type { AnyNodeData } from '@/types/RoadmapNodes';

// Estilos CSS específicos para React Flow en el visor de roadmaps
const roadmapFlowStyles = `
@keyframes flow {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

.roadmap-flow .react-flow__node {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.roadmap-flow .react-flow__edge-path {
  stroke-width: 2;
  stroke-linecap: round;
}

.roadmap-flow .react-flow__edge.animated path:not([style*="strokeDasharray"]) {
  stroke-dasharray: 5 5;
  animation: flow 0.8s linear infinite;
}

.roadmap-flow .react-flow__edge.selected path {
  stroke-width: 3;
}

.roadmap-flow .react-flow__handle {
  width: 10px;
  height: 10px;
  background: rgba(187, 134, 252, 0.6);
  border: 2px solid rgba(187, 134, 252, 0.8);
  transition: all 0.2s ease-out;
}

.roadmap-flow .react-flow__handle:hover {
  background: rgba(187, 134, 252, 0.9);
  transform: scale(1.2);
}

.roadmap-flow .react-flow__controls {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.roadmap-flow .react-flow__controls-button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.roadmap-flow .react-flow__controls-button:hover {
  background: rgba(187, 134, 252, 0.2);
  color: #BB86FC;
}

.roadmap-flow .react-flow__controls-button svg {
  fill: currentColor;
}

.roadmap-flow .react-flow__minimap {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.roadmap-flow .react-flow__minimap svg {
  border-radius: 12px;
}
`;
import NodeDetailPanel from './NodeDetailPanel';
import RoadmapProgress from './RoadmapProgress';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import type { RoadmapViewerProps, RoadmapNodeData, NodeProgress, RoadmapResource } from '@/types/Roadmap';

// Registro de tipos de nodos personalizados - combina nuevos tipos con fallback
const nodeTypes = {
  ...viewerNodeTypes,
  // Fallbacks para compatibilidad con roadmaps legacy
  default: ViewerNode,
  milestone: ViewerNode,
};

// Estilos personalizados para el MiniMap
const miniMapNodeColor = (node: { data?: RoadmapNodeData | AnyNodeData }) => {
  const data = node.data;
  if (!data) return '#64748b';

  // Primero verificar progreso (para nodos interactivos)
  const progress = (data as RoadmapNodeData)?.progress ||
    (data as RoadmapNodeData)?.content?.progress;
  if (progress) {
    switch (progress) {
      case 'completed':
        return '#32D74B'; // Verde
      case 'in_progress':
        return '#BB86FC'; // Púrpura
      case 'skipped':
        return '#444';
    }
  }

  // Si tiene color, usarlo
  if ('color' in data && data.color) {
    return data.color as string;
  }

  // Color por tipo de nodo
  const nodeType = data.nodeType;
  if (nodeType === 'section') return 'rgba(187, 134, 252, 0.3)';
  if (nodeType === 'horizontalLine' || nodeType === 'verticalLine') return '#8E8E93';

  return '#64748b'; // Gris por defecto
};

// Tipos de nodos que NO deben mostrar detalles ni contarse en progreso
const nonProgressNodeTypes = ['title', 'paragraph', 'label', 'horizontalLine', 'verticalLine', 'section', 'image', 'video'];

export default function RoadmapViewer({ roadmap, isEditable = false }: RoadmapViewerProps) {
  // Estado de nodos y edges
  const [nodes, setNodes, onNodesChange] = useNodesState(roadmap.nodes);
  const [edges] = useEdgesState(roadmap.edges);

  // Estado de selección
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Calcular el número real de nodos que cuentan para el progreso (excluyendo texto, líneas, etc.)
  const trackableNodesCount = useMemo(() => {
    return nodes.filter((node) => {
      const nodeType = (node.data as { nodeType?: string })?.nodeType;
      return nodeType && !nonProgressNodeTypes.includes(nodeType);
    }).length;
  }, [nodes]);

  // Hook de progreso con localStorage - usa el conteo de nodos rastreables
  const { progress, updateNodeProgress, completedCount, inProgressCount, completionPercentage, isLoaded } =
    useRoadmapProgress(roadmap.id, trackableNodesCount);

  // Obtener nodo seleccionado con sus datos - crea content object para nuevos tipos
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node?.data) return null;

    const data = node.data;
    const nodeType = (data as { nodeType?: string })?.nodeType;

    // Si es un nodo que no debe mostrar detalles, retornar null
    if (nodeType && nonProgressNodeTypes.includes(nodeType)) {
      return null;
    }

    // Si ya tiene content, usarlo
    if (data.content) {
      return data;
    }

    // Para TopicNodeData y SubTopicNodeData, crear content desde los datos directos
    if (nodeType === 'topic' || nodeType === 'subtopic') {
      const typedData = data as { description?: string; tips?: string; resources?: RoadmapResource[]; label?: string; progress?: NodeProgress };
      return {
        ...data,
        content: {
          title: typedData.label || 'Sin título',
          description: typedData.description || '',
          tips: typedData.tips,
          resources: typedData.resources || [],
          progress: progress[selectedNodeId] || typedData.progress || 'not_started',
        },
      } as RoadmapNodeData;
    }

    return data;
  }, [nodes, selectedNodeId, progress]);

  // Handler para click en nodo
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Handler para cambio de progreso
  const handleProgressChange = useCallback(
    (nodeId: string, newProgress: NodeProgress) => {
      updateNodeProgress(nodeId, newProgress);

      // Actualizar el estado visual del nodo
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  progress: newProgress,
                  content: n.data.content
                    ? { ...n.data.content, progress: newProgress }
                    : undefined,
                },
              }
            : n
        )
      );
    },
    [updateNodeProgress, setNodes]
  );

  // Cerrar panel de detalles
  const closePanel = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Nodos con callbacks, modo viewer y estado de progreso inyectados
  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => {
        const nodeType = (node.data as { nodeType?: string })?.nodeType;
        const directProgress = (node.data as { progress?: NodeProgress })?.progress;
        const nodeProgress = progress[node.id] || node.data.content?.progress || directProgress || 'not_started';

        // Crear content para topic/subtopic si no existe
        let content = node.data.content;
        if (!content && (nodeType === 'topic' || nodeType === 'subtopic')) {
          const typedData = node.data as { description?: string; tips?: string; resources?: RoadmapResource[]; label?: string };
          content = {
            title: typedData.label || 'Sin título',
            description: typedData.description || '',
            tips: typedData.tips,
            resources: typedData.resources || [],
            progress: nodeProgress,
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            mode: 'viewer' as const,
            onSelect: () => handleNodeClick(node.id),
            selected: node.id === selectedNodeId,
            progress: nodeProgress,
            content: content
              ? { ...content, progress: nodeProgress }
              : undefined,
          },
        };
      }),
    [nodes, selectedNodeId, progress, handleNodeClick]
  );

  // Estilos personalizados para edges - preserva configuración guardada
  const styledEdges = useMemo(
    () => {
      // Mapa de lineStyle a strokeDasharray para restaurar estilos
      const lineStyleToDasharray: Record<string, string | undefined> = {
        solid: undefined,
        dashed: '8 4',
        dotted: '2 4',
        longDash: '16 6',
      };

      return edges.map((edge) => {
        // Obtener strokeDasharray del estilo guardado o calcularlo desde lineStyle
        const lineStyle = (edge.data as { lineStyle?: string })?.lineStyle || 'solid';
        const strokeDasharray = edge.style?.strokeDasharray || lineStyleToDasharray[lineStyle];

        return {
          ...edge,
          // Preservar el tipo de edge guardado (bezier, straight, step, smoothstep)
          type: edge.type || 'default',
          // Preservar configuración de animación guardada
          animated: edge.animated ?? false,
          // Preservar estilos guardados con fallbacks
          style: {
            stroke: '#BB86FC',
            strokeWidth: 2,
            ...edge.style,
            // Asegurar que strokeDasharray se restaure correctamente
            strokeDasharray,
          },
          // Preservar marcadores de flecha
          markerStart: edge.markerStart,
          markerEnd: edge.markerEnd,
        };
      });
    },
    [edges]
  );

  return (
    <div className="relative w-full space-y-4">
      {/* Estilos específicos del visor */}
      <style>{roadmapFlowStyles}</style>

      {/* Barra de progreso global */}
      {isLoaded && trackableNodesCount > 0 && (
        <RoadmapProgress
          completedNodes={completedCount}
          inProgressNodes={inProgressCount}
          totalNodes={trackableNodesCount}
          percentage={completionPercentage}
        />
      )}

      {/* Canvas del roadmap */}
      <div
        className="relative w-full h-[calc(100vh-320px)] min-h-[500px] rounded-2xl overflow-hidden
                   border border-foreground/10 bg-background"
      >
        {/* Efecto de gradiente sutil en el fondo */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(187, 134, 252, 0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(50, 215, 75, 0.03) 0%, transparent 50%)
            `,
          }}
        />

        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={styledEdges}
          nodeTypes={nodeTypes}
          onNodesChange={isEditable ? onNodesChange : undefined}
          nodesDraggable={isEditable}
          nodesConnectable={isEditable}
          elementsSelectable={true}
          fitView
          fitViewOptions={{
            padding: 0.2,
            minZoom: 0.5,
            maxZoom: 1.5,
          }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className="roadmap-flow"
        >
          {/* Fondo con grid de puntos */}
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="rgba(187, 134, 252, 0.15)"
          />

          {/* Controles de zoom */}
          <Controls
            showInteractive={false}
            className="!bg-surface/80 !backdrop-blur-md !border-foreground/10 !rounded-xl !shadow-lg"
          />

          {/* MiniMap */}
          <MiniMap
            nodeColor={miniMapNodeColor}
            maskColor="rgba(18, 18, 18, 0.85)"
            className="!bg-surface/80 !backdrop-blur-md !border-foreground/10 !rounded-xl"
            pannable
            zoomable
          />
        </ReactFlow>

        {/* Indicador de carga */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Panel lateral de detalles */}
      <NodeDetailPanel
        node={selectedNode}
        nodeId={selectedNodeId}
        isOpen={!!selectedNodeId && !!selectedNode?.content}
        onClose={closePanel}
        onProgressChange={handleProgressChange}
      />
    </div>
  );
}
