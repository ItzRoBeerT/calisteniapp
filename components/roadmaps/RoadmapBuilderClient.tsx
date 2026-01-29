'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
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

import BuilderNode, { type BuilderNodeData } from './BuilderNode';
import BuilderConfigPanel from './BuilderConfigPanel';
import BuilderEdgeConfigPanel, { type BuilderEdgeData } from './BuilderEdgeConfigPanel';
import { CalistenicsIcons, type CalistenicsIconType } from './CalistenicsIcons';

// Tipos de nodos personalizados
const nodeTypes = {
  builder: BuilderNode,
};

// Plantilla única de nodo básico
const nodeTemplate = {
  type: 'basic',
  label: 'Básico',
  icon: 'none' as CalistenicsIconType,
  color: '#BB86FC',
};

// Iconos SVG
const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const ImportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de nodos y edges
  const [nodes, setNodes, onNodesChange] = useNodesState<BuilderNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BuilderEdgeData>([]);

  // Estado de selección
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Estado de guardado
  const [isSaving, setIsSaving] = useState(false);
  const [roadmapId, setRoadmapId] = useState<string | null>(null);

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

  // Manejar drop de nodo
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const dataStr = event.dataTransfer.getData('application/reactflow');
      if (!dataStr || !reactFlowInstance) return;

      const template = JSON.parse(dataStr);
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();

      if (!bounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node<BuilderNodeData> = {
        id: `node-${Date.now()}`,
        type: 'builder',
        position,
        data: {
          label: template.label,
          icon: template.icon,
          color: template.color,
          description: '',
          tips: '',
          resources: [],
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  // Actualizar datos de un nodo
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<BuilderNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
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
      const roadmapData = {
        id: sanitizedName,
        title: name,
        description: 'Roadmap creado con el builder',
        isPublic: true,
        totalNodes: nodes.length,
        completedNodes: 0,
        nodes: nodes.map((node) => ({
          id: node.id,
          type: 'topic',
          position: node.position,
          data: {
            label: node.data.label,
            nodeType: 'topic' as const,
            color: node.data.color,
            fontSize: 14,
            width: 160,
            height: 60,
            content: {
              title: node.data.label,
              description: node.data.description || '',
              tips: node.data.tips || '',
              progress: 'not_started' as const,
              resources: node.data.resources || [],
            },
          },
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
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

  // Importar roadmap desde JSON
  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const importedNodes: Node<BuilderNodeData>[] = data.nodes.map((n: any) => ({
            id: n.id,
            type: 'builder',
            position: n.position,
            data: {
              label: n.data?.label || n.data?.content?.title || 'Sin nombre',
              icon: 'none' as CalistenicsIconType,
              color: n.data?.color || '#BB86FC',
              description: n.data?.content?.description || '',
              tips: n.data?.content?.tips || '',
              resources: n.data?.content?.resources || [],
            },
          }));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const importedEdges: Edge<BuilderEdgeData>[] = data.edges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type || 'default',
            animated: e.animated ?? false,
            style: e.style || { stroke: '#BB86FC', strokeWidth: 2 },
            markerStart: e.markerStart,
            markerEnd: e.markerEnd || { type: MarkerType.ArrowClosed, color: '#BB86FC' },
            data: e.data || {
              lineStyle: 'solid' as const,
              arrowStyle: 'forward' as const,
              pathStyle: 'bezier' as const,
            },
            label: e.label,
          }));

          setNodes(importedNodes);
          setEdges(importedEdges);
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
          setRoadmapId(data.id || null);
        } catch {
          alert('Error al importar el archivo. Asegúrate de que sea un JSON válido.');
        }
      };
      reader.readAsText(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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

  // Nodos con callbacks inyectados
  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
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

  const IconComponent = CalistenicsIcons[nodeTemplate.icon];

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
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
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
        {/* Sidebar - Componentes */}
        <aside className="w-64 bg-surface border-r border-foreground/10 overflow-y-auto p-4">
          <h2
            className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Componentes
          </h2>

          <p className="text-xs text-foreground/50 mb-4">
            Arrastra el componente al canvas para crear tu roadmap
          </p>

          {/* Nodo básico */}
          <div
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData(
                'application/reactflow',
                JSON.stringify(nodeTemplate)
              );
              event.dataTransfer.effectAllowed = 'move';
            }}
            className="flex items-center gap-3 p-3 rounded-lg border border-foreground/20
                       bg-background hover:border-primary-500/50 hover:bg-primary-500/5
                       cursor-grab active:cursor-grabbing transition-colors"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: nodeTemplate.color }}
            >
              <IconComponent size={20} />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground/80 block">{nodeTemplate.label}</span>
              <span className="text-xs text-foreground/50">Nodo personalizable</span>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mt-6 p-3 bg-tertiary-500/10 border border-tertiary-500/30 rounded-lg">
            <h3 className="text-xs font-semibold text-tertiary-400 mb-2">Instrucciones</h3>
            <ul className="text-xs text-foreground/60 space-y-1">
              <li>• Arrastra el nodo al canvas</li>
              <li>• Conecta nodos desde los puntos</li>
              <li>• Clic en un nodo para editarlo</li>
              <li>• Clic en una línea para editarla</li>
              <li>• Arrastra en vacío para selección múltiple</li>
              <li>• Suprimir para eliminar selección</li>
            </ul>
          </div>

          {/* Info del roadmap actual */}
          {roadmapId && (
            <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
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
              nodeColor={(n) => (n.data as BuilderNodeData)?.color || '#64748b'}
              maskColor="rgba(18, 18, 18, 0.85)"
              className="!bg-surface/80 !backdrop-blur-md !border-foreground/10 !rounded-xl"
            />
          </ReactFlow>
        </div>

        {/* Node Config Panel */}
        {selectedNode && (
          <BuilderConfigPanel
            selectedNode={selectedNode}
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
