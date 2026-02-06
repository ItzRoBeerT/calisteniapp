import Image from 'next/image';
import { getExerciseByName } from '@/actions/exercise';
import { desSlugify } from '@/utils/slugs';
import DefaultImage from '@/public/images/default_image.webp';
import { NotFoundError } from '@/utils/errors';
import ExerciseProgressionTree from '@/components/exercises/ExerciseProgressionTree';
import type { ExerciseResource } from '@/types/supabase';
import { getTranslations } from 'next-intl/server';

function getYouTubeEmbedUrl(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
	];
	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return `https://www.youtube.com/embed/${match[1]}`;
		}
	}
	return null;
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) {
	const { slug, locale } = await params;
	const exercise = await getExerciseByName(desSlugify(slug), locale);
	const t = await getTranslations('ExerciseDetail');

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
						{t('difficulty')}: {exercise.difficulty}/5
					</span>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-[1fr,380px]">
				{/* Columna izquierda: Todo en una sola card */}
				<div className="overflow-hidden rounded-xl bg-surface shadow-lg">
					{/* Video Tutorial */}
					{exercise.resources && exercise.resources.length > 0 && exercise.resources.some((r: ExerciseResource) => r.type === 'video') ? (
						<div className="aspect-video w-full">
							{(() => {
								const videoResource = exercise.resources.find((r: ExerciseResource) => r.type === 'video');
								const embedUrl = videoResource ? getYouTubeEmbedUrl(videoResource.url) : null;
								return embedUrl ? (
									<iframe
										src={embedUrl}
										title={videoResource?.title || exercise.name}
										className="h-full w-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								) : (
									<Image
										alt={`Imagen de ${exercise.name}`}
										src={exercise.image || DefaultImage}
										width={600}
										height={400}
										className="h-64 w-full object-cover"
										priority
									/>
								);
							})()}
						</div>
					) : (
						<Image
							alt={`Imagen de ${exercise.name}`}
							src={exercise.image || DefaultImage}
							width={600}
							height={400}
							className="h-64 w-full object-cover"
							priority
						/>
					)}

					<div className="p-6 space-y-6">
						{/* Descripción */}
						<div>
							<h3 className="mb-4 text-xl font-semibold">{t('aboutExercise')}</h3>
							<p className="text-gray-400">
								{exercise.description || t('noDescription')}
							</p>
						</div>

						{/* Instrucciones */}
						<div>
							<h3 className="mb-4 text-xl font-semibold">{t('instructions')}</h3>
							{exercise.instructions ? (
								<ol className="ml-5 list-decimal space-y-2 text-gray-400">
									{exercise.instructions.split('\n').map((instruction: string, index: number) => (
										<li key={index}>{instruction}</li>
									))}
								</ol>
							) : (
								<p className="text-gray-400">{t('noInstructions')}</p>
							)}
						</div>

						{/* Detalles */}
						<div>
							<h3 className="mb-4 text-xl font-semibold">{t('details')}</h3>
							<div className="grid grid-cols-2 gap-4 text-gray-400">
								<div>
									<p className="font-medium text-white">{t('muscleGroups')}:</p>
									<p>{exercise.muscle_group?.join(', ') || t('notSpecified')}</p>
								</div>
								<div>
									<p className="font-medium text-white">{t('equipment')}:</p>
									<p>
										{exercise.equipment && exercise.equipment.length > 0
											? exercise.equipment
												.filter((eq: string) => eq !== 'none')
												.map((eq: string) => t.has(`equipmentTypes.${eq}` as Parameters<typeof t>[0]) ? t(`equipmentTypes.${eq}` as Parameters<typeof t>[0]) : eq)
												.join(', ') || t('noEquipment')
											: t('noEquipment')}
									</p>
								</div>
								<div>
									<p className="font-medium text-white">{t('type')}:</p>
									<p>{exercise.type && t.has(`exerciseTypes.${exercise.type}` as Parameters<typeof t>[0]) ? t(`exerciseTypes.${exercise.type}` as Parameters<typeof t>[0]) : t('notSpecified')}</p>
								</div>
								<div>
									<p className="font-medium text-white">{t('category')}:</p>
									<p>{exercise.category && t.has(`categoryTypes.${exercise.category}` as Parameters<typeof t>[0]) ? t(`categoryTypes.${exercise.category}` as Parameters<typeof t>[0]) : t('notSpecified')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Columna derecha: Árbol de Progresión */}
				<div className="lg:sticky lg:top-4 lg:self-start">
					<div className="rounded-xl bg-surface p-4 shadow-lg">
						<ExerciseProgressionTree exerciseId={exercise.id} exerciseName={exercise.name} />
					</div>
				</div>
			</div>
		</div>
	);
}
