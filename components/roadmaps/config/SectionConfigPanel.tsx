'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, SectionNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigColorPicker } from './BaseConfigPanel';

interface SectionConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const SectionConfigPanel: React.FC<SectionConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as SectionNodeData;

  const handleUpdate = (updates: Partial<SectionNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title="Sección"
      tabs={[{ id: 'style', label: 'Estilo' }]}
    >
      {/* Tab de Estilo */}
      <div data-tab="style" className="space-y-4">
        {/* Color de fondo */}
        <ConfigColorPicker
          label="Color de fondo"
          value={data.backgroundColor}
          onChange={(v) => handleUpdate({ backgroundColor: v })}
          colors={[
            'rgba(30, 30, 30, 0.5)',
            'rgba(187, 134, 252, 0.1)',
            'rgba(50, 215, 75, 0.1)',
            'rgba(255, 69, 58, 0.1)',
            'rgba(255, 159, 10, 0.1)',
            'rgba(100, 210, 255, 0.1)',
            'transparent',
          ]}
        />

        {/* Color del borde */}
        <ConfigColorPicker
          label="Color del borde"
          value={data.borderColor}
          onChange={(v) => handleUpdate({ borderColor: v })}
          colors={[
            'rgba(187, 134, 252, 0.3)',
            'rgba(187, 134, 252, 0.5)',
            'rgba(50, 215, 75, 0.3)',
            'rgba(255, 69, 58, 0.3)',
            'rgba(100, 210, 255, 0.3)',
            'rgba(255, 255, 255, 0.1)',
            'transparent',
          ]}
        />

        {/* Padding */}
        <ConfigInput
          label="Padding interno"
          value={data.padding}
          onChange={(v) => handleUpdate({ padding: parseInt(v) || undefined })}
          type="number"
          placeholder="16"
          min={0}
          max={100}
        />

        {/* Información */}
        <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <p className="text-xs text-foreground/70">
            <strong className="text-primary-400">Tip:</strong> Arrastra otros nodos dentro de esta
            sección para agruparlos. Los nodos hijos se moverán junto con la sección.
          </p>
        </div>
      </div>
    </BaseConfigPanel>
  );
};

export default SectionConfigPanel;
