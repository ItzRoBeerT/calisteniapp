import type { Roadmap, RoadmapResource } from '@/types/Roadmap';
import { esc } from '@/utils/print-html';

export type RoadmapPDFLabels = {
  steps: string;
  tips: string;
  resources: string;
  by: string;
};

type LinearNodeData = {
  nodeType?: string;
  label?: string;
  description?: string;
  tips?: string;
  resources?: RoadmapResource[];
  imageUrl?: string;
  alt?: string;
  videoUrl?: string;
};

type LinearNode = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: LinearNodeData;
};

type Step = {
  node: LinearNode;
  children: LinearNode[];
};

// Convierte el grafo del roadmap en una lista ordenada de pasos:
// topics ordenados por posición vertical, con sus subtopics/imágenes/vídeos
// conectados por edge (o por cercanía si no hay edge) como sub-elementos.
export function linearizeRoadmap(roadmap: Roadmap): Step[] {
  const nodes = (roadmap.nodes as unknown as LinearNode[]).filter((n) => n?.data);
  const nodeType = (n: LinearNode) => n.data.nodeType ?? n.type ?? '';

  const topics = nodes
    .filter((n) => nodeType(n) === 'topic')
    .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);

  const attachable = nodes.filter((n) =>
    ['subtopic', 'image', 'video'].includes(nodeType(n))
  );

  const topicIds = new Set(topics.map((t) => t.id));
  const steps: Step[] = topics.map((node) => ({ node, children: [] }));
  const stepByTopicId = new Map(steps.map((s) => [s.node.id, s]));

  for (const child of attachable) {
    // Buscar un edge que lo conecte con un topic (en cualquier dirección)
    let parentId: string | undefined;
    for (const edge of roadmap.edges) {
      if (edge.source === child.id && topicIds.has(edge.target)) parentId = edge.target;
      if (edge.target === child.id && topicIds.has(edge.source)) parentId = edge.source;
      if (parentId) break;
    }

    // Sin edge: asignar al topic más cercano por encima
    if (!parentId && topics.length > 0) {
      const above = topics.filter((t) => t.position.y <= child.position.y + 40);
      const nearest = (above.length > 0 ? above : topics).reduce((best, t) =>
        Math.abs(t.position.y - child.position.y) < Math.abs(best.position.y - child.position.y)
          ? t
          : best
      );
      parentId = nearest.id;
    }

    if (parentId) {
      stepByTopicId.get(parentId)?.children.push(child);
    }
  }

  for (const step of steps) {
    step.children.sort((a, b) => a.position.y - b.position.y);
  }

  return steps;
}

function resourcesHTML(resources: RoadmapResource[] | undefined, label: string): string {
  if (!resources || resources.length === 0) return '';
  const items = resources
    .map(
      (r) =>
        `<li><span class="res-type">${esc(r.type)}</span> ${esc(r.title)}${
          r.url ? ` — <span class="res-url">${esc(r.url)}</span>` : ''
        }</li>`
    )
    .join('');
  return `<div class="resources"><span class="box-label">${esc(label)}</span><ul>${items}</ul></div>`;
}

function childHTML(child: LinearNode, labels: RoadmapPDFLabels): string {
  const type = child.data.nodeType ?? child.type ?? '';
  if (type === 'image' && child.data.imageUrl) {
    return `<div class="sub sub-image"><img src="${esc(child.data.imageUrl)}" alt="${esc(
      child.data.alt ?? child.data.label ?? ''
    )}" /></div>`;
  }
  if (type === 'video' && child.data.videoUrl) {
    return `<div class="sub"><span class="sub-label">▶ ${esc(
      child.data.label ?? 'Video'
    )}</span><span class="res-url"> — ${esc(child.data.videoUrl)}</span></div>`;
  }
  return `<div class="sub">
    <span class="sub-label">${esc(child.data.label ?? '')}</span>
    ${child.data.description ? `<p class="sub-desc">${esc(child.data.description)}</p>` : ''}
    ${child.data.tips ? `<p class="sub-desc">💡 ${esc(child.data.tips)}</p>` : ''}
  </div>`;
}

export function generateRoadmapHTML(
  roadmap: Roadmap,
  locale: string,
  labels: RoadmapPDFLabels
): string {
  const steps = linearizeRoadmap(roadmap);
  const date = new Date(roadmap.updatedAt ?? Date.now()).toLocaleDateString(locale);

  const stepsHTML = steps
    .map(
      (step, i) => `
    <div class="step">
      <div class="step-header">
        <span class="step-number">${i + 1}</span>
        <h3>${esc(step.node.data.label ?? '')}</h3>
      </div>
      ${step.node.data.description ? `<p class="step-desc">${esc(step.node.data.description)}</p>` : ''}
      ${step.node.data.tips ? `<div class="tips"><span class="box-label">💡 ${esc(labels.tips)}</span><p>${esc(step.node.data.tips)}</p></div>` : ''}
      ${resourcesHTML(step.node.data.resources, labels.resources)}
      ${step.children.map((c) => childHTML(c, labels)).join('')}
    </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${esc(locale)}">
<head>
  <meta charset="UTF-8" />
  <title>${esc(roadmap.title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #1a1a2e;
      padding: 40px 48px;
      max-width: 800px;
      margin: 0 auto;
    }
    .cover { border-bottom: 3px solid #7e4ab2; padding-bottom: 20px; margin-bottom: 28px; }
    h1 { font-size: 30px; font-weight: 800; color: #4a2f6d; }
    .cover .meta { color: #888; font-size: 13px; margin-top: 8px; }
    .cover .description { color: #555; font-size: 14px; line-height: 1.5; margin-top: 10px; }
    h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #7e4ab2; margin-bottom: 16px; }
    .step { border-left: 3px solid #c4b5fd; padding: 0 0 18px 20px; margin-left: 14px; position: relative; }
    .step:last-child { border-left-color: transparent; }
    .step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .step-number {
      position: absolute; left: -15px; width: 28px; height: 28px; border-radius: 50%;
      background: #7e4ab2; color: #fff; font-weight: 700; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
    }
    .step-header h3 { font-size: 17px; font-weight: 700; margin-left: 18px; }
    .step-desc { font-size: 13.5px; color: #444; line-height: 1.55; margin: 4px 0 8px 18px; }
    .box-label { font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .tips {
      margin: 8px 0 8px 18px; padding: 8px 12px; background: #f5f3ff;
      border-radius: 8px; font-size: 12.5px; color: #4c3575; line-height: 1.5;
    }
    .tips .box-label { color: #7e4ab2; display: block; margin-bottom: 2px; }
    .resources { margin: 8px 0 8px 18px; font-size: 12.5px; }
    .resources .box-label { color: #166534; }
    .resources ul { margin: 4px 0 0 16px; }
    .res-type { font-size: 10px; text-transform: uppercase; background: #f0fdf4; color: #166534; border-radius: 4px; padding: 1px 6px; }
    .res-url { color: #6366f1; word-break: break-all; }
    .sub {
      margin: 8px 0 0 18px; padding: 8px 12px; background: #fafafa;
      border: 1px solid #eee; border-radius: 8px; font-size: 12.5px;
    }
    .sub-label { font-weight: 600; }
    .sub-desc { color: #555; margin-top: 3px; line-height: 1.5; }
    .sub-image img { max-width: 100%; max-height: 260px; border-radius: 6px; }
    .step, .tips, .sub { break-inside: avoid; }
    .footer { margin-top: 36px; font-size: 11px; color: #aaa; text-align: center; }
    @media print {
      @page { margin: 0; }
      body { padding: 1.5cm 2cm; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${esc(roadmap.title)}</h1>
    <div class="meta">${roadmap.author ? `${esc(labels.by)} ${esc(roadmap.author)} · ` : ''}${esc(date)}</div>
    ${roadmap.description ? `<p class="description">${esc(roadmap.description)}</p>` : ''}
  </div>
  <h2>${esc(labels.steps)}</h2>
  ${stepsHTML}
  <div class="footer">OpenCalisthenics — ${esc(date)}</div>
</body>
</html>`;
}
