'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { AnimatedSection, StaggerContainer, StaggerItem } from './HomeAnimations';

export default function FaqSection() {
	const t = useTranslations('HomePage');
	const [openFaq, setOpenFaq] = useState<number | null>(null);

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
				{t('faq.title')}
			</motion.h2>
			<motion.p
				className="text-[#555555] text-sm md:text-base text-center mb-10 md:mb-12 max-w-xl mx-auto px-4"
				style={{ fontFamily: 'Space Grotesk, sans-serif' }}
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.15 }}
			>
				{t('faq.subtitle')}
			</motion.p>

			<StaggerContainer className="space-y-3 max-w-3xl mx-auto" staggerDelay={0.08}>
				{([1, 2, 3, 4, 5] as const).map((i) => (
					<StaggerItem key={i}>
						<div className="rounded-xl border border-[#1A1A1A] bg-[#0D0D0D] overflow-hidden">
							<button
								className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left hover:bg-white/[0.03] transition-colors"
								onClick={() => setOpenFaq(openFaq === i ? null : i)}
							>
								<span
									className="font-semibold text-white text-sm md:text-base"
									style={{ fontFamily: 'Space Grotesk, sans-serif' }}
								>
									{t(`faq.q${i}.question`)}
								</span>
								<motion.svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-4 h-4 shrink-0 text-[#555555]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									animate={{ rotate: openFaq === i ? 180 : 0 }}
									transition={{ duration: 0.25 }}
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
								</motion.svg>
							</button>
							<motion.div
								initial={false}
								animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
								transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
								className="overflow-hidden"
							>
								<p
									className="px-5 md:px-6 pb-5 text-[#6B7280] text-sm leading-relaxed border-t border-[#1A1A1A] pt-4"
									style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}
								>
									{t(`faq.q${i}.answer`)}
								</p>
							</motion.div>
						</div>
					</StaggerItem>
				))}
			</StaggerContainer>
		</AnimatedSection>
	);
}
