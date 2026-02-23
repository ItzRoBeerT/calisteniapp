'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { NodeProgress } from '@/types/Roadmap';

type ProgressState = Record<string, NodeProgress>;

interface UseRoadmapProgressReturn {
  progress: ProgressState;
  updateNodeProgress: (nodeId: string, status: NodeProgress) => void;
  completedCount: number;
  inProgressCount: number;
  completionPercentage: number;
  isLoaded: boolean;
  resetProgress: () => void;
}

/**
 * Hook para manejar el progreso de un roadmap
 * Persiste el estado en localStorage
 */
export function useRoadmapProgress(
  roadmapId: string,
  totalNodes: number = 0
): UseRoadmapProgressReturn {
  const storageKey = `roadmap-progress-${roadmapId}`;

  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as ProgressState) : {};
    } catch {
      return {};
    }
  });
  const [isLoaded] = useState(true);

  // Guardar en localStorage cuando cambia el progreso
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch (error) {
        console.error('Error saving roadmap progress:', error);
      }
    }
  }, [progress, storageKey, isLoaded]);

  // Actualizar el progreso de un nodo específico
  const updateNodeProgress = useCallback((nodeId: string, status: NodeProgress) => {
    setProgress((prev) => ({
      ...prev,
      [nodeId]: status,
    }));
  }, []);

  // Resetear todo el progreso
  const resetProgress = useCallback(() => {
    setProgress({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  // Calcular estadísticas de progreso
  const { completedCount, inProgressCount, completionPercentage } = useMemo(() => {
    const completed = Object.values(progress).filter((status) => status === 'completed').length;
    const inProgress = Object.values(progress).filter((status) => status === 'in_progress').length;
    const total = totalNodes > 0 ? totalNodes : Math.max(Object.keys(progress).length, 1);
    const percentage = Math.round((completed / total) * 100);

    return {
      completedCount: completed,
      inProgressCount: inProgress,
      completionPercentage: Math.min(percentage, 100),
    };
  }, [progress, totalNodes]);

  return {
    progress,
    updateNodeProgress,
    completedCount,
    inProgressCount,
    completionPercentage,
    isLoaded,
    resetProgress,
  };
}

/**
 * Hook para sincronizar el progreso del roadmap con los nodos
 * Útil para actualizar el estado visual de los nodos
 */
export function useNodeProgressSync(
  progress: ProgressState,
  nodeId: string
): NodeProgress {
  return progress[nodeId] || 'not_started';
}
