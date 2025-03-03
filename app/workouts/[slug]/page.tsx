import { getWorkout } from '@/actions/workout';

export default async function WorkoutDetail({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const workout = await getWorkout(slug);
	console.log(workout);
	return <>Hola</>;
}
