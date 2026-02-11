import { getWorkoutsByPage } from '@/actions/workout';
import WorkoutRunner from '@/components/workouts/WorkoutRunner';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Comenzar Entrenamiento',
	description: 'Elige un entrenamiento y comienza a entrenar',
};

export default async function StartWorkoutPage() {
	const data = await getWorkoutsByPage(1, 100);

	return (
		<section className="py-6">
			<WorkoutRunner workouts={data?.workouts || []} />
		</section>
	);
}
