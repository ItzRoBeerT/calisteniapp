import type { Node } from 'reactflow';
import type { CalistenicsIconType } from '@/components/roadmaps/CalistenicsIcons';
import type { RoadmapResource, NodeProgress } from './Roadmap';

// ============================================
// TIPOS DE NODO
// ============================================

export type RoadmapNodeType =
  | 'title'
  | 'paragraph'
  | 'label'
  | 'topic'
  | 'subtopic'
  | 'image'
  | 'video'
  | 'button'
  | 'resourceButton'
  | 'todo'
  | 'checklist'
  | 'legend'
  | 'linksGroup'
  | 'horizontalLine'
  | 'verticalLine'
  | 'section';

export type RoadmapNodeCategory =
  | 'text'
  | 'content'
  | 'interactive'
  | 'list'
  | 'decorative'
  | 'container';

// ============================================
// TIPO BASE - PADRE DE TODOS LOS NODOS
// ============================================

export interface BaseNodeData {
  nodeType: RoadmapNodeType;
  label: string;
  // Tamaño
  width?: number;
  height?: number;
  // Handles de conexión
  handles?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  // Callbacks
  onSelect?: () => void;
  selected?: boolean;
  // Modo: builder permite editar, viewer solo muestra
  mode?: 'builder' | 'viewer';
}

// ============================================
// NODOS DE TEXTO
// ============================================

export interface TitleNodeData extends BaseNodeData {
  nodeType: 'title';
  fontSize?: number; // Default: 32
  fontWeight?: number; // Default: 700
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface ParagraphNodeData extends BaseNodeData {
  nodeType: 'paragraph';
  fontSize?: number; // Default: 14
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number; // Default: 1.5
}

export interface LabelNodeData extends BaseNodeData {
  nodeType: 'label';
  fontSize?: number; // Default: 12
  color?: string;
  backgroundColor?: string;
  padding?: number;
}

// ============================================
// NODOS DE CONTENIDO
// ============================================

export interface TopicNodeData extends BaseNodeData {
  nodeType: 'topic';
  icon?: CalistenicsIconType;
  color: string; // Background color
  description?: string;
  tips?: string;
  resources?: RoadmapResource[];
  progress?: NodeProgress;
}

export interface SubTopicNodeData extends BaseNodeData {
  nodeType: 'subtopic';
  icon?: CalistenicsIconType;
  color: string; // Lighter/softer variant
  description?: string;
  progress?: NodeProgress;
}

export interface ImageNodeData extends BaseNodeData {
  nodeType: 'image';
  imageUrl: string;
  linkUrl?: string; // Optional click destination
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
}

export interface VideoNodeData extends BaseNodeData {
  nodeType: 'video';
  videoUrl: string;
  videoType?: 'youtube' | 'vimeo' | 'direct';
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  borderRadius?: number;
}

// ============================================
// NODOS INTERACTIVOS
// ============================================

export interface ButtonNodeData extends BaseNodeData {
  nodeType: 'button';
  url: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: CalistenicsIconType;
  variant?: 'solid' | 'outline' | 'ghost';
}

export interface ResourceButtonNodeData extends BaseNodeData {
  nodeType: 'resourceButton';
  url: string;
  badgeText?: string;
  badgeTextColor?: string;
  badgeBackgroundColor?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: CalistenicsIconType;
}

export interface TodoNodeData extends BaseNodeData {
  nodeType: 'todo';
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ChecklistNodeData extends BaseNodeData {
  nodeType: 'checklist';
  items: ChecklistItem[];
  onItemChange?: (itemId: string, checked: boolean) => void;
}

// ============================================
// NODOS DE LISTA
// ============================================

export interface LegendItem {
  id: string;
  icon: CalistenicsIconType;
  label: string;
  color?: string;
}

export interface LegendNodeData extends BaseNodeData {
  nodeType: 'legend';
  items: LegendItem[];
  orientation?: 'vertical' | 'horizontal';
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon?: CalistenicsIconType;
}

export interface LinksGroupNodeData extends BaseNodeData {
  nodeType: 'linksGroup';
  items: LinkItem[];
}

// ============================================
// NODOS DECORATIVOS
// ============================================

export interface HorizontalLineNodeData extends BaseNodeData {
  nodeType: 'horizontalLine';
  color?: string;
  thickness?: number; // Default: 2
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface VerticalLineNodeData extends BaseNodeData {
  nodeType: 'verticalLine';
  color?: string;
  thickness?: number; // Default: 2
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

// ============================================
// NODOS CONTENEDOR
// ============================================

export interface SectionNodeData extends BaseNodeData {
  nodeType: 'section';
  backgroundColor?: string;
  borderColor?: string;
  padding?: number;
  // Note: ReactFlow handles parentId/extent on Node level, not data
}

// ============================================
// UNIÓN DISCRIMINADA DE TODOS LOS TIPOS
// ============================================

export type AnyNodeData =
  | TitleNodeData
  | ParagraphNodeData
  | LabelNodeData
  | TopicNodeData
  | SubTopicNodeData
  | ImageNodeData
  | VideoNodeData
  | ButtonNodeData
  | ResourceButtonNodeData
  | TodoNodeData
  | ChecklistNodeData
  | LegendNodeData
  | LinksGroupNodeData
  | HorizontalLineNodeData
  | VerticalLineNodeData
  | SectionNodeData;

// ============================================
// TIPO DE NODO REACTFLOW CON DATOS
// ============================================

export type TypedRoadmapNode = Node<AnyNodeData>;

// ============================================
// TEMPLATE PARA SIDEBAR
// ============================================

export interface NodeTemplate {
  type: RoadmapNodeType;
  category: RoadmapNodeCategory;
  label: string;
  description: string;
  icon: CalistenicsIconType;
  previewColor: string;
  defaultData: Partial<AnyNodeData>;
  defaultSize: { width: number; height: number };
}

// ============================================
// TYPE GUARDS
// ============================================

export function isTextNode(
  data: AnyNodeData
): data is TitleNodeData | ParagraphNodeData | LabelNodeData {
  return ['title', 'paragraph', 'label'].includes(data.nodeType);
}

export function isContentNode(
  data: AnyNodeData
): data is TopicNodeData | SubTopicNodeData | ImageNodeData | VideoNodeData {
  return ['topic', 'subtopic', 'image', 'video'].includes(data.nodeType);
}

export function isInteractiveNode(
  data: AnyNodeData
): data is ButtonNodeData | ResourceButtonNodeData | TodoNodeData | ChecklistNodeData {
  return ['button', 'resourceButton', 'todo', 'checklist'].includes(data.nodeType);
}

export function isListNode(data: AnyNodeData): data is LegendNodeData | LinksGroupNodeData {
  return ['legend', 'linksGroup'].includes(data.nodeType);
}

export function isDecorativeNode(
  data: AnyNodeData
): data is HorizontalLineNodeData | VerticalLineNodeData {
  return ['horizontalLine', 'verticalLine'].includes(data.nodeType);
}

export function isSectionNode(data: AnyNodeData): data is SectionNodeData {
  return data.nodeType === 'section';
}

// ============================================
// CONFIGURACIÓN DE CATEGORÍAS
// ============================================

export const nodeCategories: Record<
  RoadmapNodeCategory,
  { label: string; description: string }
> = {
  text: { label: 'Texto', description: 'Títulos, párrafos y etiquetas' },
  content: { label: 'Contenido', description: 'Temas, subtemas e imágenes' },
  interactive: { label: 'Interactivos', description: 'Botones, checkboxes y tareas' },
  list: { label: 'Listas', description: 'Leyendas y grupos de enlaces' },
  decorative: { label: 'Decorativos', description: 'Líneas divisorias' },
  container: { label: 'Contenedores', description: 'Secciones para agrupar' },
};

// ============================================
// MAPEO TIPO -> CATEGORÍA
// ============================================

export const nodeTypeToCategory: Record<RoadmapNodeType, RoadmapNodeCategory> = {
  title: 'text',
  paragraph: 'text',
  label: 'text',
  topic: 'content',
  subtopic: 'content',
  image: 'content',
  video: 'content',
  button: 'interactive',
  resourceButton: 'interactive',
  todo: 'interactive',
  checklist: 'interactive',
  legend: 'list',
  linksGroup: 'list',
  horizontalLine: 'decorative',
  verticalLine: 'decorative',
  section: 'container',
};
