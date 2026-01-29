'use client';

import React from 'react';

// Tipo para los iconos
export type CalistenicsIconType =
  | 'pushup'
  | 'pullup'
  | 'squat'
  | 'dip'
  | 'plank'
  | 'lunge'
  | 'burpee'
  | 'muscleup'
  | 'handstand'
  | 'pistol'
  | 'lever'
  | 'flag'
  | 'start'
  | 'finish'
  | 'rest'
  | 'warmup'
  | 'stretch'
  | 'cardio'
  | 'core'
  | 'arms'
  | 'legs'
  | 'back'
  | 'chest'
  | 'shoulders'
  | 'none';

// Array de nombres de iconos para usar en selects
export const calistenicsIconNames: CalistenicsIconType[] = [
  'pushup', 'pullup', 'squat', 'dip', 'plank', 'lunge', 'burpee',
  'muscleup', 'handstand', 'pistol', 'lever', 'flag',
  'start', 'finish', 'rest', 'warmup', 'stretch', 'cardio',
  'core', 'arms', 'legs', 'back', 'chest', 'shoulders', 'none',
];

interface IconProps {
  className?: string;
  size?: number;
}

// Iconos de ejercicios de calistenia
export const CalistenicsIcons: Record<CalistenicsIconType, React.FC<IconProps>> = {
  pushup: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h2v4H4z" />
      <path d="M18 14h2v4h-2z" />
      <path d="M6 14v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <circle cx="12" cy="6" r="2" />
      <path d="M10 10h4" />
    </svg>
  ),
  pullup: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16" />
      <path d="M8 4v4" />
      <path d="M16 4v4" />
      <circle cx="12" cy="10" r="2" />
      <path d="M10 12v6" />
      <path d="M14 12v6" />
      <path d="M8 20h2" />
      <path d="M14 20h2" />
    </svg>
  ),
  squat: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v3" />
      <path d="M8 14l4-4 4 4" />
      <path d="M8 14v4l-2 2" />
      <path d="M16 14v4l2 2" />
    </svg>
  ),
  dip: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h4" />
      <path d="M16 8h4" />
      <path d="M6 8v8" />
      <path d="M18 8v8" />
      <circle cx="12" cy="6" r="2" />
      <path d="M12 8v4" />
      <path d="M10 12h4" />
      <path d="M10 16l2 4 2-4" />
    </svg>
  ),
  plank: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2" />
      <path d="M8 12h10" />
      <path d="M4 16l2-2" />
      <path d="M18 12v4" />
      <path d="M20 16h-4" />
    </svg>
  ),
  lunge: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v4" />
      <path d="M8 10l4 4 4-8" />
      <path d="M6 18l2-4" />
      <path d="M18 14l-2 6" />
    </svg>
  ),
  burpee: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v2" />
      <path d="M8 8h8" />
      <path d="M10 12l2 2 2-2" />
      <path d="M8 16h8" />
      <path d="M10 20v-4" />
      <path d="M14 20v-4" />
    </svg>
  ),
  muscleup: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M8 6v2" />
      <path d="M16 6v2" />
      <circle cx="12" cy="10" r="2" />
      <path d="M10 12l-2 4" />
      <path d="M14 12l2 4" />
      <path d="M10 18v2" />
      <path d="M14 18v2" />
    </svg>
  ),
  handstand: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="18" r="2" />
      <path d="M12 16v-6" />
      <path d="M8 10l4-6 4 6" />
      <path d="M8 4v2" />
      <path d="M16 4v2" />
    </svg>
  ),
  pistol: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v4" />
      <path d="M10 10h4" />
      <path d="M12 10v4l-4 6" />
      <path d="M14 14l4 2" />
    </svg>
  ),
  lever: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h2" />
      <path d="M5 8v8" />
      <circle cx="8" cy="10" r="2" />
      <path d="M10 10h10" />
      <path d="M14 8v4" />
      <path d="M18 8v4" />
    </svg>
  ),
  flag: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16" />
      <path d="M4 8h12" />
      <circle cx="8" cy="12" r="2" />
      <path d="M10 12h6" />
      <path d="M12 10v4" />
      <path d="M16 10v4" />
    </svg>
  ),
  start: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" />
    </svg>
  ),
  finish: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  rest: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  warmup: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  stretch: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v6" />
      <path d="M8 8l4 4 4-4" />
      <path d="M6 16l6-4 6 4" />
      <path d="M8 20l4-4 4 4" />
    </svg>
  ),
  cardio: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
      <path d="M3.5 12h6l1-2 2 4 2-2h6" />
    </svg>
  ),
  core: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="8" ry="10" />
      <path d="M12 2v20" />
      <path d="M4 12h16" />
    </svg>
  ),
  arms: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l6 6" />
      <path d="M4 10l4-4" />
      <path d="M18 6l-6 6" />
      <path d="M20 10l-4-4" />
      <ellipse cx="12" cy="16" rx="4" ry="2" />
      <path d="M12 14v4" />
    </svg>
  ),
  legs: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4v8l-4 8" />
      <path d="M14 4v8l4 8" />
      <path d="M8 8h8" />
      <path d="M6 20h4" />
      <path d="M14 20h4" />
    </svg>
  ),
  back: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16" />
      <path d="M8 8l4-4 4 4" />
      <path d="M6 12h12" />
      <path d="M8 16l4 4 4-4" />
    </svg>
  ),
  chest: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="10" rx="4" ry="6" />
      <ellipse cx="16" cy="10" rx="4" ry="6" />
      <path d="M12 4v12" />
    </svg>
  ),
  shoulders: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="3" />
      <path d="M5 14l3-4h8l3 4" />
      <path d="M5 14v4" />
      <path d="M19 14v4" />
    </svg>
  ),
  none: ({ className = '', size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
};

// Lista de iconos con metadata para el selector
export const iconsList: { type: CalistenicsIconType; label: string; category: string }[] = [
  // Ejercicios básicos
  { type: 'pushup', label: 'Flexiones', category: 'Ejercicios' },
  { type: 'pullup', label: 'Dominadas', category: 'Ejercicios' },
  { type: 'squat', label: 'Sentadillas', category: 'Ejercicios' },
  { type: 'dip', label: 'Fondos', category: 'Ejercicios' },
  { type: 'plank', label: 'Plancha', category: 'Ejercicios' },
  { type: 'lunge', label: 'Zancadas', category: 'Ejercicios' },
  { type: 'burpee', label: 'Burpees', category: 'Ejercicios' },
  // Avanzados
  { type: 'muscleup', label: 'Muscle Up', category: 'Avanzados' },
  { type: 'handstand', label: 'Pino', category: 'Avanzados' },
  { type: 'pistol', label: 'Pistol Squat', category: 'Avanzados' },
  { type: 'lever', label: 'Front Lever', category: 'Avanzados' },
  { type: 'flag', label: 'Human Flag', category: 'Avanzados' },
  // Grupos musculares
  { type: 'core', label: 'Core', category: 'Músculos' },
  { type: 'arms', label: 'Brazos', category: 'Músculos' },
  { type: 'legs', label: 'Piernas', category: 'Músculos' },
  { type: 'back', label: 'Espalda', category: 'Músculos' },
  { type: 'chest', label: 'Pecho', category: 'Músculos' },
  { type: 'shoulders', label: 'Hombros', category: 'Músculos' },
  // Estados
  { type: 'start', label: 'Inicio', category: 'Estados' },
  { type: 'finish', label: 'Meta', category: 'Estados' },
  { type: 'rest', label: 'Descanso', category: 'Estados' },
  { type: 'warmup', label: 'Calentamiento', category: 'Estados' },
  { type: 'stretch', label: 'Estirar', category: 'Estados' },
  { type: 'cardio', label: 'Cardio', category: 'Estados' },
  // Sin icono
  { type: 'none', label: 'Sin icono', category: 'Otros' },
];

// Componente selector de icono
interface IconSelectorProps {
  selectedIcon: CalistenicsIconType;
  onSelect: (icon: CalistenicsIconType) => void;
}

export function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  const categories = [...new Set(iconsList.map((i) => i.category))];

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">
            {category}
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {iconsList
              .filter((i) => i.category === category)
              .map((icon) => {
                const IconComponent = CalistenicsIcons[icon.type];
                const isSelected = selectedIcon === icon.type;
                return (
                  <button
                    key={icon.type}
                    type="button"
                    onClick={() => onSelect(icon.type)}
                    className={`
                      p-2 rounded-lg border-2 transition-all duration-200
                      flex flex-col items-center gap-1
                      ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:bg-foreground/5'
                      }
                    `}
                    title={icon.label}
                  >
                    <IconComponent size={20} />
                    <span className="text-[10px] truncate w-full text-center">{icon.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CalistenicsIcons;
