'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { animate } from 'animejs';
import { useTranslations } from 'next-intl';
import { AnimatedSection, StaggerContainer, StaggerItem } from './HomeAnimations';

const fullBleed = 'relative left-1/2 -ml-[50vw] w-screen';

function CountUp({
	countTo,
	prefix = '',
	suffix = '',
}: {
	countTo: number;
	prefix?: string;
	suffix?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const done = useRef(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || countTo === 0) return;

		const obj = { val: 0 };

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !done.current) {
					done.current = true;
					animate(obj, {
						val: countTo,
						duration: 1800,
						ease: 'easeOutExpo',
						onUpdate() {
							el.textContent = prefix + Math.round(obj.val) + suffix;
						},
						onComplete() {
							el.textContent = prefix + countTo + suffix;
						},
					});
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [countTo, prefix, suffix]);

	return (
		<span ref={ref}>
			{prefix}0{suffix}
		</span>
	);
}

export default function StatsSection({ exerciseCount }: { exerciseCount: number }) {
	const t = useTranslations('HomePage');

	const stats = [
		{ countTo: 32, prefix: '', suffix: '%', gradient: 'from-white to-[#A386FF]', label: t('featuredSection.stat1') },
		{ countTo: 3, prefix: '0–', suffix: '', gradient: 'from-white to-[#32D74B]', label: t('featuredSection.stat2') },
		{ countTo: 2, prefix: '', suffix: ` ${t('featuredSection.weeks')}`, gradient: 'from-white to-[#03DAC5]', label: t('featuredSection.stat3') },
		{ countTo: exerciseCount > 0 ? exerciseCount : 60, prefix: '', suffix: '+', gradient: 'from-white to-[#A386FF]', label: t('featuredSection.stat4') },
	];

	return (
		<AnimatedSection
			className={`${fullBleed} py-16 md:py-20 px-6 md:px-14`}
			style={{ background: 'linear-gradient(135deg, #1A0D33 0%, #0D1A0D 50%, #0D1A1A 100%)' }}
		>
			<motion.h2
				className="text-3xl md:text-4xl font-bold text-center text-white mb-3 max-w-2xl mx-auto px-4"
				style={{ fontFamily: 'Orbitron, sans-serif' }}
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				{t('featuredSection.title')}
			</motion.h2>
			<motion.p
				className="text-[#666666] text-sm md:text-base text-center mb-10 md:mb-12 max-w-lg mx-auto px-4"
				style={{ fontFamily: 'Space Grotesk, sans-serif' }}
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.15 }}
			>
				{t('featuredSection.subtitle')}
			</motion.p>

			<StaggerContainer
				className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto"
				staggerDelay={0.12}
			>
				{stats.map((stat, i) => (
					<StaggerItem key={i}>
						<motion.div
							className="flex flex-col items-center text-center p-5 md:p-8 rounded-2xl border border-white/10"
							style={{ background: 'rgba(255,255,255,0.04)' }}
							whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.03 }}
							transition={{ duration: 0.25 }}
						>
							<p
								className={`text-4xl md:text-5xl font-bold bg-gradient-to-b ${stat.gradient} bg-clip-text text-transparent mb-3`}
								style={{ fontFamily: 'Orbitron, sans-serif' }}
							>
								<CountUp countTo={stat.countTo} prefix={stat.prefix} suffix={stat.suffix} />
							</p>
							<p
								className="text-[#AAAAAA] text-xs md:text-sm leading-snug"
								style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.4 }}
							>
								{stat.label}
							</p>
						</motion.div>
					</StaggerItem>
				))}
			</StaggerContainer>
		</AnimatedSection>
	);
}
