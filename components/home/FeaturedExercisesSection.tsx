'use client';

import type { ComponentProps } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import { createSlug } from '@/utils/slugs';
import type { Exercise } from '@/types/supabase';
import { AnimatedSection, StaggerContainer, StaggerItem } from './HomeAnimations';

type AppHref = ComponentProps<typeof Link>['href'];

const difficultyColor: Record<number, string> = {
	0: 'text-secondary-400 bg-secondary-900/50 border-secondary-700/30',
	1: 'text-secondary-400 bg-secondary-900/50 border-secondary-700/30',
	2: 'text-yellow-400 bg-yellow-900/50 border-yellow-700/30',
	3: 'text-orange-400 bg-orange-900/50 border-orange-700/30',
	4: 'text-red-400 bg-red-900/50 border-red-700/30',
	5: 'text-primary-400 bg-primary-900/50 border-primary-700/30',
};

export default function FeaturedExercisesSection({
	featuredExercises,
}: {
	featuredExercises: Exercise[];
}) {
	const t = useTranslations('HomePage');

	return (
		<AnimatedSection className="py-16 md:py-20">
			<motion.h2
				className="text-3xl md:text-4xl font-bold text-center mb-3 text-white"
				style={{ fontFamily: 'Orbitron, sans-serif' }}
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				{t('featuredExercises.title')}
			</motion.h2>
			<motion.p
				className="text-[#555555] text-sm md:text-base text-center mb-10 md:mb-12 max-w-xl mx-auto px-4"
				style={{ fontFamily: 'Space Grotesk, sans-serif' }}
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.15 }}
			>
				{t('featuredExercises.subtitle')}
			</motion.p>

			<StaggerContainer
				className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-6"
				staggerDelay={0.08}
			>
				{featuredExercises.map((ex) => (
					<StaggerItem key={ex.id}>
						<NavLink href={`/exercises/${createSlug(ex.name)}` as AppHref} className="group block">
							<motion.div
								className="rounded-xl bg-[#0D0D0D] border border-[#1A1A1A] overflow-hidden hover:border-primary-500/30 transition-colors duration-500"
								whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(163,134,255,0.15)' }}
								transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
							>
								<div className="relative aspect-[4/3] overflow-hidden">
									<Image
										src={ex.image}
										alt={ex.name}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
									<span
										className={`absolute top-2 right-2 px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColor[ex.difficulty] ?? difficultyColor[2]}`}
									>
										{t(`featuredExercises.difficulty.${ex.difficulty as 0 | 1 | 2 | 3 | 4 | 5}`)}
									</span>
								</div>
								<div className="p-3 md:p-4">
									<h3
										className="text-xs md:text-sm font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{ex.name}
									</h3>
									<div className="flex flex-wrap gap-1">
										{ex.muscle_group.slice(0, 2).map((mg) => (
											<span
												key={mg}
												className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#6B7280] text-xs"
												style={{ fontFamily: 'Space Grotesk, sans-serif' }}
											>
												{t(
													`featuredExercises.muscleGroups.${mg as 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'legs' | 'glutes'}`
												) || mg}
											</span>
										))}
									</div>
								</div>
							</motion.div>
						</NavLink>
					</StaggerItem>
				))}
			</StaggerContainer>

			<div className="flex justify-center">
				<NavLink
					href={'/exercises' as AppHref}
					className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
				>
					{t('featuredExercises.viewAll')}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
					</svg>
				</NavLink>
			</div>
		</AnimatedSection>
	);
}
