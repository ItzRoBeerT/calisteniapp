'use client';

import type { ComponentProps } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import type { Exercise } from '@/types/supabase';
import { AnimatedSection, StaggerContainer, StaggerItem } from './HomeAnimations';
import ExerciseCard from '@/components/exercises/Card';

type AppHref = ComponentProps<typeof Link>['href'];

export default function FeaturedExercisesSection({
	featuredExercises,
}: {
	featuredExercises: Exercise[];
}) {
	const t = useTranslations('HomePage');

	return (
		<AnimatedSection className="py-16 md:py-20">
			<motion.h2
				className="text-3xl md:text-4xl font-bold text-center mb-3 text-white font-heading"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				{t('featuredExercises.title')}
			</motion.h2>
			<motion.p
				className="text-[#555555] text-sm md:text-base text-center mb-10 md:mb-12 max-w-xl mx-auto px-4"
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
						<ExerciseCard exercise={ex} />
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
