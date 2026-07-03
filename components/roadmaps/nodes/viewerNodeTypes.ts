import TitleNode from './text/TitleNode';
import TopicNode from './content/TopicNode';
import SubTopicNode from './content/SubTopicNode';
import ImageNode from './content/ImageNode';
import VideoNode from './content/VideoNode';
import SectionNode from './container/SectionNode';

// Registro de todos los tipos de nodos para el Viewer
// Todos usan modo 'viewer' (sin handles visibles, sin resizer, con interacciones de usuario)
export const viewerNodeTypes = {
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

export type ViewerNodeType = keyof typeof viewerNodeTypes;
