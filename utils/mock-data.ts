import { Exercise, ExerciseBase, ExerciseTranslation, Workout } from '@/types/supabase';
import { WorkoutDetail } from '@/types/Workout';

 
const exercisesBase: ExerciseBase[] = require('@/data/exercises.json');
 
const esMessages = require('@/messages/es.json');
 
const enMessages = require('@/messages/en.json');

// Traducciones por locale
const translationsByLocale: Record<string, Record<string, ExerciseTranslation>> = {
	es: esMessages.Exercises,
	en: enMessages.Exercises,
};

// Combinar datos base con traducciones
function combineWithTranslations(
	base: ExerciseBase[],
	translations: Record<string, ExerciseTranslation>
): Exercise[] {
	return base.map((exercise) => {
		const translation = translations[String(exercise.id)] || {
			name: `Exercise ${exercise.id}`,
			description: '',
		};
		return {
			...exercise,
			name: translation.name,
			description: translation.description,
			...(translation.instructions && { instructions: translation.instructions }),
		};
	});
}

// Obtener ejercicios traducidos por locale
export function getMockExercises(locale: string = 'es'): Exercise[] {
	const translations = translationsByLocale[locale] || translationsByLocale.es;
	return combineWithTranslations(exercisesBase, translations);
}

// Ejercicios con traducciones en español (fallback para modo sin i18n)
export const mockExercises: Exercise[] = getMockExercises('es');

// Exportar datos base para sincronización con Supabase
export const exercisesBaseData: ExerciseBase[] = exercisesBase;

// Old workout type for backwards compatibility
export const mockWorkouts: Workout[] = [
	{
		id: 1,
		owner: 1,
		likes: [],
		title: 'Rutina de Principiante',
		description: 'Rutina básica para empezar en calistenia',
		image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
		visible: true,
	},
	{
		id: 2,
		owner: 1,
		likes: [],
		title: 'Full Body Intermedio',
		description: 'Entrenamiento completo de cuerpo para nivel intermedio',
		image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
		visible: true,
	},
];

// New workout format with exercises for the workouts module
export const mockWorkoutDetails: WorkoutDetail[] = [
	{
		id: 1,
		name: 'Beginner Routine',
		description: 'Basic routine to start in calisthenics. Ideal for those taking their first steps in bodyweight training.',
		difficulty: 'Beginner',
		duration: 25,
		muscle_groups: ['chest', 'back', 'legs', 'core'],
		user_id: 'mock-user-1',
		tags: ['full-body', 'basic'],
		exercises: [
			{
				id: 'ex-1',
				exercise_id: 1,
				name: 'Push Up',
				sets: 3,
				reps: 10,
				rest: 60,
				muscle_group: ['chest', 'shoulders', 'triceps'],
				image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80',
			},
			{
				id: 'ex-2',
				exercise_id: 10,
				name: 'Australian Pull Up',
				sets: 3,
				reps: 10,
				rest: 60,
				muscle_group: ['back', 'biceps'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
			{
				id: 'ex-3',
				exercise_id: 3,
				name: 'Squat',
				sets: 3,
				reps: 15,
				rest: 45,
				muscle_group: ['legs', 'glutes'],
				image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
			},
			{
				id: 'ex-4',
				exercise_id: 5,
				name: 'Plank',
				sets: 3,
				reps: 30,
				rest: 30,
				muscle_group: ['core', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80',
			},
		],
	},
	{
		id: 2,
		name: 'Full Body Intermediate',
		description: 'Complete body workout for intermediate level. Includes more challenging exercises to keep progressing.',
		difficulty: 'Intermediate',
		duration: 40,
		muscle_groups: ['chest', 'back', 'triceps', 'biceps', 'legs', 'core'],
		user_id: 'mock-user-1',
		tags: ['full-body', 'strength'],
		exercises: [
			{
				id: 'ex-5',
				exercise_id: 11,
				name: 'Diamond Push Up',
				sets: 4,
				reps: 12,
				rest: 60,
				muscle_group: ['triceps', 'chest'],
				image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80',
			},
			{
				id: 'ex-6',
				exercise_id: 2,
				name: 'Pull Up',
				sets: 4,
				reps: 8,
				rest: 90,
				muscle_group: ['back', 'biceps'],
				image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=800&q=80',
			},
			{
				id: 'ex-7',
				exercise_id: 4,
				name: 'Dips',
				sets: 4,
				reps: 10,
				rest: 60,
				muscle_group: ['triceps', 'chest', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=800&q=80',
			},
			{
				id: 'ex-8',
				exercise_id: 12,
				name: 'Chin Up',
				sets: 3,
				reps: 8,
				rest: 90,
				muscle_group: ['biceps', 'back'],
				image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=800&q=80',
			},
			{
				id: 'ex-9',
				exercise_id: 3,
				name: 'Squat',
				sets: 4,
				reps: 20,
				rest: 45,
				muscle_group: ['legs', 'glutes'],
				image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
			},
			{
				id: 'ex-10',
				exercise_id: 20,
				name: 'Hanging Leg Raise',
				sets: 3,
				reps: 12,
				rest: 45,
				muscle_group: ['core'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
		],
	},
	{
		id: 3,
		name: 'Advanced Push Day',
		description: 'Push day for advanced athletes. Focused on chest, shoulders and triceps with high intensity exercises.',
		difficulty: 'Advanced',
		duration: 50,
		muscle_groups: ['chest', 'shoulders', 'triceps', 'core'],
		user_id: 'mock-user-1',
		tags: ['push', 'upper-body'],
		exercises: [
			{
				id: 'ex-11',
				exercise_id: 8,
				name: 'Handstand Push Up',
				sets: 4,
				reps: 6,
				rest: 120,
				muscle_group: ['shoulders', 'triceps', 'core'],
				image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80',
			},
			{
				id: 'ex-12',
				exercise_id: 17,
				name: 'Archer Push Up',
				sets: 4,
				reps: 8,
				rest: 90,
				muscle_group: ['chest', 'triceps', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80',
			},
			{
				id: 'ex-13',
				exercise_id: 4,
				name: 'Dips',
				sets: 4,
				reps: 15,
				rest: 60,
				muscle_group: ['triceps', 'chest', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=800&q=80',
			},
			{
				id: 'ex-14',
				exercise_id: 11,
				name: 'Diamond Push Up',
				sets: 3,
				reps: 15,
				rest: 45,
				muscle_group: ['triceps', 'chest'],
				image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80',
			},
			{
				id: 'ex-15',
				exercise_id: 18,
				name: 'Tuck Planche',
				sets: 4,
				reps: 15,
				rest: 90,
				muscle_group: ['shoulders', 'chest', 'core'],
				image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80',
			},
		],
	},
	{
		id: 4,
		name: 'Advanced Pull Day',
		description: 'Pull day for advanced athletes. Works back and biceps with high demand compound movements.',
		difficulty: 'Advanced',
		duration: 45,
		muscle_groups: ['back', 'biceps', 'core', 'shoulders'],
		user_id: 'mock-user-1',
		tags: ['pull', 'back'],
		exercises: [
			{
				id: 'ex-16',
				exercise_id: 6,
				name: 'Muscle Up',
				sets: 4,
				reps: 5,
				rest: 150,
				muscle_group: ['back', 'chest', 'triceps', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
			},
			{
				id: 'ex-17',
				exercise_id: 2,
				name: 'Pull Up',
				sets: 4,
				reps: 12,
				rest: 90,
				muscle_group: ['back', 'biceps'],
				image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=800&q=80',
			},
			{
				id: 'ex-18',
				exercise_id: 12,
				name: 'Chin Up',
				sets: 4,
				reps: 10,
				rest: 60,
				muscle_group: ['biceps', 'back'],
				image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=800&q=80',
			},
			{
				id: 'ex-19',
				exercise_id: 14,
				name: 'Front Lever',
				sets: 4,
				reps: 10,
				rest: 120,
				muscle_group: ['back', 'core', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
		],
	},
	{
		id: 5,
		name: 'Core Destroyer',
		description: 'Intensive core routine. Strengthen your core with progressive exercises from intermediate to advanced.',
		difficulty: 'Intermediate',
		duration: 30,
		muscle_groups: ['core', 'shoulders'],
		user_id: 'mock-user-2',
		tags: ['core', 'abs'],
		exercises: [
			{
				id: 'ex-20',
				exercise_id: 20,
				name: 'Hanging Leg Raise',
				sets: 4,
				reps: 15,
				rest: 45,
				muscle_group: ['core'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
			{
				id: 'ex-21',
				exercise_id: 9,
				name: 'L-Sit',
				sets: 4,
				reps: 20,
				rest: 60,
				muscle_group: ['core', 'triceps', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=800&q=80',
			},
			{
				id: 'ex-22',
				exercise_id: 5,
				name: 'Plank',
				sets: 3,
				reps: 60,
				rest: 30,
				muscle_group: ['core', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80',
			},
			{
				id: 'ex-23',
				exercise_id: 19,
				name: 'Dragon Flag',
				sets: 3,
				reps: 8,
				rest: 90,
				muscle_group: ['core'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
		],
	},
	{
		id: 6,
		name: 'Complete Leg Day',
		description: 'Complete leg routine using only bodyweight. From basic squats to pistol squats.',
		difficulty: 'Intermediate',
		duration: 35,
		muscle_groups: ['legs', 'glutes', 'core'],
		user_id: 'mock-user-2',
		tags: ['legs', 'lower-body'],
		exercises: [
			{
				id: 'ex-24',
				exercise_id: 3,
				name: 'Squat',
				sets: 4,
				reps: 20,
				rest: 45,
				muscle_group: ['legs', 'glutes'],
				image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
			},
			{
				id: 'ex-25',
				exercise_id: 7,
				name: 'Pistol Squat',
				sets: 3,
				reps: 5,
				rest: 90,
				muscle_group: ['legs', 'glutes', 'core'],
				image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
			},
			{
				id: 'ex-26',
				exercise_id: 13,
				name: 'Burpee',
				sets: 4,
				reps: 10,
				rest: 60,
				muscle_group: ['legs', 'chest', 'core', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80',
			},
			{
				id: 'ex-27',
				exercise_id: 5,
				name: 'Plank',
				sets: 3,
				reps: 45,
				rest: 30,
				muscle_group: ['core', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80',
			},
		],
	},
	{
		id: 7,
		name: 'Skills Workout',
		description: 'Workout focused on advanced calisthenics skills. For athletes who want to master static movements.',
		difficulty: 'Expert',
		duration: 60,
		muscle_groups: ['back', 'shoulders', 'core', 'chest'],
		user_id: 'mock-user-1',
		tags: ['skills', 'static'],
		exercises: [
			{
				id: 'ex-28',
				exercise_id: 14,
				name: 'Front Lever',
				sets: 5,
				reps: 15,
				rest: 150,
				muscle_group: ['back', 'core', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
			{
				id: 'ex-29',
				exercise_id: 15,
				name: 'Back Lever',
				sets: 4,
				reps: 15,
				rest: 120,
				muscle_group: ['shoulders', 'back', 'core'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
			{
				id: 'ex-30',
				exercise_id: 18,
				name: 'Tuck Planche',
				sets: 5,
				reps: 15,
				rest: 120,
				muscle_group: ['shoulders', 'chest', 'core'],
				image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80',
			},
			{
				id: 'ex-31',
				exercise_id: 16,
				name: 'Human Flag',
				sets: 4,
				reps: 10,
				rest: 150,
				muscle_group: ['core', 'shoulders', 'back'],
				image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
			},
			{
				id: 'ex-32',
				exercise_id: 9,
				name: 'L-Sit',
				sets: 4,
				reps: 30,
				rest: 60,
				muscle_group: ['core', 'triceps', 'shoulders'],
				image: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=800&q=80',
			},
		],
	},
];

export const mockFilters = {
	muscle_group: ['chest', 'back', 'shoulders', 'triceps', 'biceps', 'core', 'legs', 'glutes'],
	difficulty: [0, 1, 2, 3, 4, 5],
	equipment: [
		'none', 'pull_up_bar', 'parallel_bars', 'rings', 'resistance_band',
		'wall', 'bench', 'box', 'elevated_surface', 'low_bar',
		'anchor_point', 'stall_bars', 'step', 'support_surface',
		'vertical_pole', 'weight_belt',
	],
};

export const mockWorkoutFilters = {
	difficulties: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
	muscleGroups: ['chest', 'back', 'shoulders', 'triceps', 'biceps', 'core', 'legs', 'glutes'],
	durations: [25, 30, 35, 40, 45, 50, 60],
	tags: ['full-body', 'push', 'pull', 'core', 'legs', 'skills', 'basic', 'strength', 'upper-body', 'back', 'abs', 'lower-body', 'static'],
};

export function isSupabaseConfigured(): boolean {
	return !!(
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
		process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
	);
}
