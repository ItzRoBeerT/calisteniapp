'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type {
  AnyNodeData,
  ButtonNodeData,
  ResourceButtonNodeData,
  TodoNodeData,
  ChecklistNodeData,
} from '@/types/RoadmapNodes';
import BaseConfigPanel, {
  ConfigInput,
  ConfigColorPicker,
  ConfigSelect,
  ConfigCheckbox,
} from './BaseConfigPanel';
import { calistenicsIconNames } from '@/components/roadmaps/CalistenicsIcons';

type InteractiveNodeData = ButtonNodeData | ResourceButtonNodeData | TodoNodeData | ChecklistNodeData;

interface InteractiveConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const nodeTypeLabels: Record<string, string> = {
  button: 'Botón',
  resourceButton: 'Recurso',
  todo: 'Tarea',
  checklist: 'Checklist',
};

const InteractiveConfigPanel: React.FC<InteractiveConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as InteractiveNodeData;
  const nodeType = data.nodeType;

  const handleUpdate = (updates: Partial<InteractiveNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  const iconOptions = [
    { value: 'none', label: 'Sin icono' },
    ...calistenicsIconNames.map((name) => ({
      value: name,
      label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
    })),
  ];

  const getTabs = () => {
    if (nodeType === 'checklist') {
      return [{ id: 'items', label: 'Items' }];
    }
    if (nodeType === 'button' || nodeType === 'resourceButton') {
      return [{ id: 'style', label: 'Estilo' }];
    }
    return [];
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={nodeTypeLabels[nodeType] || 'Interactivo'}
      tabs={getTabs()}
    >
      {/* Configuración de Button */}
      {nodeType === 'button' && (
        <div data-tab="style" className="space-y-4">
          <ConfigInput
            label="URL"
            value={(data as ButtonNodeData).url}
            onChange={(v) => handleUpdate({ url: v } as Partial<ButtonNodeData>)}
            type="url"
            placeholder="https://ejemplo.com"
          />
          <ConfigSelect
            label="Variante"
            value={(data as ButtonNodeData).variant || 'solid'}
            onChange={(v) =>
              handleUpdate({ variant: v as ButtonNodeData['variant'] } as Partial<ButtonNodeData>)
            }
            options={[
              { value: 'solid', label: 'Sólido' },
              { value: 'outline', label: 'Contorno' },
              { value: 'ghost', label: 'Fantasma' },
            ]}
          />
          <ConfigColorPicker
            label="Color de fondo"
            value={(data as ButtonNodeData).backgroundColor}
            onChange={(v) => handleUpdate({ backgroundColor: v } as Partial<ButtonNodeData>)}
          />
          <ConfigColorPicker
            label="Color de texto"
            value={(data as ButtonNodeData).textColor}
            onChange={(v) => handleUpdate({ textColor: v } as Partial<ButtonNodeData>)}
            colors={['#ffffff', '#000000', '#e0e0e0', '#1a1a1a']}
          />
          <ConfigSelect
            label="Icono"
            value={(data as ButtonNodeData).icon || 'none'}
            onChange={(v) =>
              handleUpdate({ icon: v as ButtonNodeData['icon'] } as Partial<ButtonNodeData>)
            }
            options={iconOptions}
          />
        </div>
      )}

      {/* Configuración de ResourceButton */}
      {nodeType === 'resourceButton' && (
        <div data-tab="style" className="space-y-4">
          <ConfigInput
            label="URL"
            value={(data as ResourceButtonNodeData).url}
            onChange={(v) => handleUpdate({ url: v } as Partial<ResourceButtonNodeData>)}
            type="url"
            placeholder="https://ejemplo.com"
          />
          <ConfigInput
            label="Texto del badge"
            value={(data as ResourceButtonNodeData).badgeText}
            onChange={(v) => handleUpdate({ badgeText: v } as Partial<ResourceButtonNodeData>)}
            placeholder="FREE"
          />
          <ConfigColorPicker
            label="Color del badge"
            value={(data as ResourceButtonNodeData).badgeBackgroundColor}
            onChange={(v) =>
              handleUpdate({ badgeBackgroundColor: v } as Partial<ResourceButtonNodeData>)
            }
            colors={['#32D74B', '#FF9F0A', '#FF453A', '#64D2FF', '#BB86FC']}
          />
          <ConfigColorPicker
            label="Color de fondo"
            value={(data as ResourceButtonNodeData).backgroundColor}
            onChange={(v) => handleUpdate({ backgroundColor: v } as Partial<ResourceButtonNodeData>)}
          />
          <ConfigSelect
            label="Icono"
            value={(data as ResourceButtonNodeData).icon || 'none'}
            onChange={(v) =>
              handleUpdate({
                icon: v as ResourceButtonNodeData['icon'],
              } as Partial<ResourceButtonNodeData>)
            }
            options={iconOptions}
          />
        </div>
      )}

      {/* Configuración de Todo */}
      {nodeType === 'todo' && (
        <div className="space-y-4">
          <ConfigCheckbox
            label="Completado"
            checked={(data as TodoNodeData).checked}
            onChange={(v) => handleUpdate({ checked: v } as Partial<TodoNodeData>)}
            description="Estado inicial de la tarea"
          />
        </div>
      )}

      {/* Configuración de Checklist */}
      {nodeType === 'checklist' && (
        <div data-tab="items" className="space-y-4">
          <label className="block text-sm font-medium text-foreground/70 mb-2">Items</label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {((data as ChecklistNodeData).items || []).map((item, index) => (
              <div
                key={item.id || `checklist-item-${index}`}
                className="flex items-center gap-2 p-2 bg-background/50 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    const newItems = [...(data as ChecklistNodeData).items];
                    newItems[index] = { ...item, checked: e.target.checked };
                    handleUpdate({ items: newItems } as Partial<ChecklistNodeData>);
                  }}
                  className="w-4 h-4 rounded border-foreground/30 text-primary-500"
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...(data as ChecklistNodeData).items];
                    newItems[index] = { ...item, text: e.target.value };
                    handleUpdate({ items: newItems } as Partial<ChecklistNodeData>);
                  }}
                  className="flex-1 px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                  placeholder="Texto del item"
                />
                <button
                  onClick={() => {
                    const newItems = (data as ChecklistNodeData).items.filter(
                      (_, i) => i !== index
                    );
                    handleUpdate({ items: newItems } as Partial<ChecklistNodeData>);
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
            ))}
          </div>
          <button
            onClick={() => {
              const newItems = [
                ...((data as ChecklistNodeData).items || []),
                { id: `check-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, text: '', checked: false },
              ];
              handleUpdate({ items: newItems } as Partial<ChecklistNodeData>);
            }}
            className="w-full px-3 py-2 border border-dashed border-foreground/20
                     text-foreground/60 hover:text-foreground hover:border-primary-500/50
                     rounded-lg text-sm transition-colors"
          >
            + Agregar item
          </button>
        </div>
      )}
    </BaseConfigPanel>
  );
};

export default InteractiveConfigPanel;
