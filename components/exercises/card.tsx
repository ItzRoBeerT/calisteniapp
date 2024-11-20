import { Exercise } from '@/types/supabase';
import Image from 'next/image';
import ThumbUp from '@/public/thumb-up.svg';
import DefaultImage from '@/public/images/default_image.webp';
import { createSlug } from '@/utils/slugs';
import Link from 'next/link';
import React from 'react';

const ExerciseCard = React.memo(function ExerciseCard({
	exercise,
}: {
	exercise: Exercise;
}) {
	console.log(exercise);
	return (
		<article className=" flex flex-col items-center gap-2 rounded-xl p-4 bg-surface">
			<Link
				href={`/exercises/${createSlug(exercise.name)}`}
				className="text-center flex flex-col gap-2"
			>
				<Image
					src={exercise.image || DefaultImage}
					alt="exercise image"
					width={300}
					height={172}
					className="rounded-lg"
				/>
				<h2 className="text-2xl">{exercise.name}</h2>
			</Link>
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
});

export default ExerciseCard;
