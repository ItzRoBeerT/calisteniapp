'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AnimatedSection } from './HomeAnimations';

const fullBleed = 'relative left-1/2 -ml-[50vw] w-screen';

export default function CtaSection() {
	const t = useTranslations('HomePage');

	return (
		<AnimatedSection className={`${fullBleed} bg-[#080808] py-16 md:py-20 px-6 md:px-14`}>
			<div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6 md:gap-8">
				<motion.h2
					className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					{t('cta.title')}
				</motion.h2>
				<motion.p
					className="text-[#6B7280] text-base md:text-lg leading-relaxed px-2"
					style={{ lineHeight: 1.5 }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					{t('cta.description')}
				</motion.p>
				<motion.div
					className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
				>
					<Link
						href="/workouts/new"
						className="inline-flex items-center justify-center gap-2 px-7 md:px-9 py-4 rounded-xl bg-[#32D74B] hover:bg-[#4fe063] text-[#0C0C0C] font-bold text-sm md:text-base transition-all"
					>
						{t('cta.createWorkout')}
					</Link>
					<Link
						href="/blog"
						className="inline-flex items-center justify-center gap-2 px-7 md:px-9 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm md:text-base transition-all"
					>
						{t('cta.visitBlog')}
					</Link>
				</motion.div>
			</div>
		</AnimatedSection>
	);
}
