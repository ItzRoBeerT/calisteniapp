import exercisesBase from '@/data/exercises.json';
import esMessages from '@/messages/es.json';
import { EXERCISES_VERSION } from '@/lib/exercises-version';

type ExerciseTranslation = { name: string; description: string };
type ExerciseResource = { type: string; url: string; title: string };
type ExerciseBase = {
	id: number;
	image: string;
	difficulty: number;
	muscle_group: string[];
	category?: string;
	type?: string;
	equipment?: string[];
	resources?: ExerciseResource[];
};

export async function GET() {
	const translations = esMessages.Exercises as Record<string, ExerciseTranslation>;

	const exercises = (exercisesBase as ExerciseBase[]).map((ex) => {
		const trans = translations[String(ex.id)];
		return {
			id: ex.id,
			name: trans?.name ?? `Ejercicio ${ex.id}`,
			description: trans?.description ?? '',
			image: ex.image,
			difficulty: ex.difficulty,
			muscle_group: ex.muscle_group,
			category: ex.category ?? '',
			type: ex.type ?? '',
			equipment: ex.equipment ?? [],
			resources: ex.resources ?? [],
		};
	});

	return Response.json({ version: EXERCISES_VERSION, exercises });
}
