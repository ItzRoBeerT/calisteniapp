'use client';
import { Exercise } from '@/types/supabase';
import ExerciseCard from './Card';
import { useEffect, useState, useMemo } from 'react';
import { getExercisesByPage } from '@/actions/exercise';
import { useExerciseStore } from '@/stores/exercise';
import { useSearchParams } from 'next/navigation';
import Paginator from '../pagination/Paginator';

export default function ExercisesList(props: {
	initalExercises: Exercise[];
	totalPages: number;
	locale: string;
}) {
	const { initalExercises, locale } = props;
	const { page, setPage } = useExerciseStore();
	const [exercises, setExercises] = useState<Exercise[]>(initalExercises);
	const [totalPages, setTotalPages] = useState<number>(props.totalPages);
	const searchParams = useSearchParams();

	const currentFilters = useMemo(() => {
		const filters: Record<string, string | string[]> = {};
		searchParams.forEach((value, key) => {
			filters[key] = value;
		});
		return filters;
	}, [searchParams]);

	//#region FUNCTIONS
	useEffect(() => {
		if (Object.keys(currentFilters).length > 0) {
			(async () => {
				const newExercises = await getExercisesByPage(
					1,
					currentFilters,
					locale
				);

				if (newExercises) {
					setExercises(newExercises.exercises);
					setTotalPages(newExercises.totalPages);
					setPage(1);
				}
			})();
		} else {
			setExercises(initalExercises);
			setTotalPages(props.totalPages);
			setPage(1);
		}
	}, [currentFilters, initalExercises, setPage, locale, props.totalPages]);

	const loadMoreExercises = async (newPage: number) => {
		const filters = Object.keys(currentFilters).length > 0 ? currentFilters : undefined;
		const newExercises = await getExercisesByPage(newPage, filters, locale);
		if (newExercises) {
			setPage(newPage);
			setExercises(newExercises.exercises);
			setTotalPages(newExercises.totalPages);
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
					totalPages={totalPages}
					currentPage={page}
					onPageChange={loadMoreExercises}
				/>
			</div>
		</>
	);
}
