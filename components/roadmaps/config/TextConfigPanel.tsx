'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, TitleNodeData, ParagraphNodeData, LabelNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigSelect, ConfigColorPicker } from './BaseConfigPanel';

type TextNodeData = TitleNodeData | ParagraphNodeData | LabelNodeData;

interface TextConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const nodeTypeLabels: Record<string, string> = {
  title: 'Título',
  paragraph: 'Párrafo',
  label: 'Etiqueta',
};

const TextConfigPanel: React.FC<TextConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as TextNodeData;
  const nodeType = data.nodeType;

  const handleUpdate = (updates: Partial<TextNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={nodeTypeLabels[nodeType] || 'Texto'}
      tabs={[{ id: 'style', label: 'Estilo' }]}
      hideSizeControls={true}
    >
      {/* Tab de Estilo */}
      <div data-tab="style" className="space-y-4">
        {/* Tip sobre resize */}
        <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <p className="text-xs text-foreground/70">
            <strong className="text-primary-400">Tip:</strong> Usa los controles de las esquinas
            del nodo para ajustar el tamaño arrastrando.
          </p>
        </div>

        {/* Tamaño de fuente */}
        <ConfigInput
          label="Tamaño de fuente"
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
            label="Peso de fuente"
            value={String((data as TitleNodeData).fontWeight || 700)}
            onChange={(v) => handleUpdate({ fontWeight: parseInt(v) } as Partial<TitleNodeData>)}
            options={[
              { value: '400', label: 'Normal' },
              { value: '500', label: 'Medio' },
              { value: '600', label: 'Semi-negrita' },
              { value: '700', label: 'Negrita' },
              { value: '800', label: 'Extra-negrita' },
            ]}
          />
        )}

        {/* Alineación (para títulos y párrafos) */}
        {(nodeType === 'title' || nodeType === 'paragraph') && (
          <ConfigSelect
            label="Alineación"
            value={(data as TitleNodeData | ParagraphNodeData).textAlign || 'center'}
            onChange={(v) => handleUpdate({ textAlign: v as 'left' | 'center' | 'right' } as Partial<TextNodeData>)}
            options={[
              { value: 'left', label: 'Izquierda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Derecha' },
            ]}
          />
        )}

        {/* Altura de línea (solo para párrafos) */}
        {nodeType === 'paragraph' && (
          <ConfigInput
            label="Altura de línea"
            value={(data as ParagraphNodeData).lineHeight}
            onChange={(v) => handleUpdate({ lineHeight: parseFloat(v) || undefined } as Partial<ParagraphNodeData>)}
            type="number"
            placeholder="1.5"
            min={1}
            max={3}
          />
        )}

        {/* Color */}
        <ConfigColorPicker
          label="Color del texto"
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
              label="Color de fondo"
              value={(data as LabelNodeData).backgroundColor}
              onChange={(v) => handleUpdate({ backgroundColor: v } as Partial<LabelNodeData>)}
              colors={[
                'transparent', 'rgba(187, 134, 252, 0.2)', 'rgba(50, 215, 75, 0.2)',
                'rgba(255, 69, 58, 0.2)', 'rgba(255, 159, 10, 0.2)', 'rgba(100, 210, 255, 0.2)',
              ]}
            />
            <ConfigInput
              label="Padding"
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
