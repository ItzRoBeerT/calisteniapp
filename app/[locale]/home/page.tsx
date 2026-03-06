import HomePageV2 from '@/components/home/HomePageV2';
import { getExercises } from '@/actions/exercise';

export default async function HomePage() {
	const exercises = await getExercises();
	const exerciseCount = exercises?.length ?? 0;
	const featuredExercises = exercises?.slice(0, 6) ?? [];

	return <HomePageV2 exerciseCount={exerciseCount} featuredExercises={featuredExercises} />;
}
