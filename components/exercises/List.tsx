'use client';
import { Exercise } from '@/types/supabase';
import ExerciseCard from './Card';
import { useEffect, useState } from 'react';
import { getExercisesByPage } from '@/actions/exercise';
import { useInView } from 'react-intersection-observer';
import { useExerciseStore } from '@/stores/exercise';
import Loader from '../styles/Loader';
import { useSearchParams } from 'next/navigation';

export default function ExercisesList(props: { initalExercises: Exercise[] }) {
	const { initalExercises } = props;
	const { page, setPage } = useExerciseStore();
	const [exercises, setExercises] = useState<Exercise[]>(initalExercises);
	const { ref, inView } = useInView();
	const searchParams = useSearchParams();

	//#region FUNCTIONS
	useEffect(() => {
		const updatedFilters: Record<string, string | string[]> = {};

		// Itera sobre los parámetros actuales en la URL
		searchParams.forEach((value, key) => {
			updatedFilters[key] = value;
		});

		// Aquí puedes manejar los filtros actualizados, por ejemplo:
		console.log('Filtros actualizados:', updatedFilters);

		// Si hay filtros, realiza la petición
		if (Object.keys(updatedFilters).length > 0) {
			console.log('entro');
			(async () => {
				const newExercises = await getExercisesByPage(
					1,
					updatedFilters
				);
				console.log('New exercises:', newExercises);

				if (newExercises) {
					setExercises(newExercises);
					setPage(1);
				}
			})();
		} else {
			setExercises(initalExercises);
		}
	}, [searchParams]);

	useEffect(() => {
		if (inView) {
			loadMoreExercises();
			console.log('In view');
		}
	}, [inView]);

	const loadMoreExercises = async () => {
		const newExercises = await getExercisesByPage(page + 1);
		if (newExercises) {
			setPage(page + 1);
			setExercises([...exercises, ...newExercises]);
		}
	};
	//#endregion

	return (
		<div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 my-4">
			{exercises.map((exercise, index) => (
				<ExerciseCard exercise={exercise} key={index} />
			))}
			<div ref={ref}>
				<Loader />
			</div>
		</div>
	);
}
