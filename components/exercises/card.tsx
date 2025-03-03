import { Exercise } from '@/types/supabase';
import Image from 'next/image';
import DefaultImage from '@/public/images/default_image.webp';
import { createSlug } from '@/utils/slugs';
import Link from 'next/link';
import React from 'react';

const ExerciseCard = React.memo(function ExerciseCard({
	exercise,
}: {
	exercise: Exercise;
}) {
	return (
		<article className=" flex flex-col items-center justify-center gap-2 rounded-xl p-4 h-80 bg-surface">
			<Link
				href={`/exercises/${createSlug(exercise.name)}`}
				className="text-center flex flex-col gap-2"
			>
				<div className="h-52">
					<Image
						src={exercise.image || DefaultImage}
						alt="exercise image"
						width={300}
						height={172}
						className="h-full object-cover rounded-lg"
					/>
				</div>
				<h2 className="text-2xl">{exercise.name}</h2>
			</Link>
		</article>
	);
});

export default ExerciseCard;
