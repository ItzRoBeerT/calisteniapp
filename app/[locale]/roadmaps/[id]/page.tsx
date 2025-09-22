
"use client";
import React from "react";
import { use } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

// Datos para React Flow
const nodes = [
  { id: "1", data: { label: "Inicio" }, position: { x: 100, y: 100 } },
  { id: "2", data: { label: "Fundamentos" }, position: { x: 300, y: 100 } },
  { id: "3", data: { label: "Progresiones" }, position: { x: 500, y: 100 } },
  { id: "4", data: { label: "Ejercicios" }, position: { x: 300, y: 250 } },
  { id: "5", data: { label: "Rutinas" }, position: { x: 500, y: 250 } },
];
const edges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-5", source: "3", target: "5" },
  { id: "e4-5", source: "4", target: "5" },
];

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = use(params);
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalle del Roadmap</h1>
      <p className="mb-4">ID del roadmap: {awaitedParams.id}</p>
      <div style={{ width: "100%", height: 500, background: "#fafafa", borderRadius: 8 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </main>
  );
}
