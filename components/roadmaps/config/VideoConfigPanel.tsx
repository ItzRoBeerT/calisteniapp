'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, VideoNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigSelect, ConfigCheckbox } from './BaseConfigPanel';

interface VideoConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const VideoConfigPanel: React.FC<VideoConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as VideoNodeData;

  const handleUpdate = (updates: Partial<VideoNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  // Detectar tipo de video automáticamente
  const detectVideoType = (url: string): VideoNodeData['videoType'] => {
    if (!url) return 'direct';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'direct';
  };

  const handleUrlChange = (url: string) => {
    const detectedType = detectVideoType(url);
    handleUpdate({ videoUrl: url, videoType: detectedType });
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title="Video"
      tabs={[{ id: 'video', label: 'Video' }, { id: 'options', label: 'Opciones' }]}
    >
      {/* Tab de Video */}
      <div data-tab="video" className="space-y-4">
        {/* URL del video */}
        <ConfigInput
          label="URL del video"
          value={data.videoUrl}
          onChange={handleUrlChange}
          type="url"
          placeholder="https://youtube.com/watch?v=... o URL directa"
        />

        {/* Tipo de video (auto-detectado) */}
        <ConfigSelect
          label="Tipo de video"
          value={data.videoType || 'direct'}
          onChange={(v) => handleUpdate({ videoType: v as VideoNodeData['videoType'] })}
          options={[
            { value: 'youtube', label: 'YouTube' },
            { value: 'vimeo', label: 'Vimeo' },
            { value: 'direct', label: 'Video directo (MP4, WebM)' },
          ]}
        />

        {/* Preview */}
        {data.videoUrl && (
          <div className="rounded-lg overflow-hidden border border-foreground/20 bg-black/20">
            <div className="aspect-video flex items-center justify-center">
              {data.videoType === 'youtube' || data.videoType === 'vimeo' ? (
                <div className="text-foreground/50 text-sm text-center p-4">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vista previa en el canvas
                </div>
              ) : (
                <video
                  src={data.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  muted
                />
              )}
            </div>
          </div>
        )}

        {/* Border radius */}
        <ConfigInput
          label="Radio de borde"
          value={data.borderRadius}
          onChange={(v) => handleUpdate({ borderRadius: parseInt(v) || undefined })}
          type="number"
          placeholder="8"
          min={0}
          max={50}
        />
      </div>

      {/* Tab de Opciones */}
      <div data-tab="options" className="space-y-4">
        <ConfigCheckbox
          label="Reproducción automática"
          checked={data.autoplay || false}
          onChange={(checked) => handleUpdate({ autoplay: checked })}
        />

        <ConfigCheckbox
          label="Silenciado"
          checked={data.muted || false}
          onChange={(checked) => handleUpdate({ muted: checked })}
        />

        <ConfigCheckbox
          label="Reproducir en bucle"
          checked={data.loop || false}
          onChange={(checked) => handleUpdate({ loop: checked })}
        />

        {data.videoType === 'direct' && (
          <ConfigCheckbox
            label="Mostrar controles"
            checked={data.controls !== false}
            onChange={(checked) => handleUpdate({ controls: checked })}
          />
        )}

        <div className="p-3 bg-foreground/5 rounded-lg text-xs text-foreground/60">
          <p className="font-medium mb-1">Formatos soportados:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>YouTube (youtube.com, youtu.be)</li>
            <li>Vimeo (vimeo.com)</li>
            <li>Video directo (MP4, WebM, OGG)</li>
          </ul>
        </div>
      </div>
    </BaseConfigPanel>
  );
};

export default VideoConfigPanel;
