import { getExercisesByPage } from '@/actions/exercise';
import ExerciseFilter from '@/components/exercises/Filter';
import ExercisesList from '@/components/exercises/List';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Ejercicios',
	description:
		'Busca y encuentra los ejercicios que necesitas para mejorar tu fuerza y flexibilidad',
};

export default async function ExercisesPage() {
	const exercises = (await getExercisesByPage(1)) || [];

	return (
		<>
			<h1 className="text-4xl text-center font-bold">
				Listado De Ejercicios
			</h1>
			<section>
				<ExerciseFilter />
			</section>
			<section>
				<ExercisesList initalExercises={exercises} />
			</section>
		</>
	);
}
