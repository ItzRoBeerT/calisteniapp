'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { NodeProgress } from '@/types/Roadmap';

type ProgressState = Record<string, NodeProgress>;

interface UseRoadmapProgressReturn {
  progress: ProgressState;
  updateNodeProgress: (nodeId: string, status: NodeProgress) => void;
  completedCount: number;
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

  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar progreso desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProgress(parsed);
        }
      } catch (error) {
        console.error('Error loading roadmap progress:', error);
      }
      setIsLoaded(true);
    }
  }, [storageKey]);

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
  const { completedCount, completionPercentage } = useMemo(() => {
    const completed = Object.values(progress).filter((status) => status === 'completed').length;
    const total = totalNodes > 0 ? totalNodes : Math.max(Object.keys(progress).length, 1);
    const percentage = Math.round((completed / total) * 100);

    return {
      completedCount: completed,
      completionPercentage: Math.min(percentage, 100),
    };
  }, [progress, totalNodes]);

  return {
    progress,
    updateNodeProgress,
    completedCount,
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
