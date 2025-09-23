import React from "react";
import { Handle, Position } from "reactflow";

export type CustomNodeProps = {
  data: {
    label: string;
    color?: string;
    fontSize?: number;
    onSelect?: () => void;
    selected?: boolean;
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

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const [hover, setHover] = React.useState(false);
  const baseColor = data.color || '#2563eb';
  const nodeColor = data.selected || hover
    ? darkenColor(baseColor, 0.25)
    : baseColor;
  const fontSize = data.fontSize || 16;
  const minWidth = Math.max(80, fontSize * 5);
  return (
    <div
      style={{
        background: nodeColor,
        color: '#fff',
        borderRadius: 8,
        padding: '20px 16px',
        fontSize,
        minWidth,
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={data.onSelect}
    >
      {data.label}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
};
