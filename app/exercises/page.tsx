import { getExercise } from "@/actions/exercise";

export default async function Exercises() {
	await getExercise(2);
	return (
		<>
			<h1>Ejercicios</h1>
		</>
	);
}
