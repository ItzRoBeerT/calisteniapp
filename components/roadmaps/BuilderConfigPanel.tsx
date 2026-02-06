'use client';

import React, { useState } from 'react';
import type { Node } from 'reactflow';
import { IconSelector } from './CalistenicsIcons';
import { nodeColors, type BuilderNodeData } from './BuilderNode';
import type { RoadmapResource, ResourceType } from '@/types/Roadmap';

interface BuilderConfigPanelProps {
  selectedNode: Node<BuilderNodeData>;
  onUpdateNode: (nodeId: string, data: Partial<BuilderNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

// Iconos SVG inline
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

// Tipos de recursos disponibles
const resourceTypes: { value: ResourceType; label: string; icon: string }[] = [
  { value: 'video', label: 'Video', icon: '🎬' },
  { value: 'article', label: 'Artículo', icon: '📖' },
  { value: 'documentation', label: 'Documentación', icon: '📚' },
  { value: 'course', label: 'Curso', icon: '🎓' },
  { value: 'tool', label: 'Herramienta', icon: '🔧' },
  { value: 'github', label: 'GitHub', icon: '💻' },
];

// Componente para un recurso individual
function ResourceItem({
  resource,
  onUpdate,
  onDelete,
}: {
  resource: RoadmapResource;
  onUpdate: (updates: Partial<RoadmapResource>) => void;
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeInfo = resourceTypes.find((t) => t.value === resource.type);

  return (
    <div className="border border-foreground/20 rounded-lg bg-background/50 overflow-hidden">
      {/* Header del recurso */}
      <div
        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-foreground/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg">{typeInfo?.icon || '📄'}</span>
        <span className="flex-1 text-sm text-foreground/80 truncate">
          {resource.title || 'Sin título'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Contenido expandido */}
      {isExpanded && (
        <div className="p-3 border-t border-foreground/10 space-y-3">
          {/* Tipo */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/60">Tipo</label>
            <select
              value={resource.type}
              onChange={(e) => onUpdate({ type: e.target.value as ResourceType })}
              className="w-full px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                         text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {resourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/60">Título</label>
            <input
              type="text"
              value={resource.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                         text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Título del recurso"
            />
          </div>

          {/* URL */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/60">URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={resource.url}
                onChange={(e) => onUpdate({ url: e.target.value })}
                className="flex-1 px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                           text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://..."
              />
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                >
                  <LinkIcon />
                </a>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/60">Descripción (opcional)</label>
            <textarea
              value={resource.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                         text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Breve descripción..."
            />
          </div>

          {/* Fila de opciones adicionales */}
          <div className="grid grid-cols-2 gap-2">
            {/* Proveedor */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/60">Proveedor</label>
              <input
                type="text"
                value={resource.provider || ''}
                onChange={(e) => onUpdate({ provider: e.target.value })}
                className="w-full px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                           text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="YouTube, Udemy..."
              />
            </div>

            {/* Duración */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/60">Duración</label>
              <input
                type="text"
                value={resource.duration || ''}
                onChange={(e) => onUpdate({ duration: e.target.value })}
                className="w-full px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                           text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="15 min"
              />
            </div>
          </div>

          {/* Es gratis */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={resource.isFree ?? true}
              onChange={(e) => onUpdate({ isFree: e.target.checked })}
              className="w-4 h-4 rounded border-foreground/30 text-primary-500
                         focus:ring-primary-500 focus:ring-offset-0 bg-background"
            />
            <span className="text-sm text-foreground/70">Recurso gratuito</span>
          </label>
        </div>
      )}
    </div>
  );
}

export default function BuilderConfigPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onClose,
}: BuilderConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'icon' | 'content' | 'resources'>('basic');
  const nodeData = selectedNode.data;

  const handleUpdate = (updates: Partial<BuilderNodeData>) => {
    onUpdateNode(selectedNode.id, updates);
  };

  // Funciones para manejar recursos
  const addResource = () => {
    const newResource: RoadmapResource = {
      id: `resource-${Date.now()}`,
      type: 'video',
      title: '',
      url: '',
      isFree: true,
    };
    handleUpdate({
      resources: [...(nodeData.resources || []), newResource],
    });
  };

  const updateResource = (resourceId: string, updates: Partial<RoadmapResource>) => {
    const updatedResources = (nodeData.resources || []).map((r) =>
      r.id === resourceId ? { ...r, ...updates } : r
    );
    handleUpdate({ resources: updatedResources });
  };

  const deleteResource = (resourceId: string) => {
    const updatedResources = (nodeData.resources || []).filter((r) => r.id !== resourceId);
    handleUpdate({ resources: updatedResources });
  };

  return (
    <aside className="w-80 bg-surface border-l border-foreground/10 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-foreground/10 flex items-center justify-between">
        <h3
          className="font-semibold text-foreground"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Editar Nodo
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-foreground/10">
        {[
          { id: 'basic', label: 'Básico' },
          { id: 'icon', label: 'Icono' },
          { id: 'content', label: 'Contenido' },
          { id: 'resources', label: 'Recursos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex-1 py-2.5 text-xs font-medium transition-colors
              ${
                activeTab === tab.id
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-foreground/50 hover:text-foreground/70'
              }
            `}
          >
            {tab.label}
            {tab.id === 'resources' && nodeData.resources && nodeData.resources.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-primary-500/20 text-primary-400 rounded-full">
                {nodeData.resources.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'basic' && (
          <>
            {/* Label */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Texto</label>
              <input
                type="text"
                value={nodeData.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                           text-foreground placeholder-foreground/40
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nombre del nodo"
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Color</label>
              <div className="grid grid-cols-5 gap-2">
                {nodeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleUpdate({ color: color.value })}
                    className={`
                      w-10 h-10 rounded-lg border-2 transition-all
                      ${
                        nodeData.color === color.value
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'icon' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Icono del nodo</label>
            <IconSelector
              selectedIcon={nodeData.icon || 'none'}
              onSelect={(icon) => handleUpdate({ icon })}
            />
          </div>
        )}

        {activeTab === 'content' && (
          <>
            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Descripción</label>
              <textarea
                value={nodeData.description || ''}
                onChange={(e) => handleUpdate({ description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                           text-foreground placeholder-foreground/40 resize-none
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe este paso del roadmap..."
              />
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Consejos / Tips</label>
              <textarea
                value={nodeData.tips || ''}
                onChange={(e) => handleUpdate({ tips: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                           text-foreground placeholder-foreground/40 resize-none
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Añade consejos útiles..."
              />
            </div>
          </>
        )}

        {activeTab === 'resources' && (
          <>
            {/* Lista de recursos */}
            <div className="space-y-2">
              {nodeData.resources && nodeData.resources.length > 0 ? (
                nodeData.resources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    onUpdate={(updates) => updateResource(resource.id, updates)}
                    onDelete={() => deleteResource(resource.id)}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-foreground/50">
                  <p className="text-sm">No hay recursos añadidos</p>
                  <p className="text-xs mt-1">Añade videos, artículos, cursos...</p>
                </div>
              )}
            </div>

            {/* Botón añadir recurso */}
            <button
              onClick={addResource}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                         bg-primary-500/10 border border-primary-500/30 rounded-lg
                         text-primary-400 hover:bg-primary-500/20 transition-colors"
            >
              <PlusIcon />
              <span>Añadir recurso</span>
            </button>

            {/* Info */}
            <div className="p-3 bg-tertiary-500/10 border border-tertiary-500/30 rounded-lg">
              <p className="text-xs text-tertiary-400">
                💡 Los recursos aparecerán en el panel de detalles cuando se visualice el roadmap.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer - Delete button */}
      <div className="p-4 border-t border-foreground/10">
        <button
          onClick={() => {
            if (confirm('¿Seguro que quieres eliminar este nodo?')) {
              onDeleteNode(selectedNode.id);
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                     bg-red-500/10 border border-red-500/30 rounded-lg
                     text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <TrashIcon />
          <span>Eliminar nodo</span>
        </button>
      </div>
    </aside>
  );
}
