import type { Node } from 'reactflow';
import type { CalistenicsIconType } from '@/components/roadmaps/CalistenicsIcons';
import type { RoadmapResource, NodeProgress } from './Roadmap';

// ============================================
// TIPOS DE NODO
// ============================================

export type RoadmapNodeType =
  | 'title'
  | 'topic'
  | 'subtopic'
  | 'image'
  | 'video'
  | 'section';

export type RoadmapNodeCategory = 'text' | 'content' | 'container';

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
  tips?: string;
  resources?: RoadmapResource[];
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
  | TopicNodeData
  | SubTopicNodeData
  | ImageNodeData
  | VideoNodeData
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

export function isTextNode(data: AnyNodeData): data is TitleNodeData {
  return data.nodeType === 'title';
}

export function isContentNode(
  data: AnyNodeData
): data is TopicNodeData | SubTopicNodeData | ImageNodeData | VideoNodeData {
  return ['topic', 'subtopic', 'image', 'video'].includes(data.nodeType);
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
  text: { label: 'Texto', description: 'Títulos' },
  content: { label: 'Contenido', description: 'Temas, subtemas, imágenes y videos' },
  container: { label: 'Contenedores', description: 'Secciones para agrupar' },
};

// ============================================
// MAPEO TIPO -> CATEGORÍA
// ============================================

export const nodeTypeToCategory: Record<RoadmapNodeType, RoadmapNodeCategory> = {
  title: 'text',
  topic: 'content',
  subtopic: 'content',
  image: 'content',
  video: 'content',
  section: 'container',
};

// ============================================
// NORMALIZACIÓN DE TIPOS LEGACY
// ============================================

// Tipos eliminados del builder o de versiones anteriores del roadmap.
// Los roadmaps guardados con esos tipos degradan al tipo core más cercano;
// los decorativos (líneas) se descartan.
const legacyTypeMap: Record<string, RoadmapNodeType | null> = {
  milestone: 'topic',
  default: 'topic',
  paragraph: 'title',
  label: 'title',
  button: 'subtopic',
  resourceButton: 'subtopic',
  todo: 'subtopic',
  checklist: 'subtopic',
  legend: 'subtopic',
  linksGroup: 'subtopic',
  horizontalLine: null,
  verticalLine: null,
};

const coreNodeTypes: RoadmapNodeType[] = ['title', 'topic', 'subtopic', 'image', 'video', 'section'];

// Devuelve el tipo core equivalente, o null si el nodo debe descartarse
export function normalizeNodeType(type: string | undefined): RoadmapNodeType | null {
  if (type && (coreNodeTypes as string[]).includes(type)) {
    return type as RoadmapNodeType;
  }
  if (type && type in legacyTypeMap) {
    return legacyTypeMap[type];
  }
  return 'topic';
}
