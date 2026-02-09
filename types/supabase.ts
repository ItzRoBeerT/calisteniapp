// Recurso asociado a un ejercicio (video, artículo, etc.)
export interface ExerciseResource {
	type: 'video' | 'article' | 'image';
	url: string;
	title?: string;
}

// Datos base del ejercicio (sin traducciones)
export interface ExerciseBase {
	id: number;
	image: string;
	muscle_group: string[];
	difficulty: number;
	category?: string;
	type?: string;
	equipment?: string[];
	resources?: ExerciseResource[];
}

// Traducciones de un ejercicio
export interface ExerciseTranslation {
	name: string;
	description: string;
	instructions?: string;
}

// Ejercicio completo con traducciones aplicadas
export interface Exercise extends ExerciseBase {
	name: string;
	description: string;
	instructions?: string;
}

export interface User {
	id: number;
	username: string;
	email: string;
	password: string;
	google?: boolean;
	follow: number[];
}

export interface Workout{
	id: number;
	owner: number;
	likes: number[];
	description?: string;
	title: string;
	image: string;
	comments?: string[];
	visible: boolean;
}

export interface Filter {
	difficulty: string[];
	muscle_group: string[];
	equipment: string[];
}