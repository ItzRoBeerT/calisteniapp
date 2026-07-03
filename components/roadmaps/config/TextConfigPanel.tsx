'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, TitleNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigSelect, ConfigColorPicker } from './BaseConfigPanel';
import { useTranslations } from 'next-intl';

interface TextConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const TextConfigPanel: React.FC<TextConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as TitleNodeData;
  const t = useTranslations('RoadmapBuilder');

  const handleUpdate = (updates: Partial<TitleNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={t('nodeTypes.title')}
      tabs={[{ id: 'style', label: t('tabs.style') }]}
      hideSizeControls={true}
    >
      {/* Tab de Estilo */}
      <div data-tab="style" className="space-y-4">
        {/* Tamaño de fuente */}
        <ConfigInput
          label={t('fields.fontSize')}
          value={data.fontSize}
          onChange={(v) => handleUpdate({ fontSize: parseInt(v) || undefined })}
          type="number"
          placeholder="32"
          min={8}
          max={120}
        />

        {/* Peso de fuente */}
        <ConfigSelect
          label={t('fields.fontWeight')}
          value={String(data.fontWeight || 700)}
          onChange={(v) => handleUpdate({ fontWeight: parseInt(v) })}
          options={[
            { value: '400', label: 'Normal' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semi-bold' },
            { value: '700', label: 'Bold' },
            { value: '800', label: 'Extra-bold' },
          ]}
        />

        {/* Alineación */}
        <ConfigSelect
          label={t('fields.textAlign')}
          value={data.textAlign || 'center'}
          onChange={(v) => handleUpdate({ textAlign: v as 'left' | 'center' | 'right' })}
          options={[
            { value: 'left', label: t('fields.alignLeft') },
            { value: 'center', label: t('fields.alignCenter') },
            { value: 'right', label: t('fields.alignRight') },
          ]}
        />

        {/* Color */}
        <ConfigColorPicker
          label={t('fields.textColor')}
          value={data.color}
          onChange={(v) => handleUpdate({ color: v })}
          colors={[
            '#ffffff', '#e0e0e0', '#a0a0a0', '#BB86FC', '#32D74B',
            '#FF453A', '#FF9F0A', '#64D2FF', '#BF5AF2', '#03DAC5',
          ]}
        />
      </div>
    </BaseConfigPanel>
  );
};

export default TextConfigPanel;
