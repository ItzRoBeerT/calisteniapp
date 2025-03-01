'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Workout } from '@/types/supabase';
import WorkoutCard from './Card';
import { getFilteredWorkouts } from '@/actions/workout';
import Paginator from '@/components/pagination/Paginator';

type WorkoutListProps = {
	initialWorkouts: Workout[];
	totalPages: number;
	currentUserId: string | null;
};

export default function WorkoutList({
	initialWorkouts,
	totalPages,
	currentUserId,
}: WorkoutListProps) {
	const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPagesCount, setTotalPagesCount] = useState(totalPages);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const updatedFilters: Record<string, string | string[]> = {};

		// Collect all current URL parameters
		searchParams.forEach((value, key) => {
			if (key === 'tags' && value) {
				updatedFilters[key] = value.split(',');
			} else {
				updatedFilters[key] = value;
			}
		});

		// If we have filters, fetch filtered workouts
		if (Object.keys(updatedFilters).length > 0) {
			setLoading(true);
			(async () => {
				try {
					const result = await getFilteredWorkouts(1, updatedFilters);
					if (result) {
						setWorkouts(result.workouts);
						setTotalPagesCount(result.totalPages);
						setCurrentPage(1);
					}
				} catch (error) {
					console.error('Error fetching filtered workouts:', error);
				} finally {
					setLoading(false);
				}
			})();
		} else {
			// If no filters, reset to initial workouts
			setWorkouts(initialWorkouts);
			setTotalPagesCount(totalPages);
		}
	}, [searchParams, initialWorkouts, totalPages]);

	const loadPage = async (newPage: number) => {
		setLoading(true);
		try {
			const updatedFilters: Record<string, string | string[]> = {};

			searchParams.forEach((value, key) => {
				if (key === 'tags' && value) {
					updatedFilters[key] = value.split(',');
				} else {
					updatedFilters[key] = value;
				}
			});

			const result = await getFilteredWorkouts(newPage, updatedFilters);
			if (result) {
				setWorkouts(result.workouts);
				setCurrentPage(newPage);
			}

			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (error) {
			console.error('Error loading page:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-[300px] flex justify-center items-center text-white">
				<div className="text-xl">Cargando entrenamientos...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-white">
			{workouts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-xl text-gray-400 mb-4">
						No hay entrenamientos disponibles con estos filtros
					</p>
					{currentUserId ? (
						<button
							onClick={() => router.push('/workouts/new')}
							className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded"
						>
							Crear tu primer entrenamiento
						</button>
					) : (
						<p className="text-gray-400">
							Inicia sesión para crear entrenamientos
						</p>
					)}
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
						{workouts.map((workout) => (
							<WorkoutCard
								key={workout.id}
								workout={workout}
								currentUserId={currentUserId}
							/>
						))}
					</div>

					{totalPagesCount > 1 && (
						<div className="m-4">
							<Paginator
								totalPages={totalPagesCount}
								currentPage={currentPage}
								onPageChange={loadPage}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
}
