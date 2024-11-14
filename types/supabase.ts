export interface Exercise {
	id: number;
	name: string;
	description: string;
	image: string;
	video?: string;
	likes?: number[];
	level: number;
	family: string[];
	materials?: string[];
	muscles: string[];
	muscle_group?: string[];
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