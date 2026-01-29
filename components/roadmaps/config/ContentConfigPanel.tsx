'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, TopicNodeData, SubTopicNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, {
  ConfigTextarea,
  ConfigColorPicker,
  ConfigSelect,
} from './BaseConfigPanel';
import { calistenicsIconNames } from '@/components/roadmaps/CalistenicsIcons';

type ContentNodeData = TopicNodeData | SubTopicNodeData;

interface ContentConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const nodeTypeLabels: Record<string, string> = {
  topic: 'Tema',
  subtopic: 'Subtema',
};

const ContentConfigPanel: React.FC<ContentConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as ContentNodeData;
  const nodeType = data.nodeType;

  const handleUpdate = (updates: Partial<ContentNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  // Opciones de iconos
  const iconOptions = [
    { value: 'none', label: 'Sin icono' },
    ...calistenicsIconNames.map((name) => ({
      value: name,
      label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
    })),
  ];

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={nodeTypeLabels[nodeType] || 'Contenido'}
      tabs={[
        { id: 'style', label: 'Estilo' },
        { id: 'content', label: 'Contenido' },
      ]}
    >
      {/* Tab de Estilo */}
      <div data-tab="style" className="space-y-4">
        {/* Color */}
        <ConfigColorPicker
          label="Color de fondo"
          value={data.color}
          onChange={(v) => handleUpdate({ color: v })}
          colors={[
            '#BB86FC', '#9A64D6', '#32D74B', '#03DAC5', '#FF453A',
            '#FF9F0A', '#64D2FF', '#BF5AF2', '#2563eb', '#64748b',
          ]}
        />

        {/* Icono */}
        <ConfigSelect
          label="Icono"
          value={data.icon || 'none'}
          onChange={(v) => handleUpdate({ icon: v as ContentNodeData['icon'] })}
          options={iconOptions}
        />
      </div>

      {/* Tab de Contenido */}
      <div data-tab="content" className="space-y-4">
        {/* Descripción */}
        <ConfigTextarea
          label="Descripción"
          value={data.description}
          onChange={(v) => handleUpdate({ description: v })}
          placeholder="Describe este tema..."
          rows={4}
        />

        {/* Tips (solo para Topic) */}
        {nodeType === 'topic' && (
          <ConfigTextarea
            label="Tips"
            value={(data as TopicNodeData).tips}
            onChange={(v) => handleUpdate({ tips: v } as Partial<TopicNodeData>)}
            placeholder="Consejos adicionales..."
            rows={3}
          />
        )}

        {/* Sección de recursos (solo para Topic) */}
        {nodeType === 'topic' && (
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Recursos
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {((data as TopicNodeData).resources || []).map((resource, index) => (
                <div
                  key={resource.id || index}
                  className="flex items-center gap-2 p-2 bg-background/50 rounded-lg"
                >
                  <input
                    type="text"
                    value={resource.title}
                    onChange={(e) => {
                      const newResources = [...((data as TopicNodeData).resources || [])];
                      newResources[index] = { ...resource, title: e.target.value };
                      handleUpdate({ resources: newResources } as Partial<TopicNodeData>);
                    }}
                    className="flex-1 px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                    placeholder="Título"
                  />
                  <button
                    onClick={() => {
                      const newResources = ((data as TopicNodeData).resources || []).filter(
                        (_, i) => i !== index
                      );
                      handleUpdate({ resources: newResources } as Partial<TopicNodeData>);
                    }}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newResources = [
                  ...((data as TopicNodeData).resources || []),
                  { id: Date.now().toString(), title: '', url: '', type: 'article' as const },
                ];
                handleUpdate({ resources: newResources } as Partial<TopicNodeData>);
              }}
              className="mt-2 w-full px-3 py-2 border border-dashed border-foreground/20
                       text-foreground/60 hover:text-foreground hover:border-primary-500/50
                       rounded-lg text-sm transition-colors"
            >
              + Agregar recurso
            </button>
          </div>
        )}
      </div>
    </BaseConfigPanel>
  );
};

export default ContentConfigPanel;
