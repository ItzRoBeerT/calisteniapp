import { getExercisesByPage, getFilters } from '@/actions/exercise';
import ExerciseFilter from '@/components/exercises/Filter';
import ExercisesList from '@/components/exercises/List';
import RequestExerciseButton from '@/components/exercises/RequestExerciseButton';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
	title: 'Ejercicios',
	description:
		'Busca y encuentra los ejercicios que necesitas para mejorar tu fuerza y flexibilidad',
};

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function ExercisesPage({ params }: Props) {
	const { locale } = await params;
	const data = await getExercisesByPage(1, undefined, locale);
	const filters = await getFilters();

	const t = await getTranslations('ExercisesPage')

	return (
		<>
			<div className="flex items-center justify-between gap-4 mb-8">
				<h1
					className="text-4xl md:text-5xl font-bold text-white font-heading"
				>
					{t('title')}
				</h1>
				<RequestExerciseButton />
			</div>
			<section>
				<ExerciseFilter allFilters={filters} />
			</section>
			<section>
				<ExercisesList
					totalPages={data?.totalPages || 0}
					initalExercises={data?.exercises || []}
					locale={locale}
				/>
			</section>
		</>
	);
}
