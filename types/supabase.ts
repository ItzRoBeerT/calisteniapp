export interface Exercise {
	id: number;
	name: string;
	description: string;
	image: string;
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
	difficulties: string[];
	muscleGroups: string[];
	families: string[];
}