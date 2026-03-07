'use client';

import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { AnimatedSection, StaggerContainer, StaggerItem } from './HomeAnimations';

const HowItWorksSection = forwardRef<HTMLDivElement>(function HowItWorksSection(_, ref) {
	const t = useTranslations('HomePage');

	return (
		<div ref={ref}>
			<AnimatedSection className="py-16 md:py-20 px-0">
				<motion.h2
					className="text-3xl md:text-4xl font-bold text-center mb-3 text-white"
					style={{ fontFamily: 'Orbitron, sans-serif' }}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					{t('howItWorks.title')}
				</motion.h2>
				<motion.p
					className="text-[#555555] text-sm md:text-base text-center mb-10 md:mb-12 max-w-xl mx-auto px-4"
					style={{ fontFamily: 'Space Grotesk, sans-serif' }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					{t('howItWorks.subtitle')}
				</motion.p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
					{/* Workouts path */}
					<StaggerContainer
						className="p-7 md:p-10 rounded-2xl bg-[#0D0D0D] border border-[#32D74B]/10 space-y-5 md:space-y-6"
						staggerDelay={0.12}
					>
						<StaggerItem>
							<h3
								className="text-base md:text-lg font-bold text-[#32D74B]"
								style={{ fontFamily: 'Orbitron, sans-serif' }}
							>
								{t('howItWorks.workouts.title')}
							</h3>
						</StaggerItem>
						{([1, 2, 3] as const).map((step) => (
							<StaggerItem key={step}>
								<div className="flex items-start gap-4">
									<span
										className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border bg-[#32D74B]/10 border-[#32D74B]/30 text-[#32D74B]"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{String(step).padStart(2, '0')}
									</span>
									<div>
										<p
											className="font-semibold text-white text-sm mb-1"
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											{t(`howItWorks.workouts.step${step}.title`)}
										</p>
										<p
											className="text-[#6B7280] text-sm leading-relaxed"
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											{t(`howItWorks.workouts.step${step}.description`)}
										</p>
									</div>
								</div>
							</StaggerItem>
						))}
					</StaggerContainer>

					{/* Roadmaps path */}
					<StaggerContainer
						className="p-7 md:p-10 rounded-2xl bg-[#080D12] border border-[#03DAC5]/10 space-y-5 md:space-y-6"
						staggerDelay={0.12}
					>
						<StaggerItem>
							<h3
								className="text-base md:text-lg font-bold text-[#03DAC5]"
								style={{ fontFamily: 'Orbitron, sans-serif' }}
							>
								{t('howItWorks.roadmaps.title')}
							</h3>
						</StaggerItem>
						{([1, 2, 3] as const).map((step) => (
							<StaggerItem key={step}>
								<div className="flex items-start gap-4">
									<span
										className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border bg-[#03DAC5]/10 border-[#03DAC5]/30 text-[#03DAC5]"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{String(step).padStart(2, '0')}
									</span>
									<div>
										<p
											className="font-semibold text-white text-sm mb-1"
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											{t(`howItWorks.roadmaps.step${step}.title`)}
										</p>
										<p
											className="text-[#6B7280] text-sm leading-relaxed"
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											{t(`howItWorks.roadmaps.step${step}.description`)}
										</p>
									</div>
								</div>
							</StaggerItem>
						))}
					</StaggerContainer>
				</div>
			</AnimatedSection>
		</div>
	);
});

export default HowItWorksSection;
