"use client";
import React, { useState, useCallback, useRef } from "react";
import ReactFlow, { Background, Controls, MiniMap, Node } from "reactflow";
// Nodo personalizado para mostrar color y tamaño de texto
import { Node as RFNode, NodeChange } from "reactflow";

function CustomNode({ data }: { data: { label: string; color?: string; fontSize?: number } }) {
  return (
    <div
      style={{
        background: data.color || '#2563eb',
        color: '#fff',
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: data.fontSize || 16,
        minWidth: 80,
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}
    >
      {data.label}
    </div>
  );
}
import { applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";

// Ejemplo inicial de nodos y edges
const initialNodes = [
  {
    id: "1",
    data: { label: "Inicio", color: "#2563eb", fontSize: 16 },
    position: { x: 100, y: 100 }
  },
  {
    id: "2",
    data: { label: "Fundamentos", color: "#2563eb", fontSize: 16 },
    position: { x: 300, y: 100 }
  },
];
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

export default function RoadmapBuilder() {
  const [nodes, setNodes] = useState(initialNodes);
  // Handler para cambios en los nodos (mover, editar, etc)
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => applyNodeChanges(changes, nds));
  }, []);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Componentes disponibles
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
    // Puedes agregar más componentes aquí...
  ];

  // Drag & Drop para añadir nodos
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
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
    setNodes((nds) => [
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

  // Exportar como JSON
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

  // Selección de nodo
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Configuración del nodo seleccionado
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleNodeConfigChange = (field: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) =>
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

  return (
    <div className="container mx-auto p-4">
      {/* Barra superior */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Construir Roadmap</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleExport}
        >
          Exportar Roadmap (JSON)
        </button>
      </div>
      {/* Layout principal */}
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
              nodes={nodes}
              edges={edges}
              fitView
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              onNodesChange={onNodesChange}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={{ default: CustomNode }}
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
          {/* Panel de configuración del nodo seleccionado */}
          {selectedNode && (
            <aside className="w-64 bg-gray-50 border border-gray-300 rounded p-4 shadow relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 text-xl font-bold focus:outline-none"
                aria-label="Cerrar panel"
                onClick={() => setSelectedNodeId(null)}
              >
                &times;
              </button>
              <h3 className="font-semibold mb-4 text-black">Configurar Nodo</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-black">Texto</label>
                <input
                  type="text"
                  value={selectedNode.data.label || ""}
                  onChange={e => handleNodeConfigChange("label", e.target.value)}
                  className="w-full border px-2 py-1 rounded bg-white text-black"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-black">Color de fondo</label>
                <div className="flex gap-2">
                  {['#2563eb', '#059669', '#eab308', '#db2777'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${selectedNode.data.color === color ? 'border-black' : 'border-transparent'}`}
                      style={{ background: color }}
                      onClick={() => handleNodeConfigChange('color', color)}
                      aria-label={`Seleccionar color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-black">Tamaño de texto</label>
                <input
                  type="number"
                  min={10}
                  max={40}
                  value={selectedNode.data.fontSize || 16}
                  onChange={e => handleNodeConfigChange("fontSize", Number(e.target.value))}
                  className="w-full border px-2 py-1 rounded bg-white text-black"
                />
              </div>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}
