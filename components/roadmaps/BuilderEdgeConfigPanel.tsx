'use client';

import React, { useState } from 'react';
import { type Edge, MarkerType } from 'reactflow';

// Tipos de línea disponibles
export type EdgeLineStyle = 'solid' | 'dashed' | 'dotted' | 'longDash';

// Tipos de flecha
export type EdgeArrowStyle = 'none' | 'forward' | 'backward' | 'both';

// Tipos de camino
export type EdgePathStyle = 'bezier' | 'straight' | 'step' | 'smoothstep';

// Datos extendidos del edge
export interface BuilderEdgeData {
  lineStyle?: EdgeLineStyle;
  arrowStyle?: EdgeArrowStyle;
  pathStyle?: EdgePathStyle;
  label?: string;
}

interface BuilderEdgeConfigPanelProps {
  selectedEdge: Edge<BuilderEdgeData>;
  onUpdateEdge: (edgeId: string, updates: Partial<Edge<BuilderEdgeData>>) => void;
  onDeleteEdge: (edgeId: string) => void;
  onClose: () => void;
}

// Iconos SVG
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

// Colores disponibles para edges
const edgeColors = [
  { value: '#BB86FC', label: 'Púrpura' },
  { value: '#03DAC5', label: 'Cian' },
  { value: '#32D74B', label: 'Verde' },
  { value: '#FF453A', label: 'Rojo' },
  { value: '#FF9F0A', label: 'Naranja' },
  { value: '#64D2FF', label: 'Azul' },
  { value: '#BF5AF2', label: 'Magenta' },
  { value: '#FFFFFF', label: 'Blanco' },
  { value: '#8E8E93', label: 'Gris' },
];

// Estilos de línea con iconos SVG
const lineStyles: { value: EdgeLineStyle; dasharray?: string }[] = [
  { value: 'solid', dasharray: undefined },
  { value: 'dashed', dasharray: '8 4' },
  { value: 'dotted', dasharray: '2 4' },
  { value: 'longDash', dasharray: '16 6' },
];

// Estilos de flecha
const arrowStyles: { value: EdgeArrowStyle; label: string }[] = [
  { value: 'backward', label: 'Izquierda' },
  { value: 'none', label: 'Ninguna' },
  { value: 'forward', label: 'Derecha' },
  { value: 'both', label: 'Ambas' },
];

// Estilos de camino
const pathStyles: { value: EdgePathStyle; label: string }[] = [
  { value: 'bezier', label: 'Curva' },
  { value: 'straight', label: 'Recta' },
  { value: 'step', label: 'Escalón' },
  { value: 'smoothstep', label: 'Escalón suave' },
];

// Componente de botón de estilo
function StyleButton({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all
        ${active
          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
          : 'border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground/70'
        }
      `}
    >
      {children}
    </button>
  );
}

export default function BuilderEdgeConfigPanel({
  selectedEdge,
  onUpdateEdge,
  onDeleteEdge,
  onClose,
}: BuilderEdgeConfigPanelProps) {
  const edgeData = selectedEdge.data || {};
  const currentColor = (selectedEdge.style?.stroke as string) || '#BB86FC';
  const currentLineStyle = edgeData.lineStyle || 'solid';
  const currentArrowStyle = edgeData.arrowStyle || 'forward';
  const currentPathStyle = edgeData.pathStyle || 'bezier';

  const [customColor, setCustomColor] = useState(currentColor);

  // Actualizar color
  const handleColorChange = (color: string) => {
    setCustomColor(color);
    onUpdateEdge(selectedEdge.id, {
      style: { ...selectedEdge.style, stroke: color },
    });
  };

  // Actualizar estilo de línea
  const handleLineStyleChange = (lineStyle: EdgeLineStyle) => {
    const styleConfig = lineStyles.find(s => s.value === lineStyle);

    onUpdateEdge(selectedEdge.id, {
      style: {
        ...selectedEdge.style,
        strokeDasharray: styleConfig?.dasharray,
      },
      data: { ...edgeData, lineStyle },
      animated: false, // Desactivar animación al cambiar estilo
    });
  };

  // Actualizar estilo de flecha
  const handleArrowStyleChange = (arrowStyle: EdgeArrowStyle) => {
    let markerStart: { type: MarkerType; color?: string } | undefined;
    let markerEnd: { type: MarkerType; color?: string } | undefined;

    if (arrowStyle === 'forward' || arrowStyle === 'both') {
      markerEnd = { type: MarkerType.ArrowClosed, color: currentColor };
    }
    if (arrowStyle === 'backward' || arrowStyle === 'both') {
      markerStart = { type: MarkerType.ArrowClosed, color: currentColor };
    }

    onUpdateEdge(selectedEdge.id, {
      markerStart,
      markerEnd,
      data: { ...edgeData, arrowStyle },
    });
  };

  // Actualizar tipo de camino
  const handlePathStyleChange = (pathStyle: EdgePathStyle) => {
    let type: string;
    switch (pathStyle) {
      case 'straight':
        type = 'straight';
        break;
      case 'step':
        type = 'step';
        break;
      case 'smoothstep':
        type = 'smoothstep';
        break;
      default:
        type = 'default'; // bezier
    }

    onUpdateEdge(selectedEdge.id, {
      type,
      data: { ...edgeData, pathStyle },
    });
  };

  // Actualizar etiqueta
  const handleLabelChange = (label: string) => {
    onUpdateEdge(selectedEdge.id, {
      label: label || undefined,
      data: { ...edgeData, label },
    });
  };

  return (
    <aside className="w-80 bg-surface border-l border-foreground/10 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-foreground/10 flex items-center justify-between">
        <h3
          className="font-semibold text-foreground"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Estilo de Conexión
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Preview */}
        <div className="p-4 bg-background/50 rounded-xl border border-foreground/10">
          <svg width="100%" height="40" className="overflow-visible">
            <defs>
              <marker
                id="preview-arrow-end"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={currentColor} />
              </marker>
              <marker
                id="preview-arrow-start"
                markerWidth="10"
                markerHeight="10"
                refX="1"
                refY="5"
                orient="auto-start-reverse"
              >
                <path d="M10,0 L0,5 L10,10 z" fill={currentColor} />
              </marker>
            </defs>
            <line
              x1="30"
              y1="20"
              x2="220"
              y2="20"
              stroke={currentColor}
              strokeWidth="3"
              strokeDasharray={lineStyles.find(s => s.value === currentLineStyle)?.dasharray}
              strokeLinecap="round"
              markerStart={currentArrowStyle === 'backward' || currentArrowStyle === 'both' ? 'url(#preview-arrow-start)' : undefined}
              markerEnd={currentArrowStyle === 'forward' || currentArrowStyle === 'both' ? 'url(#preview-arrow-end)' : undefined}
            />
          </svg>
        </div>

        {/* Color */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Color</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-5 gap-2">
              {edgeColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`
                    w-9 h-9 rounded-lg border-2 transition-all
                    ${currentColor === color.value
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-transparent hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
            {/* Color picker personalizado */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={customColor.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setCustomColor(val);
                    if (val.length === 7) handleColorChange(val);
                  }
                }}
                className="w-20 px-2 py-1.5 bg-background border border-foreground/20 rounded-lg
                           text-xs text-foreground font-mono
                           focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="#BB86FC"
              />
            </div>
          </div>
        </div>

        {/* Estilo de línea */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Estilo de Trazo</label>
          <div className="flex gap-2">
            {lineStyles.map((style) => (
              <StyleButton
                key={style.value}
                active={currentLineStyle === style.value}
                onClick={() => handleLineStyleChange(style.value)}
                title={style.value}
              >
                <svg width="24" height="4" className="overflow-visible">
                  <line
                    x1="0"
                    y1="2"
                    x2="24"
                    y2="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={style.dasharray}
                    strokeLinecap="round"
                  />
                </svg>
              </StyleButton>
            ))}
          </div>
        </div>

        {/* Estilo de flecha */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Estilo de Flecha</label>
          <div className="flex gap-2">
            {arrowStyles.map((arrow) => (
              <StyleButton
                key={arrow.value}
                active={currentArrowStyle === arrow.value}
                onClick={() => handleArrowStyleChange(arrow.value)}
                title={arrow.label}
              >
                {arrow.value === 'backward' && (
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                    <path d="M6 0L0 6L6 12V7H16V5H6V0Z" />
                  </svg>
                )}
                {arrow.value === 'none' && (
                  <svg width="16" height="4" viewBox="0 0 16 4" stroke="currentColor" strokeWidth="2">
                    <line x1="0" y1="2" x2="16" y2="2" />
                  </svg>
                )}
                {arrow.value === 'forward' && (
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                    <path d="M10 0L16 6L10 12V7H0V5H10V0Z" />
                  </svg>
                )}
                {arrow.value === 'both' && (
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="currentColor">
                    <path d="M5 0L0 6L5 12V7H15V12L20 6L15 0V5H5V0Z" />
                  </svg>
                )}
              </StyleButton>
            ))}
          </div>
        </div>

        {/* Tipo de camino */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Tipo de Camino</label>
          <div className="flex gap-2">
            {pathStyles.map((path) => (
              <StyleButton
                key={path.value}
                active={currentPathStyle === path.value}
                onClick={() => handlePathStyleChange(path.value)}
                title={path.label}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  {path.value === 'bezier' && (
                    <path d="M2 18 Q 10 2, 18 10" strokeLinecap="round" />
                  )}
                  {path.value === 'straight' && (
                    <line x1="2" y1="18" x2="18" y2="2" strokeLinecap="round" />
                  )}
                  {path.value === 'step' && (
                    <path d="M2 18 L2 10 L18 10 L18 2" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                  {path.value === 'smoothstep' && (
                    <path d="M2 18 L2 14 Q2 10 6 10 L14 10 Q18 10 18 6 L18 2" strokeLinecap="round" />
                  )}
                </svg>
              </StyleButton>
            ))}
          </div>
        </div>

        {/* Etiqueta */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Etiqueta</label>
          <input
            type="text"
            value={edgeData.label || ''}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                       text-foreground placeholder-foreground/40
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Prerrequisito, Siguiente..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-foreground/10">
        <button
          onClick={() => {
            if (confirm('¿Seguro que quieres eliminar esta conexión?')) {
              onDeleteEdge(selectedEdge.id);
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                     bg-red-500/10 border border-red-500/30 rounded-lg
                     text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <TrashIcon />
          <span>Eliminar conexión</span>
        </button>
      </div>
    </aside>
  );
}
