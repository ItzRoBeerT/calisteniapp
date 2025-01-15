'use client';
import { Exercise } from '@/types/supabase';
import ExerciseCard from './Card';
import { useEffect, useState } from 'react';
import { getExercisesByPage } from '@/actions/exercise';
import { useExerciseStore } from '@/stores/exercise';
import { useSearchParams } from 'next/navigation';
import Paginator from '../pagination/Paginator';

export default function ExercisesList(props: {
	initalExercises: Exercise[];
	totalPages: number;
}) {
	const { initalExercises } = props;
	const { page, setPage } = useExerciseStore();
	const [exercises, setExercises] = useState<Exercise[]>(initalExercises);
	const searchParams = useSearchParams();

	//#region FUNCTIONS
	useEffect(() => {
		const updatedFilters: Record<string, string | string[]> = {};

		// Itera sobre los parámetros actuales en la URL
		searchParams.forEach((value, key) => {
			updatedFilters[key] = value;
		});

		// Si hay filtros, realiza la petición
		if (Object.keys(updatedFilters).length > 0) {
			(async () => {
				const newExercises = await getExercisesByPage(
					1,
					updatedFilters
				);

				if (newExercises?.exercises) {
					setExercises(newExercises.exercises);
					setPage(1);
				}
			})();
		} else {
			setExercises(initalExercises);
		}
	}, [searchParams]);

	const loadMoreExercises = async (newPage: number) => {
		const newExercises = await getExercisesByPage(newPage);
		if (newExercises) {
			setPage(newPage);
			setExercises(newExercises.exercises);
		}

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	//#endregion

	return (
		<>
			<div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 my-4">
				{exercises.map((exercise, index) => (
					<ExerciseCard exercise={exercise} key={index} />
				))}
			</div>
			<div className='m-4'>
				<Paginator
					totalPages={props.totalPages}
					currentPage={page}
					onPageChange={loadMoreExercises}
				/>
			</div>
		</>
	);
}
