'use client';

import React, { memo, useMemo } from 'react';
import BaseNode from '../BaseNode';
import type { VideoNodeData } from '@/types/RoadmapNodes';

interface VideoNodeProps {
  data: VideoNodeData;
  selected?: boolean;
}

// Extraer ID de YouTube de varias formas de URL
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extraer ID de Vimeo
const extractVimeoId = (url: string): string | null => {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
};

// Detectar tipo de video automáticamente
const detectVideoType = (url: string): VideoNodeData['videoType'] => {
  if (!url) return 'direct';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  return 'direct';
};

const VideoNode: React.FC<VideoNodeProps> = ({ data, selected = false }) => {
  const borderRadius = data.borderRadius || 8;
  const videoType = data.videoType || detectVideoType(data.videoUrl);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onSelect?.();
  };

  // Generar URL de embed según el tipo
  const embedUrl = useMemo(() => {
    if (!data.videoUrl) return null;

    const params = new URLSearchParams();
    if (data.autoplay) params.set('autoplay', '1');
    if (data.muted) params.set('mute', '1');
    if (data.loop) params.set('loop', '1');

    if (videoType === 'youtube') {
      const videoId = extractYouTubeId(data.videoUrl);
      if (!videoId) return null;
      if (data.loop) params.set('playlist', videoId);
      const queryString = params.toString();
      return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
    }

    if (videoType === 'vimeo') {
      const videoId = extractVimeoId(data.videoUrl);
      if (!videoId) return null;
      const queryString = params.toString();
      return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ''}`;
    }

    return data.videoUrl;
  }, [data.videoUrl, data.autoplay, data.muted, data.loop, videoType]);

  const renderVideo = () => {
    if (!data.videoUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-foreground/30">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs">Sin video</span>
        </div>
      );
    }

    if (videoType === 'youtube' || videoType === 'vimeo') {
      return (
        <iframe
          src={embedUrl || ''}
          title={data.label}
          className="w-full h-full"
          style={{ borderRadius }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Video directo
    return (
      <video
        src={data.videoUrl}
        className="w-full h-full object-cover"
        style={{ borderRadius }}
        controls={data.controls !== false}
        autoPlay={data.autoplay}
        muted={data.muted}
        loop={data.loop}
      />
    );
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      minWidth={160}
      minHeight={90}
      className={`
        overflow-hidden transition-all duration-200
        ${selected ? 'ring-2 ring-primary-500/50' : ''}
      `}
      style={{
        borderRadius,
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
      }}
    >
      <div
        onClick={handleClick}
        className="w-full h-full relative"
        style={{ borderRadius }}
      >
        {renderVideo()}

        {/* Label overlay */}
        {data.label && data.videoUrl && (
          <div
            className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 text-white text-xs truncate"
            style={{
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              }}
          >
            {data.label}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default memo(VideoNode);
