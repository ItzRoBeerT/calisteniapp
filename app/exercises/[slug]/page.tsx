import { getExerciseByName } from '@/actions/exercise';
import { desSlugify } from '@/utils/slugs';

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const exercise = await getExerciseByName(desSlugify(slug));
	if (!exercise) {
		return null;
	}
	console.log(exercise);
	return <div>My Post: {exercise.name}</div>;
}
