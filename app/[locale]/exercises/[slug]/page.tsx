import Image from 'next/image';
import { getExerciseByName } from '@/actions/exercise';
import { desSlugify } from '@/utils/slugs';
import DefaultImage from '@/public/images/default_image.webp';
import { NotFoundError } from '@/utils/errors';
import ExerciseProgressionTree from '@/components/exercises/ExerciseProgressionTree';

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const exercise = await getExerciseByName(desSlugify(slug));

	if (!exercise) {
		throw new NotFoundError(`No se encontró el ejercicio "${desSlugify(slug)}"`);
	}

	return (
		<div className="mx-auto max-w-6xl py-8 px-4">
			{/* Header */}
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold text-primary-500">{exercise.name}</h1>
				<div className="flex flex-wrap gap-2">
					{exercise.muscle_group?.map((muscle: string, index: number) => (
						<span
							key={index}
							className="rounded-full bg-primary-500/10 px-3 py-1 text-sm font-medium text-primary-400"
						>
							{muscle}
						</span>
					))}

					<span className="ml-auto rounded-full bg-secondary-500/10 px-3 py-1 text-sm font-medium text-secondary-400">
						Dificultad: {exercise.difficulty}/5
					</span>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-[1fr,380px]">
				{/* Columna izquierda: Imagen + Descripción + Instrucciones + Detalles */}
				<div className="space-y-6">
					{/* Imagen y descripción */}
					<div className="overflow-hidden rounded-xl bg-surface shadow-lg">
						<Image
							alt={`Imagen de ${exercise.name}`}
							src={exercise.image || DefaultImage}
							width={600}
							height={400}
							className="h-64 w-full object-cover"
							priority
						/>

						<div className="p-6">
							<h3 className="mb-4 text-xl font-semibold">Sobre este ejercicio</h3>
							<p className="text-gray-400">
								{exercise.description || 'No hay descripción disponible para este ejercicio.'}
							</p>
						</div>
					</div>

					{/* Instrucciones */}
					<div className="rounded-xl bg-surface p-6 shadow-lg">
						<h3 className="mb-4 text-xl font-semibold">Instrucciones</h3>
						{exercise.instructions ? (
							<ol className="ml-5 list-decimal space-y-2 text-gray-400">
								{exercise.instructions.split('\n').map((instruction: string, index: number) => (
									<li key={index}>{instruction}</li>
								))}
							</ol>
						) : (
							<p className="text-gray-400">No hay instrucciones disponibles para este ejercicio.</p>
						)}
					</div>

					{/* Detalles */}
					<div className="rounded-xl bg-surface p-6 shadow-lg">
						<h3 className="mb-4 text-xl font-semibold">Detalles</h3>
						<div className="grid grid-cols-2 gap-4 text-gray-400">
							<div>
								<p className="font-medium text-white">Grupos musculares:</p>
								<p>{exercise.muscle_group?.join(', ') || 'No especificado'}</p>
							</div>
							<div>
								<p className="font-medium text-white">Dificultad:</p>
								<p>{exercise.difficulty}/5</p>
							</div>
							<div>
								<p className="font-medium text-white">Equipamiento:</p>
								<p>{exercise.equipment || 'Sin equipamiento'}</p>
							</div>
							<div>
								<p className="font-medium text-white">Tipo:</p>
								<p>{exercise.type || 'No especificado'}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Columna derecha: Árbol de Progresión */}
				<div className="lg:sticky lg:top-4 lg:self-start">
					<div className="rounded-xl bg-surface p-6 shadow-lg">
						<h3 className="mb-2 text-xl font-semibold">Árbol de Progresión</h3>
						<p className="mb-4 text-sm text-gray-400">
							Ejercicios relacionados por dificultad. Haz clic para ver detalles.
						</p>
						<ExerciseProgressionTree exerciseId={exercise.id} exerciseName={exercise.name} />
					</div>
				</div>
			</div>
		</div>
	);
}
