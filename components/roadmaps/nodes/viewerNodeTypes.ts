import TitleNode from './text/TitleNode';
import ParagraphNode from './text/ParagraphNode';
import LabelNode from './text/LabelNode';
import TopicNode from './content/TopicNode';
import SubTopicNode from './content/SubTopicNode';
import ImageNode from './content/ImageNode';
import VideoNode from './content/VideoNode';
import ButtonNode from './interactive/ButtonNode';
import ResourceButtonNode from './interactive/ResourceButtonNode';
import TodoNode from './interactive/TodoNode';
import ChecklistNode from './interactive/ChecklistNode';
import LegendNode from './lists/LegendNode';
import LinksGroupNode from './lists/LinksGroupNode';
import HorizontalLineNode from './decorative/HorizontalLineNode';
import VerticalLineNode from './decorative/VerticalLineNode';
import SectionNode from './container/SectionNode';

// Registro de todos los tipos de nodos para el Viewer
// Todos usan modo 'viewer' (sin handles visibles, sin resizer, con interacciones de usuario)
export const viewerNodeTypes = {
  // Texto
  title: TitleNode,
  paragraph: ParagraphNode,
  label: LabelNode,
  // Contenido
  topic: TopicNode,
  subtopic: SubTopicNode,
  image: ImageNode,
  video: VideoNode,
  // Interactivos
  button: ButtonNode,
  resourceButton: ResourceButtonNode,
  todo: TodoNode,
  checklist: ChecklistNode,
  // Listas
  legend: LegendNode,
  linksGroup: LinksGroupNode,
  // Decorativos
  horizontalLine: HorizontalLineNode,
  verticalLine: VerticalLineNode,
  // Contenedor
  section: SectionNode,
};

export type ViewerNodeType = keyof typeof viewerNodeTypes;
