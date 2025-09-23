import React from "react";

export type NodeConfigPanelProps = {
  selectedNode: any;
  handleNodeConfigChange: (field: string, value: any) => void;
  setSelectedNodeId: (id: string | null) => void;
};

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ selectedNode, handleNodeConfigChange, setSelectedNodeId }) => (
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
        {["#2563eb", "#059669", "#eab308", "#db2777"].map(color => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded ${selectedNode.data.color === color ? 'border-black' : 'border-transparent'}`}
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
);
