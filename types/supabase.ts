export interface Exercise {
	id: number;
	title: string;
	description: string;
	image: string;
	video?: string;
	likes?: number[];
	comments?: string[];
	level: number;
	family: string;
	materials?: string[];
	muscle: string;
	muscle_group?: string;
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