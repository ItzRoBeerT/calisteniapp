'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  MarkerType,
  SelectionMode,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
  type EdgeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { AnyNodeData, NodeTemplate } from '@/types/RoadmapNodes';
import { builderNodeTypes } from './nodes';
import { NodeConfigRouter } from './config';
import { ComponentsListSidebar, NodeTemplatesSidebar } from './sidebar';
import BuilderEdgeConfigPanel, { type BuilderEdgeData } from './BuilderEdgeConfigPanel';

// Tipos de nodos personalizados para el builder
const nodeTypes = builderNodeTypes;

// Iconos SVG
const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const ImportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

function RoadmapBuilder() {
  const t = useTranslations('RoadmapBuilder');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Estados de nodos y edges
  const [nodes, setNodes, onNodesChange] = useNodesState<AnyNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BuilderEdgeData>([]);

  // Estado de selección
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Estado de guardado
  const [isSaving, setIsSaving] = useState(false);
  const [roadmapId, setRoadmapId] = useState<string | null>(null);

  // Estado de importación
  const [showImportModal, setShowImportModal] = useState(false);
  const [availableRoadmaps, setAvailableRoadmaps] = useState<any[]>([]);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(false);

  // Nodo seleccionado
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // Edge seleccionado
  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  // Manejar conexión de nodos
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'default',
            animated: false,
            style: { stroke: '#BB86FC', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#BB86FC' },
            data: {
              lineStyle: 'solid' as const,
              arrowStyle: 'forward' as const,
              pathStyle: 'bezier' as const,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Manejar drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Manejar drop de nodo desde template
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const dataStr = event.dataTransfer.getData('application/reactflow');
      if (!dataStr || !reactFlowInstance) return;

      const template: NodeTemplate = JSON.parse(dataStr);
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();

      if (!bounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      // Tipos de nodos de texto que no necesitan width/height en data
      // (su tamaño se controla solo con NodeResizer)
      const textNodeTypes = ['title', 'paragraph', 'label'];
      const isTextNode = textNodeTypes.includes(template.type);

      const newNode: Node<AnyNodeData> = {
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type: template.type,
        position,
        style: {
          width: template.defaultSize.width,
          height: template.defaultSize.height,
        },
        data: {
          ...template.defaultData,
          label: template.label,
          // Solo agregar width/height a data para nodos que no son de texto
          ...(isTextNode ? {} : {
            width: template.defaultSize.width,
            height: template.defaultSize.height,
          }),
          mode: 'builder',
        } as AnyNodeData,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  // Manejar drag start desde template sidebar
  const handleTemplateDragStart = useCallback((event: React.DragEvent, template: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Actualizar datos de un nodo
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<AnyNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } as AnyNodeData }
            : node
        )
      );
    },
    [setNodes]
  );

  // Eliminar nodo
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges]
  );

  // Seleccionar nodo (y deseleccionar edge)
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  }, []);

  // Seleccionar edge (y deseleccionar nodo)
  const handleEdgeClick: EdgeMouseHandler = useCallback((_event, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  // Actualizar edge
  const handleUpdateEdge = useCallback(
    (edgeId: string, updates: Partial<Edge<BuilderEdgeData>>) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? { ...edge, ...updates }
            : edge
        )
      );
    },
    [setEdges]
  );

  // Eliminar edge
  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      setSelectedEdgeId(null);
    },
    [setEdges]
  );

  // Cerrar paneles
  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  // Click en el canvas (deseleccionar todo)
  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  // Manejar tecla Delete/Suprimir
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        if (selectedNodeId) {
          event.preventDefault();
          if (confirm('¿Seguro que quieres eliminar este nodo?')) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
            setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
            setSelectedNodeId(null);
          }
        } else if (selectedEdgeId) {
          event.preventDefault();
          if (confirm('¿Seguro que quieres eliminar esta conexión?')) {
            setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
            setSelectedEdgeId(null);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, setNodes, setEdges]);

  // Guardar roadmap en el servidor
  const handleSave = useCallback(async () => {
    const name = prompt('Nombre del roadmap:', roadmapId || 'mi-roadmap');
    if (!name) return;

    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');

    setIsSaving(true);

    try {
      // Preparar nodos para guardar (sin callbacks ni estado temporal)
      const nodesToSave = nodes.map((node) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onSelect, selected, mode, ...dataWithoutCallbacks } = node.data;
        return {
          id: node.id,
          type: node.type,
          position: node.position,
          style: node.style,
          parentId: node.parentId,
          extent: node.extent,
          data: dataWithoutCallbacks,
        };
      });

      const roadmapData = {
        id: sanitizedName,
        title: name,
        description: 'Roadmap creado con el builder',
        isPublic: true,
        totalNodes: nodes.length,
        completedNodes: 0,
        nodes: nodesToSave,
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          animated: edge.animated ?? false,
          style: edge.style,
          markerStart: edge.markerStart,
          markerEnd: edge.markerEnd,
          data: edge.data,
          label: edge.label,
        })),
      };

      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roadmapData),
      });

      const result = await response.json();

      if (result.success) {
        setRoadmapId(result.id);
        alert(`Roadmap "${name}" guardado correctamente.`);
      } else {
        alert(`Error al guardar: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving roadmap:', error);
      alert('Error al guardar el roadmap. Revisa la consola para más detalles.');
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, roadmapId]);

  // Cargar lista de roadmaps disponibles
  const loadAvailableRoadmaps = useCallback(async () => {
    setIsLoadingRoadmaps(true);
    try {
      const response = await fetch('/api/roadmaps');
      const roadmaps = await response.json();
      setAvailableRoadmaps(roadmaps);
    } catch (error) {
      console.error('Error loading roadmaps:', error);
      alert('Error al cargar la lista de roadmaps.');
    } finally {
      setIsLoadingRoadmaps(false);
    }
  }, []);

  // Abrir modal de importación
  const handleOpenImport = useCallback(async () => {
    setShowImportModal(true);
    await loadAvailableRoadmaps();
  }, [loadAvailableRoadmaps]);

  // Importar roadmap desde el servidor
  const handleImportRoadmap = useCallback(
    async (roadmapId: string) => {
      try {
        const response = await fetch(`/api/roadmaps?id=${roadmapId}`);
        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const importedNodes: Node<AnyNodeData>[] = data.nodes.map((n: any) => ({
          id: n.id,
          type: n.type || n.data?.nodeType || 'topic',
          position: n.position,
          style: n.style,
          parentId: n.parentId,
          extent: n.extent,
          data: {
            ...n.data,
            // Fallback para datos legacy
            label: n.data?.label || n.data?.content?.title || 'Sin nombre',
            nodeType: n.data?.nodeType || 'topic',
          } as AnyNodeData,
        }));

        // Mapa de lineStyle a strokeDasharray
        const lineStyleToDasharray: Record<string, string | undefined> = {
          solid: undefined,
          dashed: '8 4',
          dotted: '2 4',
          longDash: '16 6',
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const importedEdges: Edge<BuilderEdgeData>[] = data.edges.map((e: any) => {
          const lineStyle = e.data?.lineStyle || 'solid';
          const strokeDasharray = lineStyleToDasharray[lineStyle];

          return {
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle,
            targetHandle: e.targetHandle,
            type: e.type || 'default',
            animated: e.animated ?? false,
            style: {
              stroke: '#BB86FC',
              strokeWidth: 2,
              ...e.style,
              // Restaurar strokeDasharray basado en lineStyle guardado
              strokeDasharray: e.style?.strokeDasharray || strokeDasharray,
            },
            markerStart: e.markerStart,
            markerEnd: e.markerEnd || { type: MarkerType.ArrowClosed, color: '#BB86FC' },
            data: e.data || {
              lineStyle: 'solid' as const,
              arrowStyle: 'forward' as const,
              pathStyle: 'bezier' as const,
            },
            label: e.label,
          };
        });

        setNodes(importedNodes);
        setEdges(importedEdges);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setRoadmapId(data.id || null);
        setShowImportModal(false);
        alert(`Roadmap "${data.title}" cargado correctamente.`);
      } catch (error) {
        console.error('Error importing roadmap:', error);
        alert('Error al importar el roadmap.');
      }
    },
    [setNodes, setEdges]
  );

  // Limpiar canvas
  const handleClear = useCallback(() => {
    if (confirm('¿Seguro que quieres limpiar todo el canvas?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setRoadmapId(null);
    }
  }, [setNodes, setEdges]);

  // Nodos con callbacks inyectados y modo builder
  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          mode: 'builder' as const,
          onSelect: () => handleNodeClick(node.id),
          selected: node.id === selectedNodeId,
        },
      })),
    [nodes, selectedNodeId, handleNodeClick]
  );

  // Edges con estilos de selección
  const edgesWithStyles = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: edge.id === selectedEdgeId ? 4 : 2,
        },
      })),
    [edges, selectedEdgeId]
  );

  // Estado del sidebar activo
  const [activeSidebarTab, setActiveSidebarTab] = useState<'components' | 'templates'>('templates');

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-surface border-b border-foreground/10">
        <h1
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Constructor de Roadmap
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenImport}
            className="flex items-center gap-2 px-3 py-2 bg-foreground/10 hover:bg-foreground/20
                       text-foreground/70 rounded-lg transition-colors text-sm"
          >
            <ImportIcon />
            Importar
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20
                       text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
          >
            <ClearIcon />
            Limpiar
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600
                       text-white rounded-lg transition-colors text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <LoadingSpinner /> : <SaveIcon />}
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar izquierdo */}
        <aside className="w-72 bg-surface border-r border-foreground/10 flex flex-col">
          {/* Tabs del sidebar */}
          <div className="flex border-b border-foreground/10">
            <button
              onClick={() => setActiveSidebarTab('components')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors
                ${activeSidebarTab === 'components'
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
            >
              {t('components')}
            </button>
            <button
              onClick={() => setActiveSidebarTab('templates')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors
                ${activeSidebarTab === 'templates'
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
            >
              Templates
            </button>
          </div>

          {/* Contenido del sidebar */}
          <div className="flex-1 overflow-hidden">
            {activeSidebarTab === 'components' ? (
              <ComponentsListSidebar
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                onSelectNode={handleNodeClick}
                onDeleteNode={handleDeleteNode}
              />
            ) : (
              <NodeTemplatesSidebar onDragStart={handleTemplateDragStart} />
            )}
          </div>

          {/* Info del roadmap actual */}
          {roadmapId && (
            <div className="p-3 border-t border-foreground/10 bg-primary-500/5">
              <p className="text-xs text-primary-400">
                <strong>Editando:</strong> {roadmapId}
              </p>
            </div>
          )}
        </aside>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 bg-background">
          <ReactFlow
            nodes={nodesWithCallbacks}
            edges={edgesWithStyles}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            panOnDrag={[1, 2]}
            proOptions={{ hideAttribution: true }}
            className="roadmap-flow"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="rgba(187, 134, 252, 0.1)"
            />
            <Controls
              showInteractive={false}
              className="!bg-surface/80 !backdrop-blur-md !border-foreground/10 !rounded-xl"
            />
            <MiniMap
              nodeColor={(n) => {
                const data = n.data as AnyNodeData;
                // Obtener color según el tipo de nodo
                if ('color' in data && data.color) return data.color;
                if (data.nodeType === 'section') return 'rgba(187, 134, 252, 0.3)';
                return '#64748b';
              }}
              maskColor="rgba(18, 18, 18, 0.85)"
              className="!bg-surface/80 !backdrop-blur-md !border-foreground/10 !rounded-xl"
            />
          </ReactFlow>
        </div>

        {/* Node Config Panel */}
        {selectedNode && (
          <NodeConfigRouter
            node={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onClose={handleClosePanel}
          />
        )}

        {/* Edge Config Panel */}
        {selectedEdge && (
          <BuilderEdgeConfigPanel
            selectedEdge={selectedEdge}
            onUpdateEdge={handleUpdateEdge}
            onDeleteEdge={handleDeleteEdge}
            onClose={handleClosePanel}
          />
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-foreground/10 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-foreground/10">
              <h2 className="text-xl font-bold text-foreground">Importar Roadmap</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingRoadmaps ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                  <span className="ml-2 text-foreground/60">Cargando roadmaps...</span>
                </div>
              ) : availableRoadmaps.length === 0 ? (
                <div className="text-center py-12 text-foreground/50">
                  <p>No hay roadmaps disponibles para importar.</p>
                  <p className="text-sm mt-2">Guarda un roadmap primero para poder importarlo.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRoadmaps.map((roadmap) => (
                    <button
                      key={roadmap.id}
                      onClick={() => handleImportRoadmap(roadmap.id)}
                      className="w-full text-left p-4 rounded-lg border border-foreground/20
                                 bg-background hover:border-primary-500/50 hover:bg-primary-500/5
                                 transition-colors"
                    >
                      <h3 className="font-semibold text-foreground mb-1">{roadmap.title}</h3>
                      <p className="text-sm text-foreground/60 mb-2">{roadmap.description}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/50">
                        <span>{roadmap.totalNodes} nodos</span>
                        {roadmap.updatedAt && (
                          <span>Actualizado: {new Date(roadmap.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Envolver con ReactFlowProvider
export default function RoadmapBuilderClient() {
  return (
    <ReactFlowProvider>
      <RoadmapBuilder />
    </ReactFlowProvider>
  );
}
