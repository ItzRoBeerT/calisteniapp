'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, TitleNodeData, ParagraphNodeData, LabelNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigSelect, ConfigColorPicker } from './BaseConfigPanel';
import { useTranslations } from 'next-intl';

type TextNodeData = TitleNodeData | ParagraphNodeData | LabelNodeData;

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
  const data = node.data as TextNodeData;
  const nodeType = data.nodeType;
  const t = useTranslations('RoadmapBuilder');

  const nodeTypeLabels: Record<string, string> = {
    title: t('nodeTypes.title'),
    paragraph: t('nodeTypes.paragraph'),
    label: t('nodeTypes.label'),
  };

  const handleUpdate = (updates: Partial<TextNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={nodeTypeLabels[nodeType] || t('categories.text')}
      tabs={[{ id: 'style', label: t('tabs.style') }]}
      hideSizeControls={true}
    >
      {/* Tab de Estilo */}
      <div data-tab="style" className="space-y-4">
        {/* Tamaño de fuente */}
        <ConfigInput
          label={t('fields.fontSize')}
          value={data.fontSize}
          onChange={(v) => handleUpdate({ fontSize: parseInt(v) || undefined } as Partial<TextNodeData>)}
          type="number"
          placeholder={nodeType === 'title' ? '32' : nodeType === 'paragraph' ? '14' : '12'}
          min={8}
          max={120}
        />

        {/* Peso de fuente (solo para títulos) */}
        {nodeType === 'title' && (
          <ConfigSelect
            label={t('fields.fontWeight')}
            value={String((data as TitleNodeData).fontWeight || 700)}
            onChange={(v) => handleUpdate({ fontWeight: parseInt(v) } as Partial<TitleNodeData>)}
            options={[
              { value: '400', label: 'Normal' },
              { value: '500', label: 'Medium' },
              { value: '600', label: 'Semi-bold' },
              { value: '700', label: 'Bold' },
              { value: '800', label: 'Extra-bold' },
            ]}
          />
        )}

        {/* Alineación (para títulos y párrafos) */}
        {(nodeType === 'title' || nodeType === 'paragraph') && (
          <ConfigSelect
            label={t('fields.textAlign')}
            value={(data as TitleNodeData | ParagraphNodeData).textAlign || 'center'}
            onChange={(v) => handleUpdate({ textAlign: v as 'left' | 'center' | 'right' } as Partial<TextNodeData>)}
            options={[
              { value: 'left', label: t('fields.alignLeft') },
              { value: 'center', label: t('fields.alignCenter') },
              { value: 'right', label: t('fields.alignRight') },
            ]}
          />
        )}

        {/* Color */}
        <ConfigColorPicker
          label={t('fields.textColor')}
          value={data.color}
          onChange={(v) => handleUpdate({ color: v } as Partial<TextNodeData>)}
          colors={[
            '#ffffff', '#e0e0e0', '#a0a0a0', '#BB86FC', '#32D74B',
            '#FF453A', '#FF9F0A', '#64D2FF', '#BF5AF2', '#03DAC5',
          ]}
        />

        {/* Fondo (solo para etiquetas) */}
        {nodeType === 'label' && (
          <>
            <ConfigColorPicker
              label={t('fields.backgroundColor')}
              value={(data as LabelNodeData).backgroundColor}
              onChange={(v) => handleUpdate({ backgroundColor: v } as Partial<LabelNodeData>)}
              colors={[
                'transparent', 'rgba(187, 134, 252, 0.2)', 'rgba(50, 215, 75, 0.2)',
                'rgba(255, 69, 58, 0.2)', 'rgba(255, 159, 10, 0.2)', 'rgba(100, 210, 255, 0.2)',
              ]}
            />
            <ConfigInput
              label={t('fields.padding')}
              value={(data as LabelNodeData).padding}
              onChange={(v) => handleUpdate({ padding: parseInt(v) || undefined } as Partial<LabelNodeData>)}
              type="number"
              placeholder="4"
              min={0}
              max={24}
            />
          </>
        )}
      </div>
    </BaseConfigPanel>
  );
};

export default TextConfigPanel;
