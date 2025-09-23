"use client";
import React, { useState, useCallback, useRef } from "react";

import ReactFlow, { Background, Controls, MiniMap, Node, applyNodeChanges, NodeChange, ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import { CustomNode } from "./CustomNode";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { EdgeConfigPanel } from "./EdgeConfigPanel";

const nodeTypes = { default: CustomNode };

const initialNodes = [
  {
    id: "1",
    data: { label: "Inicio", color: "#2563eb", fontSize: 16 },
    position: { x: 100, y: 100 },
    type: "default"
  },
  {
    id: "2",
    data: { label: "Fundamentos", color: "#2563eb", fontSize: 16 },
    position: { x: 300, y: 100 },
    type: "default"
  },
];

// Edge type compatible with React Flow
import type { Edge as RFEdge } from 'reactflow';

const initialEdges: RFEdge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#2563eb" },
  },
];

export default function RoadmapBuilderClient() {
  const [nodes, setNodes] = useState<Node<{ label: string; color: string; fontSize: number }>[]>(initialNodes);
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => applyNodeChanges(changes, nds));
  }, []);
  const [edges, setEdges] = useState<RFEdge[]>(initialEdges);
  const [edgeArrowTypes, setEdgeArrowTypes] = useState<Record<string, string>>({ 'e1-2': 'none' });
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedNodeId) {
      console.log("Nodo seleccionado:", selectedNodeId);
    } else {
      console.log("Ningún nodo seleccionado");
    }
  }, [selectedNodeId]);

  const components = [
    {
      type: "title",
      label: "Title",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heading1 lucide-heading-1 mr-2 h-4 w-4" aria-hidden="true"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="m17 12 3-2v8"></path></svg>
      ),
    },
    {
      type: "topic",
      label: "Topic",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle mr-2 h-4 w-4" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg>
      ),
    },
    {
      type: "subtopic",
      label: "Sub Topic",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dashed mr-2 h-4 w-4" aria-hidden="true"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path><path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"></path><path d="M2.182 13.9a10 10 0 0 1 0-3.8"></path><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"></path><path d="M21.818 10.1a10 10 0 0 1 0 3.8"></path><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"></path><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"></path></svg>
      ),
    },
    {
      type: "paragraph",
      label: "Paragraph",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrap-text mr-2 h-4 w-4" aria-hidden="true"><line x1="3" x2="21" y1="6" y2="6"></line><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="16 16 14 18 16 20"></polyline><line x1="3" x2="10" y1="18" y2="18"></line></svg>
      ),
    },
    {
      type: "label",
      label: "Label",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-case-sensitive mr-2 h-4 w-4" aria-hidden="true"><path d="m3 15 4-8 4 8"></path><path d="M4 13h6"></path><circle cx="18" cy="12" r="3"></circle><path d="M21 9v6"></path></svg>
      ),
    },
  ];

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (typeof type === "undefined" || !type) return;
    if (!reactFlowInstance) {
      alert("El área de trabajo no está lista. Intenta de nuevo.");
      return;
    }
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - (bounds?.left ?? 0),
      y: event.clientY - (bounds?.top ?? 0),
    });
    const newId = `${type}-${Date.now()}`;
    setNodes((nds: Node<any>[]) => [
      ...nds,
      {
        id: newId,
        data: {
          label: components.find(c => c.type === type)?.label || type,
          color: "#2563eb",
          fontSize: 16
        },
        position,
        type: components.find(c => c.type === type)?.type || "default",
      },
    ]);
  }, [reactFlowInstance, components]);

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedNode = nodes.find((n: Node<any>) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e: RFEdge) => e.id === selectedEdgeId);

  React.useEffect(() => {
    if (selectedNode) {
      console.log("Panel de configuración visible para nodo:", selectedNode.id);
    } else {
      console.log("Panel de configuración oculto");
    }
  }, [selectedNode]);

  const handleNodeConfigChange = (field: string, value: any) => {
    setNodes((nds: Node<any>[]) =>
      nds.map((node: Node<any>) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
              },
            }
          : node
      )
    );
  };

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: RFEdge) => {
    event.stopPropagation();
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  const handleEdgeConfigChange = (field: string, value: any) => {
    if (!selectedEdgeId) return;
    if (field === 'arrowHeadType') {
      setEdgeArrowTypes((prev: Record<string, string>) => ({ ...prev, [selectedEdgeId]: value }));
    } else if (field === 'style') {
      setEdges((eds: RFEdge[]) =>
        eds.map((edge: RFEdge) =>
          edge.id === selectedEdgeId
            ? { ...edge, style: value }
            : edge
        )
      );
    }
  };

  const closePanel = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  const arrowOptions = [
    { value: 'none', label: 'Sin flecha', icon: '' },
    { value: 'left', label: 'Izquierda', icon: '<' },
    { value: 'right', label: 'Derecha', icon: '>' },
    { value: 'both', label: 'Ambos', icon: '<>' },
  ];
  const colorOptions = ["#2563eb", "#059669", "#eab308", "#db2777"];
  const lineOptions = [
    { value: 'solid', label: 'Lisa', style: undefined },
    { value: 'dashed', label: 'Rayada', style: '8 4' },
    { value: 'dotted', label: 'Puntos', style: '4 2' },
  ];

  const handleNodePanelOpen = (id: string) => {
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };
  const handleEdgePanelOpen = (id: string) => {
    setSelectedEdgeId(id);
    setSelectedNodeId(null);
  };

  // Ajuste para strokeDasharray y flechas
  const getEdgeStyle = (edge: RFEdge) => {
    return { stroke: edge.style?.stroke || '#2563eb' };
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Construir Roadmap</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleExport}
        >
          Exportar Roadmap (JSON)
        </button>
      </div>
      <main className="flex gap-4">
        <aside className="react-flow__sidebar components-sidebar flex flex-col gap-1.5 select-none w-56">
          <h2 className="font-semibold mb-2">Componentes</h2>
          {components.map((comp) => (
            <div
              key={comp.type}
              className="dndnode flex h-11 cursor-grab items-center rounded-[5px] border border-gray-300 px-4 py-3 mb-1"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", comp.type);
                event.dataTransfer.effectAllowed = "move";
              }}
            >
              {comp.icon}
              {comp.label}
            </div>
          ))}
        </aside>
        <section className="flex-1 flex gap-4">
          <div ref={reactFlowWrapper} style={{ width: "100%", height: 500, background: "#fafafa", borderRadius: 8 }}>
            <ReactFlow
              nodes={nodes.map(node => ({
                ...node,
                data: {
                  ...node.data,
                  onSelect: () => {
                    handleNodePanelOpen(node.id as string);
                  },
                  selected: node.id === selectedNodeId
                }
              }))}
              edges={edges.map(edge => {
                const arrowType = edgeArrowTypes[edge.id] || 'none';
                let markerEnd: string | undefined = undefined;
                if (arrowType === 'right' || arrowType === 'both') markerEnd = 'arrow';
                // markerStart is not supported as a string property in React Flow Edge type
                return {
                  ...edge,
                  style: getEdgeStyle(edge),
                  markerEnd,
                };
              })}
              fitView
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              onNodesChange={onNodesChange}
              onInit={instance => setReactFlowInstance(instance)}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onEdgeClick={(event, edge) => { event.stopPropagation(); handleEdgePanelOpen(edge.id); }}
              nodeTypes={nodeTypes}
              proOptions={{ hideAttribution: true }}
            >
              <MiniMap nodeColor={n => {
                switch (n.type) {
                  case "title": return "#2563eb";
                  case "topic": return "#059669";
                  case "subtopic": return "#eab308";
                  case "paragraph": return "#6b7280";
                  case "label": return "#db2777";
                  default: return "#64748b";
                }
              }} />
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          {selectedNode && !selectedEdge && (
            <NodeConfigPanel
              selectedNode={selectedNode}
              handleNodeConfigChange={handleNodeConfigChange}
              setSelectedNodeId={setSelectedNodeId}
            />
          )}
          {selectedEdge && !selectedNode && (
            <EdgeConfigPanel
              selectedEdge={{
                ...selectedEdge,
                arrowHeadType: edgeArrowTypes[selectedEdge.id] || 'none',
              }}
              colorOptions={colorOptions}
              arrowOptions={arrowOptions}
              handleEdgeConfigChange={handleEdgeConfigChange}
              closePanel={closePanel}
            />
          )}
        </section>
      </main>
    </div>
  );
}
