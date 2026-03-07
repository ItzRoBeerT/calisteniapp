'use client';

import { forwardRef, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { animate, utils as animeUtils } from 'animejs';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

// ── Anime.js: SVG stroke-draw on scroll ────────────────────────────────────
function StrokeIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
	const ref = useRef<HTMLDivElement>(null);
	const done = useRef(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const paths = Array.from(
			el.querySelectorAll<SVGGeometryElement>('path, polygon, polyline, circle, rect, line')
		);

		paths.forEach((p) => {
			const len = p.getTotalLength?.() ?? 100;
			p.style.strokeDasharray = `${len}`;
			p.style.strokeDashoffset = `${len}`;
			p.style.fill = 'none';
		});

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !done.current) {
					done.current = true;
					animate(paths, {
						strokeDashoffset: [parseFloat(paths[0]?.style.strokeDashoffset ?? '100'), 0],
						delay: animeUtils.stagger(60, { start: delay }),
						duration: 1100,
						ease: 'easeInOutSine',
					});
					observer.disconnect();
				}
			},
			{ threshold: 0.4 }
		);

		if (el) observer.observe(el);
		return () => observer.disconnect();
	}, [delay]);

	return <div ref={ref}>{children}</div>;
}

function AnimatedSection({
	children,
	className,
	style,
}: {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-80px' });
	return (
		<motion.section
			ref={ref}
			className={className}
			style={style}
			initial={{ opacity: 0, y: 60 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.section>
	);
}

interface ThreeColumnsSectionProps {
	exerciseCount: number;
}

const ThreeColumnsSection = forwardRef<HTMLElement, ThreeColumnsSectionProps>(
	function ThreeColumnsSection({ exerciseCount }, ref) {
		const t = useTranslations('HomePage');
		const fullBleed = 'relative left-1/2 -ml-[50vw] w-screen';

		return (
			<section
				ref={ref}
				className={`${fullBleed} bg-[#080808] flex flex-col md:h-screen md:overflow-hidden`}
			>
				{/* Tag bar */}
				<div
					className="flex flex-wrap items-center gap-3 px-6 md:px-14 border-b border-[#1A1A1A] bg-[#0D0D0D]"
					style={{ minHeight: 56 }}
				>
					<span
						className="text-white font-bold"
						style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18 }}
					>
						{t('features.tagline')}
					</span>
					<span
						className="text-[#444444]"
						style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}
					>
						{t('features.description')}
					</span>
				</div>

				{/* 3 columns — horizontal on desktop, stacked on mobile */}
				<div className="flex flex-col md:flex-row md:flex-1 md:min-h-0">
					{/* Col A — Ejercicios */}
					<AnimatedSection className="flex flex-col justify-center gap-6 md:gap-8 px-8 md:px-14 py-12 md:py-16 bg-[#0D0D1A] md:flex-1">
						<StrokeIcon delay={0}>
							<svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#A386FF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
								<path d="M6.5 6.5h.01M6.5 17.5h.01M17.5 6.5h.01M17.5 17.5h.01M3 6.5h3.5M3 17.5h3.5M17.5 6.5H21M17.5 17.5H21M6.5 3v3.5M17.5 3v3.5M6.5 17.5V21M17.5 17.5V21" />
							</svg>
						</StrokeIcon>
						<div>
							<h2
								className="font-bold text-white text-3xl md:text-4xl"
								style={{ fontFamily: 'Orbitron, sans-serif', lineHeight: 1 }}
							>
								{t('features.feature1.heading')}
							</h2>
							<p className="text-[#A386FF] font-semibold mt-2 text-base md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
								{t('features.feature1.libraryOf', { count: exerciseCount > 0 ? exerciseCount : 50 })}
							</p>
						</div>
						<p className="text-[#6B7280] leading-relaxed max-w-xs text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}>
							{t('features.feature1.description')}
						</p>
						<Link
							href="/exercises"
							className="self-start bg-[#A386FF] hover:bg-[#b89fff] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all"
						>
							{t('features.feature1.cta')}
						</Link>
					</AnimatedSection>

					{/* Divider */}
					<div className="h-px md:h-auto md:w-px bg-[#1A1A1A] shrink-0" />

					{/* Col B — Entrenamientos */}
					<AnimatedSection className="flex flex-col justify-center gap-6 md:gap-8 px-8 md:px-14 py-12 md:py-16 bg-[#0A120F] md:flex-1">
						<StrokeIcon delay={80}>
							<svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#32D74B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
								<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
							</svg>
						</StrokeIcon>
						<div>
							<h2
								className="font-bold text-white text-3xl md:text-4xl"
								style={{ fontFamily: 'Orbitron, sans-serif', lineHeight: 1 }}
							>
								{t('features.feature2.heading')}
							</h2>
							<p className="text-[#32D74B] font-semibold mt-2 text-base md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
								{t('features.feature2.aiSubtitle')}
							</p>
						</div>
						<p className="text-[#6B7280] leading-relaxed max-w-xs text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}>
							{t('features.feature2.description')}
						</p>
						<Link
							href="/workouts"
							className="self-start bg-[#32D74B] hover:bg-[#4fe063] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all"
						>
							{t('features.feature2.cta')}
						</Link>
					</AnimatedSection>

					{/* Divider */}
					<div className="h-px md:h-auto md:w-px bg-[#1A1A1A] shrink-0" />

					{/* Col C — Roadmaps */}
					<AnimatedSection className="flex flex-col justify-center gap-6 md:gap-8 px-8 md:px-14 py-12 md:py-16 bg-[#080D12] md:flex-1">
						<StrokeIcon delay={160}>
							<svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#03DAC5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
								<path d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
							</svg>
						</StrokeIcon>
						<div>
							<h2
								className="font-bold text-white text-3xl md:text-4xl"
								style={{ fontFamily: 'Orbitron, sans-serif', lineHeight: 1 }}
							>
								ROADMAPS
							</h2>
							<p className="text-[#03DAC5] font-semibold mt-2 text-base md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
								{t('features.feature3.subtitle')}
							</p>
						</div>
						<p className="text-[#6B7280] leading-relaxed max-w-xs text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}>
							{t('features.feature3.description')}
						</p>
						<Link
							href="/roadmaps"
							className="self-start bg-[#03DAC5] hover:bg-[#1de9d5] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all"
						>
							{t('features.feature3.cta')}
						</Link>
					</AnimatedSection>
				</div>
			</section>
		);
	}
);

export default ThreeColumnsSection;
