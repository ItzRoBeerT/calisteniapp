'use client';

import React, { useState } from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData } from '@/types/RoadmapNodes';
import { useTranslations } from 'next-intl';

export interface BaseConfigPanelProps {
  children?: React.ReactNode;
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
  title: string;
  tabs?: Array<{ id: string; label: string }>;
  /** Ocultar controles de tamaño (para nodos que usan NodeResizer) */
  hideSizeControls?: boolean;
}

const BaseConfigPanel: React.FC<BaseConfigPanelProps> = ({
  children,
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
  title,
  tabs = [],
  hideSizeControls = false,
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const nodeData = node.data;
  const t = useTranslations('RoadmapBuilder');

  const handleUpdate = (updates: Partial<AnyNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  const handleDelete = () => {
    onDeleteNode(node.id);
    onClose();
  };

  // Tabs disponibles: siempre incluye "Básico"
  const allTabs = [{ id: 'basic', label: t('tabs.basic') }, ...tabs];

  return (
    <div
      className="w-80 h-full flex flex-col border-l border-foreground/10 bg-surface/95 backdrop-blur-md"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-foreground/10">
        <h3
          className="text-lg font-semibold text-foreground"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {title}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      {allTabs.length > 1 && (
        <div className="flex border-b border-foreground/10">
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab: Básico - común a todos los nodos */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {t('fields.label')}
              </label>
              <input
                type="text"
                value={nodeData.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                         text-foreground placeholder-foreground/40
                         focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
                         transition-colors"
                placeholder={t('fields.label')}
              />
            </div>

            {/* Tamaño - oculto para nodos que usan NodeResizer */}
            {!hideSizeControls && (
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                  {t('fields.size')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1">{t('fields.width')}</label>
                    <input
                      type="number"
                      value={nodeData.width || ''}
                      onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                               text-foreground text-sm
                               focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
                               transition-colors"
                      placeholder="Auto"
                      min={50}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1">{t('fields.height')}</label>
                    <input
                      type="number"
                      value={nodeData.height || ''}
                      onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                               text-foreground text-sm
                               focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
                               transition-colors"
                      placeholder="Auto"
                      min={30}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Handles */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {t('handles.title')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
                  <label
                    key={position}
                    className="flex items-center gap-2 p-2 bg-background/50 rounded-lg cursor-pointer
                             hover:bg-foreground/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={nodeData.handles?.[position] ?? true}
                      onChange={(e) =>
                        handleUpdate({
                          handles: {
                            ...nodeData.handles,
                            [position]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded border-foreground/30 text-primary-500
                               focus:ring-primary-500/50 bg-background"
                    />
                    <span className="text-sm text-foreground/70 capitalize">
                      {t(`handles.${position}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contenido específico del tipo de nodo (children) */}
        {children && React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.props['data-tab']) {
            // Solo mostrar el child si su data-tab coincide con activeTab
            if (child.props['data-tab'] === activeTab) {
              return React.cloneElement(child, { key: child.props['data-tab'] || `tab-content-${index}` });
            }
            return null;
          }
          // Si no tiene data-tab, mostrar siempre (para contenido genérico)
          if (activeTab !== 'basic') {
            return React.cloneElement(child as React.ReactElement, { key: `generic-content-${index}` });
          }
          return null;
        })}
      </div>

      {/* Footer con botón de eliminar */}
      <div className="p-4 border-t border-foreground/10">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                   bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300
                   rounded-lg transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t('actions.delete')}
        </button>
      </div>
    </div>
  );
};

export default BaseConfigPanel;

// ============================================
// COMPONENTES AUXILIARES PARA PANELES HIJOS
// ============================================

// Input de texto reutilizable
export const ConfigInput: React.FC<{
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, type = 'text', placeholder, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-foreground/70 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
               text-foreground placeholder-foreground/40
               focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
               transition-colors"
      placeholder={placeholder}
      min={min}
      max={max}
    />
  </div>
);

// Textarea reutilizable
export const ConfigTextarea: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-foreground/70 mb-1.5">
      {label}
    </label>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
               text-foreground placeholder-foreground/40 resize-none
               focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
               transition-colors"
      placeholder={placeholder}
    />
  </div>
);

// Select reutilizable
export const ConfigSelect: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-foreground/70 mb-1.5">
      {label}
    </label>
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
               text-foreground
               focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
               transition-colors"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Color picker reutilizable
export const ConfigColorPicker: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  colors?: string[];
}> = ({
  label,
  value,
  onChange,
  colors = [
    '#BB86FC', '#32D74B', '#03DAC5', '#FF453A', '#FF9F0A',
    '#64D2FF', '#BF5AF2', '#2563eb', '#dc2626', '#64748b',
  ],
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground/70 mb-1.5">
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-lg border-2 transition-all
            ${value === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
    {/* Input para color personalizado */}
    <div className="flex items-center gap-2 mt-2">
      <input
        type="color"
        value={value || '#BB86FC'}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#BB86FC"
        className="flex-1 px-2 py-1 bg-background border border-foreground/20 rounded
                 text-foreground text-sm
                 focus:outline-none focus:border-primary-500"
      />
    </div>
  </div>
);

// Checkbox reutilizable
export const ConfigCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}> = ({ label, checked, onChange, description }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 mt-0.5 rounded border-foreground/30 text-primary-500
               focus:ring-primary-500/50 bg-background cursor-pointer"
    />
    <div>
      <span className="text-sm font-medium text-foreground group-hover:text-primary-400 transition-colors">
        {label}
      </span>
      {description && (
        <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
      )}
    </div>
  </label>
);
