import { getExercises } from '@/actions/exercise';
import ExerciseCard from '@/components/exercises/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Ejercicios',
	description:
		'Busca y encuentra los ejercicios que necesitas para mejorar tu fuerza y flexibilidad',
};

export default async function ExercisesPage() {
	let exercises = (await getExercises()) || [];
	console.log(exercises);

	return (
		<>
			<h1 className="text-4xl text-center font-bold">
				Listado De Ejercicios
			</h1>
			<section>
				<p>Filtros</p>
			</section>
			<section className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 my-4">
				{exercises.map((exercise, index) => (
					<ExerciseCard exercise={exercise} key={index} />
				))}
			</section>
		</>
	);
}
