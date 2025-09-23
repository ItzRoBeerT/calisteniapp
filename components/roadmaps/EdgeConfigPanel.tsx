import React from "react";


export type EdgeConfigPanelProps = {
  selectedEdge: any;
  colorOptions: string[];
  arrowOptions: { value: string; label: string; icon: string }[];
  setEdges: React.Dispatch<React.SetStateAction<any[]>>;
  closePanel: () => void;
};

export const EdgeConfigPanel: React.FC<EdgeConfigPanelProps> = ({ selectedEdge, colorOptions, arrowOptions, setEdges, closePanel }) => {
  const handleEdgeConfigChange = (field: string, value: any) => {
    if (field === 'arrowHeadType') {
      setEdges((eds: any[]) =>
        eds.map((edge: any) =>
          edge.id === selectedEdge.id
            ? { ...edge, arrowHeadType: value }
            : edge
        )
      );
    } else if (field === 'style') {
      setEdges((eds: any[]) =>
        eds.map((edge: any) =>
          edge.id === selectedEdge.id
            ? { ...edge, style: value }
            : edge
        )
      );
    }
  };

  return (
    <aside className="w-64 bg-gray-50 border border-gray-300 rounded p-4 shadow relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 text-xl font-bold focus:outline-none"
        aria-label="Cerrar panel"
        onClick={closePanel}
      >
        &times;
      </button>
      <h3 className="font-semibold mb-4 text-black">Configurar Línea</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Color</label>
        <div className="flex gap-2">
          {colorOptions.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded ${selectedEdge.style?.stroke === color ? 'border-blue-600' : 'border-gray-300'}`}
              style={{ background: color, borderWidth: 2 }}
              onClick={() => handleEdgeConfigChange('style', { ...(selectedEdge.style || {}), stroke: color })}
            />
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Flechas</label>
        <div className="flex gap-2">
          {arrowOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`w-12 h-8 rounded border ${selectedEdge.arrowHeadType === opt.value ? 'border-blue-600' : 'border-gray-300'}`}
              style={{ background: '#fff', color: '#2563eb', fontWeight: 'bold', fontSize: '1.2rem' }}
              onClick={() => handleEdgeConfigChange('arrowHeadType', opt.value)}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
