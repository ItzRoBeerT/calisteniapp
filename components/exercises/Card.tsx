'use client';

import { Exercise } from '@/types/supabase';
import Image from 'next/image';
import DefaultImage from '@/public/images/default_image.webp';
import { createSlug } from '@/utils/slugs';
import React from 'react';
import { Link } from '@/i18n/navigation';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

const difficultyColor: Record<number, string> = {
	0: 'text-secondary-400 bg-secondary-900/50 border-secondary-700/30',
	1: 'text-secondary-400 bg-secondary-900/50 border-secondary-700/30',
	2: 'text-yellow-400 bg-yellow-900/50 border-yellow-700/30',
	3: 'text-orange-400 bg-orange-900/50 border-orange-700/30',
	4: 'text-red-400 bg-red-900/50 border-red-700/30',
	5: 'text-primary-400 bg-primary-900/50 border-primary-700/30',
};

type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'legs' | 'glutes';
type DifficultyLevel = 0 | 1 | 2 | 3 | 4 | 5;

const ExerciseCard = React.memo(function ExerciseCard({ exercise }: { exercise: Exercise }) {
	const t = useTranslations('ExerciseCard');

	return (
		<Link
			href={{ pathname: '/exercises/[slug]', params: { slug: createSlug(exercise.name) } }}
			className="group block"
		>
			<motion.article
				className="rounded-xl bg-[#0D0D0D] border border-[#1A1A1A] overflow-hidden hover:border-primary-500/30 transition-colors duration-500"
				whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(163,134,255,0.15)' }}
				transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
			>
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={exercise.image || DefaultImage}
						alt={exercise.name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
					<span
						className={`absolute top-2 right-2 px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColor[exercise.difficulty] ?? difficultyColor[2]}`}
					>
						{t(`difficulty.${exercise.difficulty as DifficultyLevel}`)}
					</span>
				</div>
				<div className="p-3 md:p-4">
					<h2
						className="text-xs md:text-sm font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1"
						style={{ fontFamily: 'Orbitron, sans-serif' }}
					>
						{exercise.name}
					</h2>
					<div className="flex flex-wrap gap-1">
						{exercise.muscle_group.slice(0, 2).map((mg) => (
							<span
								key={mg}
								className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#6B7280] text-xs"
								style={{ fontFamily: 'Space Grotesk, sans-serif' }}
							>
								{t(`muscleGroups.${mg as MuscleGroup}`) || mg}
							</span>
						))}
					</div>
				</div>
			</motion.article>
		</Link>
	);
});

export default ExerciseCard;
