'use client';

import { useTranslations } from 'next-intl';
import FilterPanel, { FilterField } from '@/components/ui/FilterPanel';

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

  const durationRanges = [
    { value: '0-15', label: '0 - 15 min' },
    { value: '15-45', label: '15 - 45 min' },
    { value: '45-90', label: '45 - 1:30 h' },
    { value: '90+', label: '+1:30 h' },
  ];

  const fields: FilterField[] = [
    {
      key: 'difficulty',
      label: t('difficulty'),
      options: allFilters.difficulties.map((d) => ({ value: d, label: d })),
    },
    {
      key: 'muscleGroup',
      label: t('muscleGroup'),
      options: allFilters.muscleGroups.map((g) => ({ value: g, label: g })),
    },
    {
      key: 'duration',
      label: t('duration'),
      options: durationRanges,
    },
    {
      key: 'tag',
      label: t('tag'),
      options: allFilters.tags.map((tag) => ({ value: tag, label: tag })),
    },
  ];

  const translations = {
    all: t('all'),
    clear: t('clear'),
    apply: t('apply'),
  };

  return (
    <FilterPanel
      fields={fields}
      translations={translations}
      columns={4}
    />
  );
}
