import type { Node, Edge } from 'reactflow';

// Tipos de recursos disponibles
export type ResourceType = 'video' | 'article' | 'documentation' | 'course' | 'tool' | 'github' | 'exercise' | 'workout' | 'post';

// Estados de progreso de un nodo
export type NodeProgress = 'not_started' | 'in_progress' | 'completed' | 'skipped';

// Tipos de nodos en el roadmap
export type RoadmapNodeType = 'title' | 'topic' | 'subtopic' | 'milestone';

// Recurso individual (video, artículo, etc.)
export interface RoadmapResource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  description?: string;
  duration?: string;      // Para videos: "15 min"
  provider?: string;      // YouTube, MDN, Udemy, etc.
  isFree?: boolean;
  localId?: number;       // Para recursos locales: ID del ejercicio o workout
}

// Contenido extendido de un nodo
export interface RoadmapNodeContent {
  title: string;
  description: string;
  tips?: string;
  resources: RoadmapResource[];
  progress: NodeProgress;
  completedAt?: string;
  order?: number;
}

// Datos del nodo para React Flow
export interface RoadmapNodeData {
  // Propiedades visuales
  label: string;
  color?: string;
  fontSize?: number;
  width?: number;
  height?: number;

  // Propiedades de contenido
  content?: RoadmapNodeContent;
  nodeType: RoadmapNodeType;

  // Callbacks y estado
  onSelect?: () => void;
  selected?: boolean;
  progress?: NodeProgress;
}

// Nodo completo de React Flow tipado
export type RoadmapNode = Node<RoadmapNodeData>;

// Edge tipado
export type RoadmapEdge = Edge;

// Roadmap completo
export interface Roadmap {
  id: string;
  title: string;
  description: string;
  author?: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  isPublic: boolean;
  category?: string;
  totalNodes: number;
  completedNodes: number;
  thumbnailUrl?: string;
}

// Progreso del usuario en un roadmap
export interface UserRoadmapProgress {
  roadmapId: string;
  userId: string;
  nodeProgress: Record<string, NodeProgress>;
  startedAt: string;
  lastAccessedAt: string;
  completionPercentage: number;
}

// Props para el componente ViewerNode
export interface ViewerNodeProps {
  data: RoadmapNodeData;
  selected?: boolean;
}

// Props para el panel de detalles
export interface NodeDetailPanelProps {
  node: RoadmapNodeData | null;
  nodeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onProgressChange: (nodeId: string, progress: NodeProgress) => void;
}

// Props para la lista de recursos
export interface NodeResourceListProps {
  resources: RoadmapResource[];
}

// Props para la barra de progreso
export interface RoadmapProgressProps {
  completedNodes: number;
  inProgressNodes: number;
  totalNodes: number;
  percentage: number;
}

// Props para el visor principal
export interface RoadmapViewerProps {
  roadmap: Roadmap;
  isEditable?: boolean;
}

// Configuración de iconos por tipo de recurso
export const resourceTypeConfig: Record<ResourceType, { label: string; color: string }> = {
  video: { label: 'Video', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  article: { label: 'Artículo', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  documentation: { label: 'Documentación', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  course: { label: 'Curso', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  tool: { label: 'Herramienta', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  github: { label: 'GitHub', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
  exercise: { label: 'Ejercicio', color: 'text-primary-400 bg-primary-500/10 border-primary-500/20' },
  workout: { label: 'Rutina', color: 'text-secondary-400 bg-secondary-500/10 border-secondary-500/20' },
  post: { label: 'Post', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
};

// Configuración de colores por estado de progreso
export const progressConfig: Record<NodeProgress, { label: string; color: string; bgColor: string }> = {
  not_started: {
    label: 'Pendiente',
    color: 'text-foreground/50',
    bgColor: 'bg-foreground/5'
  },
  in_progress: {
    label: 'En Progreso',
    color: 'text-primary-400',
    bgColor: 'bg-primary-500/10'
  },
  completed: {
    label: 'Completado',
    color: 'text-secondary-400',
    bgColor: 'bg-secondary-500/10'
  },
  skipped: {
    label: 'Omitido',
    color: 'text-foreground/30',
    bgColor: 'bg-foreground/5'
  },
};
