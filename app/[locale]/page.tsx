import HomeClient from '@/components/home/HomeClient';
import { getExercises } from '@/actions/exercise';

export default async function Home() {
	const exercises = await getExercises();
	const exerciseCount = exercises?.length ?? 0;
	const featuredExercises = exercises?.slice(0, 6) ?? [];

	return <HomeClient exerciseCount={exerciseCount} featuredExercises={featuredExercises} />;
}
