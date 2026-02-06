'use client';

import React, { useState, useEffect } from 'react';
import type { Node } from 'reactflow';
import type { AnyNodeData, TopicNodeData, SubTopicNodeData } from '@/types/RoadmapNodes';
import type { ResourceType, RoadmapResource } from '@/types/Roadmap';
import type { Exercise } from '@/types/supabase';
import type { WorkoutDetail } from '@/types/Workout';
import BaseConfigPanel, {
  ConfigTextarea,
  ConfigColorPicker,
  ConfigSelect,
} from './BaseConfigPanel';
import { calistenicsIconNames } from '@/components/roadmaps/CalistenicsIcons';
import { useTranslations, useLocale } from 'next-intl';
import { getExercises } from '@/actions/exercise';
import { mockWorkoutDetails } from '@/utils/mock-data';
import { createSlug } from '@/utils/slugs';

type ContentNodeData = TopicNodeData | SubTopicNodeData;

interface ContentConfigPanelProps {
  node: Node<AnyNodeData>;
  onUpdateNode: (nodeId: string, updates: Partial<AnyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

// Tipos de recursos locales
const LOCAL_RESOURCE_TYPES: ResourceType[] = ['exercise', 'workout', 'post'];

// Definición de posts disponibles (basado en las claves del blog)
interface BlogPost {
  id: string;
  titleKey: string;
  slugKey: string;
}

const ContentConfigPanel: React.FC<ContentConfigPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}) => {
  const data = node.data as ContentNodeData;
  const nodeType = data.nodeType;
  const t = useTranslations('RoadmapBuilder');
  const locale = useLocale();

  // Estados para recursos locales
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts] = useState<WorkoutDetail[]>(mockWorkoutDetails);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Posts disponibles (basado en las claves del blog)
  const blogPosts: BlogPost[] = [
    { id: '1', titleKey: 'BlogPage.Posts.1.title', slugKey: 'BlogPage.Posts.1.slug' },
    { id: '2', titleKey: 'BlogPage.Posts.2.title', slugKey: 'BlogPage.Posts.2.slug' },
    { id: '3', titleKey: 'BlogPage.Posts.3.title', slugKey: 'BlogPage.Posts.3.slug' },
  ];
  const tBlog = useTranslations();

  // Cargar ejercicios al montar
  useEffect(() => {
    const loadExercises = async () => {
      setLoadingExercises(true);
      try {
        const data = await getExercises(locale);
        if (data) {
          setExercises(data);
        }
      } catch (error) {
        console.error('Error loading exercises:', error);
      } finally {
        setLoadingExercises(false);
      }
    };
    loadExercises();
  }, [locale]);

  const nodeTypeLabels: Record<string, string> = {
    topic: t('nodeTypes.topic'),
    subtopic: t('nodeTypes.subtopic'),
  };

  const handleUpdate = (updates: Partial<ContentNodeData>) => {
    onUpdateNode(node.id, updates);
  };

  // Función para verificar si es un tipo de recurso local
  const isLocalResource = (type: ResourceType) => LOCAL_RESOURCE_TYPES.includes(type);

  // Función para manejar la selección de recurso local
  const handleLocalResourceSelect = (
    index: number,
    resourceType: 'exercise' | 'workout' | 'post',
    localId: number | string
  ) => {
    const newResources = [...(data.resources || [])];

    if (resourceType === 'exercise') {
      const exercise = exercises.find(e => e.id === localId);
      if (exercise) {
        newResources[index] = {
          ...newResources[index],
          type: 'exercise',
          title: exercise.name,
          url: `/exercises/${createSlug(exercise.name)}`,
          localId: exercise.id,
        };
      }
    } else if (resourceType === 'workout') {
      const workout = workouts.find(w => w.id === localId);
      if (workout) {
        newResources[index] = {
          ...newResources[index],
          type: 'workout',
          title: workout.name,
          url: `/workouts/${workout.id}`,
          localId: workout.id,
        };
      }
    } else if (resourceType === 'post') {
      const post = blogPosts.find(p => p.id === localId);
      if (post) {
        const postTitle = tBlog(post.titleKey as Parameters<typeof tBlog>[0]);
        const postSlug = tBlog(post.slugKey as Parameters<typeof tBlog>[0]);
        newResources[index] = {
          ...newResources[index],
          type: 'post',
          title: postTitle,
          url: `/blog/${postSlug}`,
          localId: parseInt(post.id, 10),
        };
      }
    }

    handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
  };

  // Función para añadir recurso externo
  const handleAddExternalResource = () => {
    const newResources: RoadmapResource[] = [
      ...(data.resources || []),
      {
        id: `resource-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: '',
        url: '',
        type: 'article'
      },
    ];
    handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
  };

  // Función para añadir recurso local (ejercicio, workout o post)
  const handleAddLocalResource = (type: 'exercise' | 'workout' | 'post') => {
    const newResources: RoadmapResource[] = [
      ...(data.resources || []),
      {
        id: `resource-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: '',
        url: '',
        type: type,
        localId: undefined,
      },
    ];
    handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
  };

  // Opciones de iconos (filtramos 'none' del array para evitar duplicado)
  const iconOptions = [
    { value: 'none', label: t('fields.noIcon') },
    ...calistenicsIconNames
      .filter((name) => name !== 'none')
      .map((name) => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
      })),
  ];

  return (
    <BaseConfigPanel
      node={node}
      onUpdateNode={onUpdateNode}
      onDeleteNode={onDeleteNode}
      onClose={onClose}
      title={nodeTypeLabels[nodeType] || t('categories.content')}
      tabs={[
        { id: 'style', label: t('tabs.style') },
        { id: 'content', label: t('tabs.content') },
      ]}
    >
      {/* Tab de Estilo */}
      <div key="style" data-tab="style" className="space-y-4">
        {/* Color */}
        <ConfigColorPicker
          label={t('fields.backgroundColor')}
          value={data.color}
          onChange={(v) => handleUpdate({ color: v })}
          colors={[
            '#BB86FC', '#9A64D6', '#32D74B', '#03DAC5', '#FF453A',
            '#FF9F0A', '#64D2FF', '#BF5AF2', '#2563eb', '#64748b',
          ]}
        />

        {/* Icono */}
        <ConfigSelect
          label={t('fields.icon')}
          value={data.icon || 'none'}
          onChange={(v) => handleUpdate({ icon: v as ContentNodeData['icon'] })}
          options={iconOptions}
        />
      </div>

      {/* Tab de Contenido */}
      <div key="content" data-tab="content" className="space-y-4">
        {/* Descripción */}
        <ConfigTextarea
          label={t('fields.description')}
          value={data.description}
          onChange={(v) => handleUpdate({ description: v })}
          placeholder={t('fields.descriptionPlaceholder')}
          rows={4}
        />

        {/* Tips */}
        <ConfigTextarea
          label={t('fields.tips')}
          value={data.tips}
          onChange={(v) => handleUpdate({ tips: v })}
          placeholder={t('fields.tipsPlaceholder')}
          rows={3}
        />

        {/* Sección de recursos */}
        {(nodeType === 'topic' || nodeType === 'subtopic') && (
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {t('resources.title')}
            </label>
            <div className="space-y-3">
              {(data.resources || []).map((resource, index) => (
                <div
                  key={resource.id || `resource-${index}`}
                  className="p-3 bg-background/50 rounded-lg space-y-2"
                >
                  {/* Header con tipo y botón eliminar */}
                  <div className="flex items-center gap-2">
                    {/* Badge de tipo */}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isLocalResource(resource.type)
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-foreground/10 text-foreground/60'
                    }`}>
                      {isLocalResource(resource.type) ? t('resources.local') : t('resources.external')}
                    </span>
                    <span className="flex-1" />
                    <button
                      onClick={() => {
                        const newResources = (data.resources || []).filter(
                          (_, i) => i !== index
                        );
                        handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
                      }}
                      className="p-1 text-red-400 hover:text-red-300 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido según tipo de recurso */}
                  {isLocalResource(resource.type) ? (
                    <>
                      {/* Selector de tipo local */}
                      <select
                        value={resource.type}
                        onChange={(e) => {
                          const newResources = [...(data.resources || [])];
                          newResources[index] = {
                            ...resource,
                            type: e.target.value as 'exercise' | 'workout' | 'post',
                            title: '',
                            url: '',
                            localId: undefined,
                          };
                          handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
                        }}
                        className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-xs text-foreground"
                      >
                        <option value="exercise">{t('resources.types.exercise')}</option>
                        <option value="workout">{t('resources.types.workout')}</option>
                        <option value="post">{t('resources.types.post')}</option>
                      </select>

                      {/* Selector de ejercicio, workout o post */}
                      {resource.type === 'exercise' ? (
                        <select
                          value={resource.localId || ''}
                          onChange={(e) => {
                            const localId = parseInt(e.target.value, 10);
                            if (!isNaN(localId)) {
                              handleLocalResourceSelect(index, 'exercise', localId);
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                          disabled={loadingExercises}
                        >
                          <option value="">{loadingExercises ? t('resources.loading') : t('resources.selectExercise')}</option>
                          {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                              {ex.name}
                            </option>
                          ))}
                        </select>
                      ) : resource.type === 'workout' ? (
                        <select
                          value={resource.localId || ''}
                          onChange={(e) => {
                            const localId = parseInt(e.target.value, 10);
                            if (!isNaN(localId)) {
                              handleLocalResourceSelect(index, 'workout', localId);
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                        >
                          <option value="">{t('resources.selectWorkout')}</option>
                          {workouts.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={resource.localId || ''}
                          onChange={(e) => {
                            const localId = e.target.value;
                            if (localId) {
                              handleLocalResourceSelect(index, 'post', localId);
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                        >
                          <option value="">{t('resources.selectPost')}</option>
                          {blogPosts.map((post) => (
                            <option key={post.id} value={post.id}>
                              {tBlog(post.titleKey as Parameters<typeof tBlog>[0])}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Mostrar título seleccionado */}
                      {resource.title && (
                        <div className="px-2 py-1 bg-primary-500/10 border border-primary-500/20 rounded text-sm text-primary-400">
                          {resource.title}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Título para recurso externo */}
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => {
                          const newResources = [...(data.resources || [])];
                          newResources[index] = { ...resource, title: e.target.value };
                          handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
                        }}
                        className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                        placeholder={t('resources.resourceTitlePlaceholder')}
                      />

                      {/* URL */}
                      <input
                        type="url"
                        value={resource.url}
                        onChange={(e) => {
                          const newResources = [...(data.resources || [])];
                          newResources[index] = { ...resource, url: e.target.value };
                          handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
                        }}
                        className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-sm text-foreground"
                        placeholder={t('fields.urlPlaceholder')}
                      />

                      {/* Tipo de recurso externo */}
                      <select
                        value={resource.type}
                        onChange={(e) => {
                          const newResources = [...(data.resources || [])];
                          newResources[index] = { ...resource, type: e.target.value as ResourceType };
                          handleUpdate({ resources: newResources } as Partial<ContentNodeData>);
                        }}
                        className="w-full px-2 py-1 bg-background border border-foreground/20 rounded text-xs text-foreground"
                      >
                        <option value="article">{t('resources.types.article')}</option>
                        <option value="video">{t('resources.types.video')}</option>
                        <option value="documentation">{t('resources.types.documentation')}</option>
                        <option value="course">{t('resources.types.course')}</option>
                        <option value="tool">{t('resources.types.tool')}</option>
                        <option value="github">{t('resources.types.github')}</option>
                      </select>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Botones para añadir recursos */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleAddExternalResource}
                className="flex-1 px-3 py-2 border border-dashed border-foreground/20
                         text-foreground/60 hover:text-foreground hover:border-foreground/40
                         rounded-lg text-xs transition-colors"
              >
                + {t('resources.addExternal')}
              </button>
              <button
                onClick={() => handleAddLocalResource('exercise')}
                className="flex-1 px-3 py-2 border border-dashed border-primary-500/30
                         text-primary-400/70 hover:text-primary-400 hover:border-primary-500/50
                         rounded-lg text-xs transition-colors"
              >
                + {t('resources.addExercise')}
              </button>
              <button
                onClick={() => handleAddLocalResource('workout')}
                className="flex-1 px-3 py-2 border border-dashed border-secondary-500/30
                         text-secondary-400/70 hover:text-secondary-400 hover:border-secondary-500/50
                         rounded-lg text-xs transition-colors"
              >
                + {t('resources.addWorkout')}
              </button>
              <button
                onClick={() => handleAddLocalResource('post')}
                className="flex-1 px-3 py-2 border border-dashed border-orange-500/30
                         text-orange-400/70 hover:text-orange-400 hover:border-orange-500/50
                         rounded-lg text-xs transition-colors"
              >
                + {t('resources.addPost')}
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseConfigPanel>
  );
};

export default ContentConfigPanel;
