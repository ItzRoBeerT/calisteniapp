'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, HorizontalLineNodeData, VerticalLineNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigSelect, ConfigColorPicker } from './BaseConfigPanel';

type LineNodeData = HorizontalLineNodeData | VerticalLineNodeData;

interface LineConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const nodeTypeLabels: Record<string, string> = {
  horizontalLine: 'Línea Horizontal',
  verticalLine: 'Línea Vertical',
};

const LineConfigPanel: React.FC<LineConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as LineNodeData;
  const nodeType = data.nodeType;

  const handleUpdate = (updates: Partial<LineNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={nodeTypeLabels[nodeType] || 'Línea'}
      tabs={[{ id: 'style', label: 'Estilo' }]}
    >
      {/* Tab de Estilo */}
      <div data-tab="style" className="space-y-4">
        {/* Color */}
        <ConfigColorPicker
          label="Color"
          value={data.color}
          onChange={(v) => handleUpdate({ color: v })}
          colors={[
            '#8E8E93', '#BB86FC', '#32D74B', '#FF453A', '#FF9F0A',
            '#64D2FF', '#ffffff', '#3d3d3d', '#555555', '#777777',
          ]}
        />

        {/* Grosor */}
        <ConfigInput
          label="Grosor"
          value={data.thickness}
          onChange={(v) => handleUpdate({ thickness: parseInt(v) || 2 })}
          type="number"
          placeholder="2"
          min={1}
          max={20}
        />

        {/* Estilo de línea */}
        <ConfigSelect
          label="Estilo de línea"
          value={data.lineStyle || 'solid'}
          onChange={(v) => handleUpdate({ lineStyle: v as LineNodeData['lineStyle'] })}
          options={[
            { value: 'solid', label: 'Sólida' },
            { value: 'dashed', label: 'Discontinua' },
            { value: 'dotted', label: 'Punteada' },
          ]}
        />

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">Vista previa</label>
          <div className="p-4 bg-background/50 rounded-lg flex items-center justify-center">
            <div
              style={{
                width: nodeType === 'horizontalLine' ? '100%' : data.thickness || 2,
                height: nodeType === 'verticalLine' ? '60px' : data.thickness || 2,
                backgroundColor: data.color || '#8E8E93',
                borderStyle: data.lineStyle || 'solid',
              }}
            />
          </div>
        </div>
      </div>
    </BaseConfigPanel>
  );
};

export default LineConfigPanel;
