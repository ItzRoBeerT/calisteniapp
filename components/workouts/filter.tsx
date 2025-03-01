import { Metadata } from 'next';
import { getWorkoutsByPage, getWorkoutFilters } from '@/actions/workout';
import WorkoutFilter from '@/components/workouts/Filter';
import WorkoutList from '@/components/workouts/List';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
	title: 'Entrenamientos',
	description:
		'Explora y filtra entrenamientos personalizados para mejorar tu condición física',
};

export default async function WorkoutsPage() {
	// Get the current user ID if logged in
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const currentUserId = user?.id || null;

	// Fetch initial workouts and filters
	const data = await getWorkoutsByPage(1);
	const filters = await getWorkoutFilters();

	return (
		<>
			<div className="min-h-screen text-white p-4 md:p-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Entrenamientos</h1>
					{currentUserId && (
						<a
							href="/workouts/new"
							className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded"
						>
							Añadir Workout
						</a>
					)}
				</div>

				<section className="mb-6">
					<WorkoutFilter allFilters={filters} />
				</section>

				<section>
					<WorkoutList
						initialWorkouts={data?.workouts || []}
						totalPages={data?.totalPages || 0}
						currentUserId={currentUserId}
					/>
				</section>
			</div>
		</>
	);
}
