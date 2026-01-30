'use client';

import React from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, ImageNodeData } from '@/types/RoadmapNodes';
import BaseConfigPanel, { ConfigInput, ConfigSelect } from './BaseConfigPanel';

interface ImageConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const ImageConfigPanel: React.FC<ImageConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as ImageNodeData;

  const handleUpdate = (updates: Partial<ImageNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title="Imagen"
      tabs={[{ id: 'image', label: 'Imagen' }]}
    >
      {/* Tab de Imagen */}
      <div data-tab="image" className="space-y-4">
        {/* URL de la imagen */}
        <ConfigInput
          label="URL de la imagen"
          value={data.imageUrl}
          onChange={(v) => handleUpdate({ imageUrl: v })}
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
        />

        {/* Preview de imagen */}
        {data.imageUrl && (
          <div className="rounded-lg overflow-hidden border border-foreground/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt={data.alt || 'Preview'}
              className="w-full h-32 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="50" font-size="12" text-anchor="middle" fill="%23666">Error</text></svg>';
              }}
            />
          </div>
        )}

        {/* URL de enlace */}
        <ConfigInput
          label="URL de enlace (opcional)"
          value={data.linkUrl}
          onChange={(v) => handleUpdate({ linkUrl: v })}
          type="url"
          placeholder="https://ejemplo.com"
        />

        {/* Texto alternativo */}
        <ConfigInput
          label="Texto alternativo"
          value={data.alt}
          onChange={(v) => handleUpdate({ alt: v })}
          placeholder="Descripción de la imagen"
        />

        {/* Object fit */}
        <ConfigSelect
          label="Ajuste de imagen"
          value={data.objectFit || 'cover'}
          onChange={(v) => handleUpdate({ objectFit: v as ImageNodeData['objectFit'] })}
          options={[
            { value: 'cover', label: 'Cubrir (recorta)' },
            { value: 'contain', label: 'Contener (completa)' },
            { value: 'fill', label: 'Estirar' },
          ]}
        />

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
    </BaseConfigPanel>
  );
};

export default ImageConfigPanel;
