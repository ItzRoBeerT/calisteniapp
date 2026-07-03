import type { Node, Edge } from 'reactflow';
import { normalizeNodeType } from '@/types/RoadmapNodes';

// Datos mínimos que puede traer un nodo guardado (incluye formatos legacy)
type LooseNodeData = {
  nodeType?: string;
  label?: string;
  color?: string;
  content?: { title?: string };
};

const defaultColorByType: Record<string, string> = {
  topic: '#BB86FC',
  subtopic: '#9A64D6',
};

// Normaliza un grafo guardado al set core de tipos de nodo.
// Los nodos sin equivalente core (líneas decorativas) se descartan
// junto con los edges que los referencian.
export function normalizeRoadmapGraph<N extends Node<LooseNodeData>, E extends Edge>(
  nodes: N[],
  edges: E[]
): { nodes: N[]; edges: E[] } {
  const droppedIds = new Set<string>();

  const normalizedNodes = nodes.flatMap((node) => {
    const coreType = normalizeNodeType(node.type ?? node.data?.nodeType);

    if (coreType === null) {
      droppedIds.add(node.id);
      return [];
    }

    const data = node.data ?? ({} as LooseNodeData);
    const needsColor = coreType === 'topic' || coreType === 'subtopic';

    return [
      {
        ...node,
        type: coreType,
        data: {
          ...data,
          nodeType: coreType,
          label: data.label || data.content?.title || '',
          ...(needsColor && !data.color ? { color: defaultColorByType[coreType] } : {}),
        },
      } as N,
    ];
  });

  const normalizedEdges = edges.filter(
    (edge) => !droppedIds.has(edge.source) && !droppedIds.has(edge.target)
  );

  return { nodes: normalizedNodes, edges: normalizedEdges };
}
