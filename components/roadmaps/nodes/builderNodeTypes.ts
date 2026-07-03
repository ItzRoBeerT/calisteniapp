import TitleNode from './text/TitleNode';
import TopicNode from './content/TopicNode';
import SubTopicNode from './content/SubTopicNode';
import ImageNode from './content/ImageNode';
import VideoNode from './content/VideoNode';
import SectionNode from './container/SectionNode';

// Registro de todos los tipos de nodos para el Builder
// Todos usan modo 'builder' (con handles visibles, resizer, etc.)
export const builderNodeTypes = {
  // Texto
  title: TitleNode,
  // Contenido
  topic: TopicNode,
  subtopic: SubTopicNode,
  image: ImageNode,
  video: VideoNode,
  // Contenedor
  section: SectionNode,
};

export type BuilderNodeType = keyof typeof builderNodeTypes;
