import { create } from 'zustand';

export type ExerciseState = {
	page: number;
};

export type ExerciseActions = {
	setPage: (page: number) => void;
};

export type ExerciseStore = ExerciseState & ExerciseActions;

export const defaultInitState: ExerciseState = {
	page: 1,
};

export const useExerciseStore = create<ExerciseStore>((set) => ({
	...defaultInitState,
	setPage: (page) => set({ page }),
}));
