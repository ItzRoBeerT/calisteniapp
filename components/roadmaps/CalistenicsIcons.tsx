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

// Wrapper base: trazo bold redondeado, estilo unificado
const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ className = '', size = 24, children }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

// Cabeza sólida reutilizable
const Head = ({ cx, cy, r = 2 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

// Iconos de ejercicios de calistenia
export const CalistenicsIcons: Record<CalistenicsIconType, React.FC<IconProps>> = {
  // Flexión: cuerpo horizontal empujando del suelo
  pushup: (p) => (
    <Svg {...p}>
      <path d="M3 18h18" />
      <Head cx={5} cy={9.5} r={2} />
      <path d="M7 10.5 16 13" />
      <path d="M16 13l5 3" />
      <path d="M8.5 11v6" />
    </Svg>
  ),
  // Dominada: colgado de barra, brazos arriba
  pullup: (p) => (
    <Svg {...p}>
      <path d="M4 4h16" />
      <path d="M8.5 6 12 9" />
      <path d="M15.5 6 12 9" />
      <Head cx={12} cy={10.5} r={2} />
      <path d="M12 12.5v4" />
      <path d="M12 16.5 10 20" />
      <path d="M12 16.5 14 20" />
    </Svg>
  ),
  // Sentadilla: de pie, rodillas flexionadas, brazos al frente
  squat: (p) => (
    <Svg {...p}>
      <Head cx={10} cy={5} r={2} />
      <path d="M10 7l1 5" />
      <path d="M10.5 8.5 16 8.5" />
      <path d="M11 12h5" />
      <path d="M16 12v7" />
      <path d="M11 12 8 19" />
    </Svg>
  ),
  // Fondos: entre barras paralelas, codos flexionados
  dip: (p) => (
    <Svg {...p}>
      <path d="M3 12h5" />
      <path d="M16 12h5" />
      <Head cx={12} cy={6} r={2} />
      <path d="M12 8v7" />
      <path d="M12 9 7 11" />
      <path d="M12 9 17 11" />
      <path d="M12 15 9 19" />
      <path d="M12 15 15 19" />
    </Svg>
  ),
  // Plancha: apoyo en antebrazos, cuerpo recto
  plank: (p) => (
    <Svg {...p}>
      <path d="M3 18h18" />
      <Head cx={5} cy={10.5} r={2} />
      <path d="M7 11.5 19 15.5" />
      <path d="M6 12.5v5" />
      <path d="M6 17.5h4" />
      <path d="M19 15.5 21 17.5" />
    </Svg>
  ),
  // Zancada: paso adelante, rodilla flexionada
  lunge: (p) => (
    <Svg {...p}>
      <Head cx={11} cy={4} r={2} />
      <path d="M11 6v5" />
      <path d="M11 8 14.5 9.5" />
      <path d="M11 11h5" />
      <path d="M16 11v7" />
      <path d="M11 11 7 15l1 4" />
    </Svg>
  ),
  // Burpee: salto explosivo con brazos arriba
  burpee: (p) => (
    <Svg {...p}>
      <Head cx={12} cy={4} r={2} />
      <path d="M12 6 8 3" />
      <path d="M12 6 16 3" />
      <path d="M12 6v7" />
      <path d="M12 13 9 18" />
      <path d="M12 13 15 18" />
      <path d="M6 21q6-4 12 0" />
    </Svg>
  ),
  // Muscle-up: transición por encima de la barra
  muscleup: (p) => (
    <Svg {...p}>
      <path d="M4 10h16" />
      <Head cx={12} cy={5} r={2} />
      <path d="M12 7v3" />
      <path d="M12 8 9 10" />
      <path d="M12 8 15 10" />
      <path d="M10.5 10 10 16" />
      <path d="M13.5 10 14 16" />
    </Svg>
  ),
  // Pino: invertido, manos en el suelo, piernas arriba
  handstand: (p) => (
    <Svg {...p}>
      <path d="M4 20h16" />
      <Head cx={12} cy={16.5} r={2} />
      <path d="M12 14.5v-5" />
      <path d="M12 9.5 9 4" />
      <path d="M12 9.5 15 4" />
      <path d="M11 15 8 20" />
      <path d="M13 15 16 20" />
    </Svg>
  ),
  // Pistol: sentadilla a una pierna, otra extendida
  pistol: (p) => (
    <Svg {...p}>
      <Head cx={10} cy={4} r={2} />
      <path d="M10 6l1 5" />
      <path d="M10.5 7.5 15 7" />
      <path d="M11 11h4" />
      <path d="M15 11v7" />
      <path d="M11 11 18.5 9.5" />
    </Svg>
  ),
  // Front lever: cuerpo horizontal, agarre en barra
  lever: (p) => (
    <Svg {...p}>
      <path d="M6 3v18" />
      <path d="M9 10 6 7" />
      <path d="M9 12 6 13" />
      <Head cx={10.5} cy={11} r={2} />
      <path d="M12.5 11H20" />
      <path d="M20 11l1.5-1" />
    </Svg>
  ),
  // Human flag: poste vertical, cuerpo en horizontal
  flag: (p) => (
    <Svg {...p}>
      <path d="M5 3v18" />
      <path d="M8 8 5 6" />
      <path d="M8 8 5 11" />
      <Head cx={9.5} cy={8} r={2} />
      <path d="M11.5 8 20 10.5" />
      <path d="M20 10.5 21.5 9.5" />
    </Svg>
  ),
  // Inicio: botón play
  start: (p) => (
    <Svg {...p}>
      <circle cx={12} cy={12} r={9} />
      <path d="M10 8.5 16 12l-6 3.5z" fill="currentColor" stroke="none" />
    </Svg>
  ),
  // Meta: bandera de cuadros
  finish: (p) => (
    <Svg {...p}>
      <path d="M6 3v18" />
      <path d="M6 4h13v9H6z" />
      <path d="M6 8.5h13" />
      <path d="M12.5 4v9" />
      <path d="M6 4h6.5v4.5H6zM12.5 8.5H19V13h-6.5z" fill="currentColor" stroke="none" />
    </Svg>
  ),
  // Descanso: luna de recuperación
  rest: (p) => (
    <Svg {...p}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
      <path d="M15 4h4l-4 4h4" />
    </Svg>
  ),
  // Calentamiento: llama
  warmup: (p) => (
    <Svg {...p}>
      <path d="M12 2c1 3.5 4.5 4.5 4.5 9a4.5 4.5 0 1 1-9 0c0-2.2 1.3-3.3 2.4-4.6C10.7 7 11 5.5 12 2z" />
      <path d="M12 21a2.5 2.5 0 0 0 2.5-2.5c0-1.6-1.3-2.3-2.5-4-1.2 1.7-2.5 2.4-2.5 4A2.5 2.5 0 0 0 12 21z" fill="currentColor" stroke="none" />
    </Svg>
  ),
  // Estiramiento: flexión hacia adelante
  stretch: (p) => (
    <Svg {...p}>
      <Head cx={7} cy={5} r={2} />
      <path d="M8 6.5q3 5 7 6" />
      <path d="M9 8 15 12.5" />
      <path d="M15 12.5h5" />
      <path d="M20 12.5v3" />
    </Svg>
  ),
  // Cardio: corazón con pulso
  cardio: (p) => (
    <Svg {...p}>
      <path d="M20.4 5.6a5 5 0 0 0-7.1 0l-1.3 1.3-1.3-1.3a5 5 0 0 0-7.1 7.1L12 20.5l8.4-8.4a5 5 0 0 0 0-6.5z" />
      <path d="M4 12.5h5l1.5-3 2.5 5 1.5-2h4" />
    </Svg>
  ),
  // Core: abdominales
  core: (p) => (
    <Svg {...p}>
      <rect x={8} y={3} width={8} height={18} rx={4} />
      <path d="M12 4v16" />
      <path d="M8.5 8.5h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 15.5h7" />
    </Svg>
  ),
  // Brazos: mancuerna
  arms: (p) => (
    <Svg {...p}>
      <path d="M3 9v6" />
      <path d="M6 6.5v11" />
      <path d="M6 12h12" />
      <path d="M18 6.5v11" />
      <path d="M21 9v6" />
    </Svg>
  ),
  // Piernas: par de piernas flexionadas
  legs: (p) => (
    <Svg {...p}>
      <path d="M9 4h6" />
      <path d="M10 4v8l-3 8" />
      <path d="M14 4v8l3 8" />
      <path d="M5 20h4" />
      <path d="M15 20h4" />
    </Svg>
  ),
  // Espalda: taper en V
  back: (p) => (
    <Svg {...p}>
      <Head cx={12} cy={4.5} r={1.8} />
      <path d="M12 6v13" />
      <path d="M12 7 6 11l1.5 8" />
      <path d="M12 7 18 11l-1.5 8" />
    </Svg>
  ),
  // Pecho: pectorales
  chest: (p) => (
    <Svg {...p}>
      <path d="M12 6C8 4 4 5.5 4 9.5c0 3 4 5 8 2" />
      <path d="M12 6c4-2 8-.5 8 3.5 0 3-4 5-8 2" />
      <path d="M12 6v7.5" />
    </Svg>
  ),
  // Hombros: deltoides
  shoulders: (p) => (
    <Svg {...p}>
      <Head cx={12} cy={6} r={2.6} />
      <path d="M4 16c0-4 3.5-6 8-6s8 2 8 6" />
      <path d="M4 16v3" />
      <path d="M20 16v3" />
    </Svg>
  ),
  // Sin icono
  none: (p) => (
    <Svg {...p}>
      <circle cx={12} cy={12} r={9} strokeDasharray="3 3" />
    </Svg>
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
