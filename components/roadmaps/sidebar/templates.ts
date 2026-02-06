import type { NodeTemplate, RoadmapNodeCategory } from '@/types/RoadmapNodes';

// Categorías de templates
export const templateCategories: Array<{
  id: RoadmapNodeCategory;
  label: string;
  collapsed: boolean;
}> = [
  { id: 'text', label: 'Texto', collapsed: false },
  { id: 'content', label: 'Contenido', collapsed: false },
  { id: 'interactive', label: 'Interactivos', collapsed: true },
  { id: 'list', label: 'Listas', collapsed: true },
  { id: 'decorative', label: 'Decorativos', collapsed: true },
  { id: 'container', label: 'Contenedores', collapsed: true },
];

// Todos los templates de nodos
export const nodeTemplates: NodeTemplate[] = [
  // ============================================
  // TEXTO
  // ============================================
  {
    type: 'title',
    category: 'text',
    label: 'Título',
    description: 'Encabezado grande sin fondo',
    icon: 'none',
    previewColor: '#BB86FC',
    defaultData: {
      nodeType: 'title',
      label: 'Título',
      fontSize: 32,
      fontWeight: 700,
      textAlign: 'center',
      handles: { top: true, bottom: true, left: false, right: false },
    },
    defaultSize: { width: 200, height: 50 },
  },
  {
    type: 'paragraph',
    category: 'text',
    label: 'Párrafo',
    description: 'Texto multilínea',
    icon: 'none',
    previewColor: '#BB86FC',
    defaultData: {
      nodeType: 'paragraph',
      label: 'Escribe tu texto aquí...',
      fontSize: 14,
      textAlign: 'left',
      handles: { top: true, bottom: true, left: false, right: false },
    },
    defaultSize: { width: 200, height: 80 },
  },
  {
    type: 'label',
    category: 'text',
    label: 'Etiqueta',
    description: 'Texto corto horizontal',
    icon: 'none',
    previewColor: '#64748b',
    defaultData: {
      nodeType: 'label',
      label: 'Etiqueta',
      fontSize: 12,
      handles: { top: false, bottom: false, left: true, right: true },
    },
    defaultSize: { width: 100, height: 28 },
  },

  // ============================================
  // CONTENIDO
  // ============================================
  {
    type: 'topic',
    category: 'content',
    label: 'Tema',
    description: 'Nodo principal con contenido',
    icon: 'start',
    previewColor: '#BB86FC',
    defaultData: {
      nodeType: 'topic',
      label: 'Nuevo Tema',
      color: '#BB86FC',
      icon: 'none',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 160, height: 60 },
  },
  {
    type: 'subtopic',
    category: 'content',
    label: 'Subtema',
    description: 'Variante suave del tema',
    icon: 'none',
    previewColor: '#9A64D6',
    defaultData: {
      nodeType: 'subtopic',
      label: 'Subtema',
      color: '#9A64D6',
      icon: 'none',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 140, height: 50 },
  },
  {
    type: 'image',
    category: 'content',
    label: 'Imagen',
    description: 'Imagen con enlace opcional',
    icon: 'none',
    previewColor: '#64748b',
    defaultData: {
      nodeType: 'image',
      label: 'Imagen',
      imageUrl: '',
      objectFit: 'cover',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 200, height: 150 },
  },
  {
    type: 'video',
    category: 'content',
    label: 'Video',
    description: 'Video de YouTube, Vimeo o directo',
    icon: 'none',
    previewColor: '#FF3B30',
    defaultData: {
      nodeType: 'video',
      label: 'Video',
      videoUrl: '',
      videoType: 'youtube',
      controls: true,
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 320, height: 180 },
  },

  // ============================================
  // INTERACTIVOS
  // ============================================
  {
    type: 'button',
    category: 'interactive',
    label: 'Botón',
    description: 'Enlace clickeable',
    icon: 'none',
    previewColor: '#BB86FC',
    defaultData: {
      nodeType: 'button',
      label: 'Botón',
      url: '',
      variant: 'solid',
      backgroundColor: '#BB86FC',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 120, height: 40 },
  },
  {
    type: 'resourceButton',
    category: 'interactive',
    label: 'Recurso',
    description: 'Botón con badge',
    icon: 'none',
    previewColor: '#32D74B',
    defaultData: {
      nodeType: 'resourceButton',
      label: 'Recurso',
      url: '',
      badgeText: 'FREE',
      backgroundColor: '#32D74B',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 160, height: 48 },
  },
  {
    type: 'todo',
    category: 'interactive',
    label: 'Tarea',
    description: 'Checkbox con texto',
    icon: 'none',
    previewColor: '#BB86FC',
    defaultData: {
      nodeType: 'todo',
      label: 'Tarea pendiente',
      checked: false,
      handles: { top: false, bottom: false, left: true, right: true },
    },
    defaultSize: { width: 180, height: 40 },
  },
  {
    type: 'checklist',
    category: 'interactive',
    label: 'Checklist',
    description: 'Lista de tareas',
    icon: 'none',
    previewColor: '#BB86FC',
    defaultData: {
      nodeType: 'checklist',
      label: 'Checklist',
      items: [
        { id: '1', text: 'Item 1', checked: false },
        { id: '2', text: 'Item 2', checked: false },
      ],
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 200, height: 120 },
  },

  // ============================================
  // LISTAS
  // ============================================
  {
    type: 'legend',
    category: 'list',
    label: 'Leyenda',
    description: 'Lista con iconos',
    icon: 'none',
    previewColor: '#FF9F0A',
    defaultData: {
      nodeType: 'legend',
      label: 'Leyenda',
      items: [
        { id: '1', icon: 'none', label: 'Item 1', color: '#BB86FC' },
        { id: '2', icon: 'none', label: 'Item 2', color: '#32D74B' },
      ],
      orientation: 'vertical',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 160, height: 100 },
  },
  {
    type: 'linksGroup',
    category: 'list',
    label: 'Enlaces',
    description: 'Lista de URLs',
    icon: 'none',
    previewColor: '#64D2FF',
    defaultData: {
      nodeType: 'linksGroup',
      label: 'Enlaces',
      items: [
        { id: '1', label: 'Enlace 1', url: '' },
        { id: '2', label: 'Enlace 2', url: '' },
      ],
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 180, height: 100 },
  },

  // ============================================
  // DECORATIVOS
  // ============================================
  {
    type: 'horizontalLine',
    category: 'decorative',
    label: 'Línea H',
    description: 'Separador horizontal',
    icon: 'none',
    previewColor: '#8E8E93',
    defaultData: {
      nodeType: 'horizontalLine',
      label: '',
      color: '#8E8E93',
      thickness: 2,
      lineStyle: 'solid',
      handles: { top: false, bottom: false, left: true, right: true },
    },
    defaultSize: { width: 200, height: 10 },
  },
  {
    type: 'verticalLine',
    category: 'decorative',
    label: 'Línea V',
    description: 'Separador vertical',
    icon: 'none',
    previewColor: '#8E8E93',
    defaultData: {
      nodeType: 'verticalLine',
      label: '',
      color: '#8E8E93',
      thickness: 2,
      lineStyle: 'solid',
      handles: { top: true, bottom: true, left: false, right: false },
    },
    defaultSize: { width: 10, height: 200 },
  },

  // ============================================
  // CONTENEDORES
  // ============================================
  {
    type: 'section',
    category: 'container',
    label: 'Sección',
    description: 'Agrupa nodos',
    icon: 'none',
    previewColor: 'rgba(187, 134, 252, 0.3)',
    defaultData: {
      nodeType: 'section',
      label: 'Sección',
      backgroundColor: 'rgba(30, 30, 30, 0.5)',
      borderColor: 'rgba(187, 134, 252, 0.3)',
      handles: { top: true, bottom: true, left: true, right: true },
    },
    defaultSize: { width: 400, height: 300 },
  },
];

// Obtener templates por categoría
export const getTemplatesByCategory = (category: RoadmapNodeCategory): NodeTemplate[] => {
  return nodeTemplates.filter((t) => t.category === category);
};

// Obtener template por tipo
export const getTemplateByType = (type: string): NodeTemplate | undefined => {
  return nodeTemplates.find((t) => t.type === type);
};
