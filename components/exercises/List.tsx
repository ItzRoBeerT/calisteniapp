'use client';
import { Exercise } from '@/types/supabase';
import ExerciseCard from './Card';
import { useEffect, useState } from 'react';
import { getExercisesByPage } from '@/actions/exercise';
import { useInView } from 'react-intersection-observer';
import { useExerciseStore } from '@/stores/exercise';

export default function ExercisesList(props: { initalExercises: Exercise[] }) {
	const { initalExercises } = props;
	const { page, setPage } = useExerciseStore();
	const [exercises, setExercises] = useState<Exercise[]>(initalExercises);
	const { ref, inView } = useInView();

	//#region FUNCTIONS
	//TODO: Añadir más ejrcicios y verificar que no lanza dos veces la petición
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
				<span>Loading...</span>
			</div>
		</div>
	);
}
