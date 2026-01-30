'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, LegendNodeData, LinksGroupNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigSelect } from './BaseConfigPanel';
import { calistenicsIconNames } from '@/components/roadmaps/CalistenicsIcons';
import { useTranslations } from 'next-intl';

type ListNodeData = LegendNodeData | LinksGroupNodeData;

interface ListConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const ListConfigPanel: React.FC<ListConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as ListNodeData;
  const nodeType = data.nodeType;
  const t = useTranslations('RoadmapBuilder');

  const nodeTypeLabels: Record<string, string> = {
    legend: t('nodeTypes.legend'),
    linksGroup: t('nodeTypes.linksGroup'),
  };

  const handleUpdate = (updates: Partial<ListNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  const iconOptions = [
    { value: 'none', label: t('fields.noIcon') },
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
      title={nodeTypeLabels[nodeType] || t('categories.list')}
      tabs={[{ id: 'items', label: t('tabs.items') }]}
    >
      {/* Configuración de Legend */}
      {nodeType === 'legend' && (
        <div data-tab="items" className="space-y-4">
          {/* Orientación */}
          <ConfigSelect
            label={t('fields.textAlign')}
            value={(data as LegendNodeData).orientation || 'vertical'}
            onChange={(v) =>
              handleUpdate({
                orientation: v as LegendNodeData['orientation'],
              } as Partial<LegendNodeData>)
            }
            options={[
              { value: 'vertical', label: 'Vertical' },
              { value: 'horizontal', label: 'Horizontal' },
            ]}
          />

          {/* Items */}
          <label className="block text-sm font-medium text-foreground/70 mb-2">{t('tabs.items')}</label>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {((data as LegendNodeData).items || []).map((item, index) => (
              <div key={item.id || `legend-item-${index}`} className="p-3 bg-background/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...(data as LegendNodeData).items];
                      newItems[index] = { ...item, label: e.target.value };
                      handleUpdate({ items: newItems } as Partial<LegendNodeData>);
                    }}
                    className="flex-1 px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                    placeholder={t('items.itemTextPlaceholder')}
                  />
                  <button
                    onClick={() => {
                      const newItems = (data as LegendNodeData).items.filter((_, i) => i !== index);
                      handleUpdate({ items: newItems } as Partial<LegendNodeData>);
                    }}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...(data as LegendNodeData).items];
                      newItems[index] = {
                        ...item,
                        icon: e.target.value as LegendNodeData['items'][0]['icon'],
                      };
                      handleUpdate({ items: newItems } as Partial<LegendNodeData>);
                    }}
                    className="flex-1 px-2 py-1 bg-background border border-foreground/20 rounded text-xs text-foreground"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={item.color || '#BB86FC'}
                    onChange={(e) => {
                      const newItems = [...(data as LegendNodeData).items];
                      newItems[index] = { ...item, color: e.target.value };
                      handleUpdate({ items: newItems } as Partial<LegendNodeData>);
                    }}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newItems = [
                ...((data as LegendNodeData).items || []),
                { id: `legend-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, icon: 'none' as const, label: '', color: '#BB86FC' },
              ];
              handleUpdate({ items: newItems } as Partial<LegendNodeData>);
            }}
            className="w-full px-3 py-2 border border-dashed border-foreground/20
                     text-foreground/60 hover:text-foreground hover:border-primary-500/50
                     rounded-lg text-sm transition-colors"
          >
            + {t('items.addItem')}
          </button>
        </div>
      )}

      {/* Configuración de LinksGroup */}
      {nodeType === 'linksGroup' && (
        <div data-tab="items" className="space-y-4">
          <label className="block text-sm font-medium text-foreground/70 mb-2">{t('items.linkLabel')}</label>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {((data as LinksGroupNodeData).items || []).map((item, index) => (
              <div key={item.id || `link-item-${index}`} className="p-3 bg-background/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...(data as LinksGroupNodeData).items];
                      newItems[index] = { ...item, label: e.target.value };
                      handleUpdate({ items: newItems } as Partial<LinksGroupNodeData>);
                    }}
                    className="flex-1 px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                    placeholder={t('items.linkLabelPlaceholder')}
                  />
                  <button
                    onClick={() => {
                      const newItems = (data as LinksGroupNodeData).items.filter(
                        (_, i) => i !== index
                      );
                      handleUpdate({ items: newItems } as Partial<LinksGroupNodeData>);
                    }}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => {
                    const newItems = [...(data as LinksGroupNodeData).items];
                    newItems[index] = { ...item, url: e.target.value };
                    handleUpdate({ items: newItems } as Partial<LinksGroupNodeData>);
                  }}
                  className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                  placeholder={t('items.linkUrlPlaceholder')}
                />
                <select
                  value={item.icon || 'none'}
                  onChange={(e) => {
                    const newItems = [...(data as LinksGroupNodeData).items];
                    newItems[index] = {
                      ...item,
                      icon: e.target.value as LinksGroupNodeData['items'][0]['icon'],
                    };
                    handleUpdate({ items: newItems } as Partial<LinksGroupNodeData>);
                  }}
                  className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-xs text-foreground"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newItems = [
                ...((data as LinksGroupNodeData).items || []),
                { id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, label: '', url: '' },
              ];
              handleUpdate({ items: newItems } as Partial<LinksGroupNodeData>);
            }}
            className="w-full px-3 py-2 border border-dashed border-foreground/20
                     text-foreground/60 hover:text-foreground hover:border-primary-500/50
                     rounded-lg text-sm transition-colors"
          >
            + {t('items.addLink')}
          </button>
        </div>
      )}
    </BaseConfigPanel>
  );
};

export default ListConfigPanel;
