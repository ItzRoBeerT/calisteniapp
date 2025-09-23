import React from "react";
import { Handle, Position, NodeResizeControl } from "reactflow";

export type CustomNodeProps = {
  data: {
    label: string;
    color?: string;
    fontSize?: number;
    width?: number;
    height?: number;
    onSelect?: () => void;
    selected?: boolean;
    onResize?: (size: { width: number; height: number }) => void;
  };
};

function darkenColor(hex: string, amount = 0.15) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  // Evitar que el doble clic en el resizer abra el menú
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el click viene del resizer, no abrir menú
    if ((e.target as HTMLElement).closest('.react-flow__resize-control')) return;
    if (data.onSelect) data.onSelect();
  };
  return (
    <div
      style={{ position: 'relative', minWidth: 100, minHeight: 50, width: data.width, height: data.height, background: data.color || '#2563eb', borderRadius: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize || 16 }}
      onClick={handleClick}
    >
      <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50} className="react-flow__resize-control" />
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
