'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type WorkoutFilterProps = {
  allFilters: {
    difficulties: string[];
    muscleGroups: string[];
    durations: number[];
    tags: string[];
  };
};

export default function WorkoutFilter({ allFilters }: WorkoutFilterProps) {
  const t = useTranslations('WorkoutFilter');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  
  const [filters, setFilters] = useState({
    difficulty: '',
    muscleGroup: '',
    duration: '',
    tag: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.muscleGroup) queryParams.append('muscleGroup', filters.muscleGroup);
    if (filters.duration) queryParams.append('duration', filters.duration);
    if (filters.tag) queryParams.append('tag', filters.tag);
    
    // Preserve the locale in the URL
    router.push(`${pathname}?${queryParams.toString()}`);
  };
  
  const clearFilters = () => {
    setFilters({
      difficulty: '',
      muscleGroup: '',
      duration: '',
      tag: ''
    });
    
    // Preserve the locale when clearing filters
    router.push(pathname);
  };

  return (
    <div className="bg-surface p-4 rounded-md shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('difficulty', 'Dificultad')}
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">{t('all', 'Todos')}</option>
            {allFilters.difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        {/* Muscle Group Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('muscleGroup', 'Grupo Muscular')}
          </label>
          <select
            value={filters.muscleGroup}
            onChange={(e) => handleFilterChange('muscleGroup', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">{t('all', 'Todos')}</option>
            {allFilters.muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('duration', 'Duración')}
          </label>
          <select
            value={filters.duration}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">{t('all', 'Todos')}</option>
            {allFilters.durations.map((duration) => (
              <option key={duration} value={duration.toString()}>
                {duration} min
              </option>
            ))}
          </select>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('tag', 'Etiqueta')}
          </label>
          <select
            value={filters.tag}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">{t('all', 'Todos')}</option>
            {allFilters.tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          {t('clear', 'Limpiar')}
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {t('apply', 'Aplicar')}
        </button>
      </div>
    </div>
  );
}