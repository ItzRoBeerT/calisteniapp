import HomePageClient from '@/components/home/HomePageClient';
import { getExercises } from '@/actions/exercise';

export default async function Home() {
	const exercises = await getExercises();
	const exerciseCount = exercises?.length ?? 0;

	return <HomePageClient exerciseCount={exerciseCount} />;
}
