import { Exercise } from '@/types/supabase';
import Image from 'next/image';
import ThumbUp from '@/public/thumb-up.svg';
import DefaultImage from '@/public/images/default_image.webp';

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
	console.log(exercise);
	return (
		<article className=" flex flex-col items-center gap-2 rounded-xl p-4 bg-surface hover:scale-105 transition-all duration-300">
			<Image
				src={exercise.image || DefaultImage}
				alt="exercise image"
				width={300}
				height={172}
				className="rounded-lg"
			/>
			<h2 className="text-2xl">{exercise.name}</h2>

			<div className="flex gap-4 w-full">
				<button className="bg-primary rounded">
					<Image src={ThumbUp} alt="thumb-up" />
				</button>
				<button className="bg-primary rounded">
					<Image
						className="rotate-180"
						src={ThumbUp}
						alt="thumb-up"
					/>
				</button>
				<label>
					{exercise.likes?.length || 0}{' '}
					{exercise.likes?.length === 1 ? 'like' : 'likes'}
				</label>
			</div>
		</article>
	);
}
