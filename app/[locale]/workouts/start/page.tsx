import { getWorkoutsByPage } from '@/actions/workout';
import WorkoutRunner from '@/components/workouts/WorkoutRunner';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Comenzar Entrenamiento',
	description: 'Elige un entrenamiento y comienza a entrenar',
};

type StartWorkoutPageProps = {
	searchParams: Promise<{ id?: string }>;
};

export default async function StartWorkoutPage({ searchParams }: StartWorkoutPageProps) {
	const { id } = await searchParams;
	const data = await getWorkoutsByPage(1, 100);
	const initialWorkoutId = id ? Number(id) : undefined;

	return (
		<section className="py-6">
			<WorkoutRunner
				workouts={data?.workouts || []}
				initialWorkoutId={initialWorkoutId}
			/>
		</section>
	);
}
