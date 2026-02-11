export const difficultyColors: Record<string, string> = {
  'Beginner': 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Advanced': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Expert': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function getDifficultyColor(difficulty?: string): string {
  if (!difficulty) return 'bg-primary-500/20 text-primary-400 border-primary-500/30';

  // Normalize difficulty to match the keys: Capitalize first letter, lowercase rest
  const normalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  return difficultyColors[normalized] || 'bg-primary-500/20 text-primary-400 border-primary-500/30';
}
