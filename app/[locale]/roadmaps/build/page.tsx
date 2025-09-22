"use client";
import React, { useState, useCallback, useRef } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

// Ejemplo inicial de nodos y edges
const initialNodes = [
  { id: "1", data: { label: "Inicio" }, position: { x: 100, y: 100 } },
  { id: "2", data: { label: "Fundamentos" }, position: { x: 300, y: 100 } },
];
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

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
        data: { label: components.find(c => c.type === type)?.label || type },
        position,
        type,
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

  return (
    <main className="container mx-auto p-4 flex gap-4">
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
      <section className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Construir Roadmap</h1>
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleExport}
        >
          Exportar Roadmap (JSON)
        </button>
        <div ref={reactFlowWrapper} style={{ width: "100%", height: 500, background: "#fafafa", borderRadius: 8 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            panOnDrag={true}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </section>
    </main>
  );
}
