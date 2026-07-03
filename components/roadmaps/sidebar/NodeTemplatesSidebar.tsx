'use client';

import React, { useState } from 'react';
import type { NodeTemplate, RoadmapNodeCategory } from '@/types/RoadmapNodes';
import { templateCategories, getTemplatesByCategory } from './templates';
import { useTranslations } from 'next-intl';

interface NodeTemplatesSidebarProps {
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void;
}

// Iconos de categoría
const categoryIcons: Record<RoadmapNodeCategory, React.ReactNode> = {
  text: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h8m-8 6h16" />
    </svg>
  ),
  content: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  interactive: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  ),
  list: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  decorative: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  container: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
};

const NodeTemplatesSidebar: React.FC<NodeTemplatesSidebarProps> = ({ onDragStart }) => {
  const t = useTranslations('RoadmapBuilder');

  // Estado para categorías colapsadas
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      templateCategories.forEach((cat) => {
        initial[cat.id] = cat.collapsed;
      });
      return initial;
    }
  );

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Mapeo de categorías a traducciones
  const categoryLabels: Record<RoadmapNodeCategory, string> = {
    text: t('categories.text'),
    content: t('categories.content'),
    interactive: t('categories.interactive'),
    list: t('categories.list'),
    decorative: t('categories.decorative'),
    container: t('categories.container'),
  };

  // Mapeo de tipos de nodo a traducciones
  const templateLabels: Record<string, string> = {
    title: t('nodeTypes.title'),
    paragraph: t('nodeTypes.paragraph'),
    label: t('nodeTypes.label'),
    topic: t('nodeTypes.topic'),
    subtopic: t('nodeTypes.subtopic'),
    image: t('nodeTypes.image'),
    video: t('nodeTypes.video'),
    button: t('nodeTypes.button'),
    resourceButton: t('nodeTypes.resourceButton'),
    todo: t('nodeTypes.todo'),
    checklist: t('nodeTypes.checklist'),
    legend: t('nodeTypes.legend'),
    linksGroup: t('nodeTypes.linksGroup'),
    horizontalLine: t('nodeTypes.horizontalLine'),
    verticalLine: t('nodeTypes.verticalLine'),
    section: t('nodeTypes.section'),
  };

  // Iconos específicos para cada tipo de template
  const templateIcons: Record<string, string> = {
    title: 'H1',
    paragraph: 'p',
    label: 'L',
    topic: '■',
    subtopic: '□',
    image: '🖼️',
    video: '▶️',
    button: '🔘',
    resourceButton: '↗',
    todo: '✓',
    checklist: '☑',
    legend: '⚖️',
    linksGroup: '🔗',
    horizontalLine: '─',
    verticalLine: '│',
    section: '▢',
  };

  return (
    <div className="flex flex-col h-full">

      {/* Categorías */}
      <div className="flex-1 overflow-y-auto">
        {templateCategories.map((category) => {
          const templates = getTemplatesByCategory(category.id);
          const isCollapsed = collapsedCategories[category.id];

          return (
            <div key={category.id} className="border-b border-foreground/5">
              {/* Header de categoría */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-foreground/5 transition-colors"
              >
                {/* Chevron */}
                <svg
                  className={`w-3 h-3 text-foreground/40 transition-transform ${
                    isCollapsed ? '' : 'rotate-90'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>

                {/* Icono de categoría */}
                <span className="text-primary-400">{categoryIcons[category.id]}</span>

                {/* Label */}
                <span
                  className="flex-1 text-left text-sm text-foreground/80"
                >
                  {categoryLabels[category.id]}
                </span>

                {/* Contador */}
                <span className="text-xs text-foreground/40 bg-foreground/10 px-1.5 py-0.5 rounded">
                  {templates.length}
                </span>
              </button>

              {/* Templates de la categoría */}
              {!isCollapsed && (
                <div className="px-2 pb-2 flex flex-col gap-1">
                  {templates.map((template) => (
                    <div
                      key={template.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, template)}
                      className="group flex items-center gap-3 px-3 py-2
                               hover:bg-foreground/5 rounded-md cursor-grab
                               transition-all duration-150 active:cursor-grabbing"
                    >
                      {/* Icono del template */}
                      <span
                        className="w-6 text-center flex-shrink-0 text-foreground/60 group-hover:text-foreground/80"
                        style={{ fontFamily: "monospace" }}
                      >
                        {templateIcons[template.type] || '•'}
                      </span>

                      {/* Nombre del template */}
                      <span
                        className="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors"
                      >
                        {templateLabels[template.type] || template.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer con instrucción */}
      <div className="px-4 py-3 border-t border-foreground/10 bg-foreground/5">
        <p className="text-xs text-foreground/40 text-center">
          {t('sidebar.dragToAdd')}
        </p>
      </div>
    </div>
  );
};

export default NodeTemplatesSidebar;
