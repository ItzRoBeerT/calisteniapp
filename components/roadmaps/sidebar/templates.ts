import type { NodeTemplate, RoadmapNodeCategory } from '@/types/RoadmapNodes';

// Categorías de templates
export const templateCategories: Array<{
  id: RoadmapNodeCategory;
  label: string;
  collapsed: boolean;
}> = [
  { id: 'text', label: 'Texto', collapsed: false },
  { id: 'content', label: 'Contenido', collapsed: false },
  { id: 'container', label: 'Contenedores', collapsed: false },
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
