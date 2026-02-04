import { getExercisesByPage, getFilters } from '@/actions/exercise';
import ExerciseFilter from '@/components/exercises/Filter';
import ExercisesList from '@/components/exercises/List';
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
			<h1 className="text-4xl text-center font-bold">
				{t('title')}
			</h1>
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
