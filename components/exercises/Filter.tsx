'use client';

import { useTranslations } from 'next-intl';
import FilterPanel, { FilterField } from '@/components/ui/FilterPanel';
import { Filter } from '@/types/supabase';

type ExerciseFilterProps = {
  allFilters: Filter;
};

export default function ExerciseFilter({ allFilters }: ExerciseFilterProps) {
  const t = useTranslations('ExerciseFilter');
  const tCard = useTranslations('ExerciseCard');

  const difficultyOptions = [
    { value: 'beginner', label: t('beginner') },
    { value: 'intermediate', label: t('intermediate') },
    { value: 'advanced', label: t('advanced') },
  ];

  const fields: FilterField[] = [
    {
      key: 'difficulty',
      label: t('difficulty'),
      options: difficultyOptions,
    },
    {
      key: 'muscle_group',
      label: t('muscleGroup'),
      options: allFilters.muscle_group.map((group) => ({
        value: group,
        label: tCard(`muscleGroups.${group as 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'legs' | 'glutes'}`) || group,
      })),
    },
    {
      key: 'equipment',
      label: t('equipment'),
      options: allFilters.equipment.map((eq) => ({
        value: eq,
        label: t(`equipmentOptions.${eq}` as Parameters<typeof t>[0]),
      })),
      multiSelect: true,
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
      columns={3}
    />
  );
}
