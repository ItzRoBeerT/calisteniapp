'use client';

import { useRef, useState, useEffect, type ComponentProps } from 'react';
import { motion, useInView } from 'motion/react';
import { animate, utils as animeUtils } from 'animejs';
import NavLink from '@/components/header/NavLink';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { Exercise } from '@/types/supabase';
import { createSlug } from '@/utils/slugs';
import HeroSection from '@/components/home/HeroSection';

type AppHref = ComponentProps<typeof Link>['href'];

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

		// Pre-set dasharray / dashoffset so strokes start hidden
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

// ── Anime.js: Count-up on scroll ───────────────────────────────────────────
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

// ── Framer Motion helpers (unchanged) ─────────────────────────────────────
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

function StaggerContainer({
	children,
	className,
	staggerDelay = 0.1,
}: {
	children: React.ReactNode;
	className?: string;
	staggerDelay?: number;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-60px' });
	return (
		<motion.div
			ref={ref}
			className={className}
			initial="hidden"
			animate={isInView ? 'visible' : 'hidden'}
			variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
		>
			{children}
		</motion.div>
	);
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, y: 40, scale: 0.95 },
				visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
			}}
		>
			{children}
		</motion.div>
	);
}

const difficultyColor: Record<number, string> = {
	0: 'text-secondary-400 bg-secondary-900/50 border-secondary-700/30',
	1: 'text-secondary-400 bg-secondary-900/50 border-secondary-700/30',
	2: 'text-yellow-400 bg-yellow-900/50 border-yellow-700/30',
	3: 'text-orange-400 bg-orange-900/50 border-orange-700/30',
	4: 'text-red-400 bg-red-900/50 border-red-700/30',
	5: 'text-primary-400 bg-primary-900/50 border-primary-700/30',
};

export default function HomePageV2({
	exerciseCount,
	featuredExercises,
}: {
	exerciseCount: number;
	featuredExercises: Exercise[];
}) {
	const t = useTranslations('HomePage');
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	const heroRef = useRef<HTMLElement>(null);
	const featuresRef = useRef<HTMLElement>(null);
	const howItWorksRef = useRef<HTMLDivElement>(null);

	// Snap scroll: hero → v7section
	useEffect(() => {
		const hero = heroRef.current;
		const features = featuresRef.current;
		if (!hero || !features) return;

		let locked = false;

		const releaseLock = () => {
			locked = false;
		};

		const snapAndLock = (scrollAction: () => void) => {
			locked = true;
			scrollAction();
			// Release when scroll animation ends (with fallback timeout)
			let fallback: ReturnType<typeof setTimeout>;
			const onScrollEnd = () => {
				clearTimeout(fallback);
				releaseLock();
			};
			window.addEventListener('scrollend', onScrollEnd, { once: true });
			fallback = setTimeout(() => {
				window.removeEventListener('scrollend', onScrollEnd);
				releaseLock();
			}, 1500);
		};

		const onWheel = (e: WheelEvent) => {
			if (locked || window.innerWidth < 768) return;
			const sy = window.scrollY;
			const heroH = hero.offsetHeight;
			const featuresH = features.offsetHeight;
			const howItWorks = howItWorksRef.current;

			const howItWorksTop = howItWorks
				? howItWorks.getBoundingClientRect().top + sy
				: Infinity;
			const howItWorksH = howItWorks?.offsetHeight ?? 0;

			if (e.deltaY > 0 && sy < heroH) {
				// Hero → Features
				e.preventDefault();
				snapAndLock(() => features.scrollIntoView({ behavior: 'smooth', block: 'start' }));
			} else if (sy >= heroH && sy < heroH + featuresH) {
				if (e.deltaY < 0) {
					// Features → Hero
					e.preventDefault();
					snapAndLock(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
				} else if (e.deltaY > 0 && howItWorks) {
					// Features → How It Works
					e.preventDefault();
					snapAndLock(() => howItWorks.scrollIntoView({ behavior: 'smooth', block: 'start' }));
				}
			} else if (howItWorks && e.deltaY < 0 && sy >= howItWorksTop && sy < howItWorksTop + howItWorksH) {
				// How It Works → Features
				e.preventDefault();
				snapAndLock(() => features.scrollIntoView({ behavior: 'smooth', block: 'start' }));
			}
		};

		window.addEventListener('wheel', onWheel, { passive: false });
		return () => window.removeEventListener('wheel', onWheel);
	}, []);

	// Full-bleed helper: breaks out of the `container mx-auto px-6` layout
	const fullBleed = 'relative left-1/2 -ml-[50vw] w-screen';

	return (
		<div className="w-full -mt-4">

			{/* ── Hero ──────────────────────────────────────────────────── */}
			<HeroSection ref={heroRef} />

			{/* ── Features (v7section) ──────────────────────────────────── */}
			<section ref={featuresRef} className={`${fullBleed} bg-[#080808] flex flex-col md:h-screen md:overflow-hidden`}>
				{/* Tag bar */}
				<div
					className="flex flex-wrap items-center gap-3 px-6 md:px-14 border-b border-[#1A1A1A] bg-[#0D0D0D]"
					style={{ minHeight: 56 }}
				>
					<span
						className="text-white font-bold"
						style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18 }}
					>
						Elige tu camino.
					</span>
					<span
						className="text-[#444444]"
						style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}
					>
						Calistenia completa. Gratis. Open source.
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
								EJERCICIOS
							</h2>
							<p className="text-[#A386FF] font-semibold mt-2 text-base md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
								Biblioteca de {exerciseCount > 0 ? `${exerciseCount}+` : '50+'}
							</p>
						</div>
						<p className="text-[#6B7280] leading-relaxed max-w-xs text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}>
							{t('features.feature1.description')}
						</p>
						<Link
							href="/exercises"
							className="self-start bg-[#A386FF] hover:bg-[#b89fff] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all"
						>
							Explorar ejercicios →
						</Link>
					</AnimatedSection>

					{/* Divider — vertical on desktop, horizontal on mobile */}
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
								ENTRE&shy;NA&shy;MIENTOS
							</h2>
							<p className="text-[#32D74B] font-semibold mt-2 text-base md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
								Rutinas con IA integrada
							</p>
						</div>
						<p className="text-[#6B7280] leading-relaxed max-w-xs text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}>
							{t('features.feature2.description')}
						</p>
						<Link
							href="/workouts"
							className="self-start bg-[#32D74B] hover:bg-[#4fe063] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all"
						>
							Crear entrenamiento →
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
								Del cero al experto
							</p>
						</div>
						<p className="text-[#6B7280] leading-relaxed max-w-xs text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6 }}>
							{t('features.feature3.description')}
						</p>
						<Link
							href="/roadmaps"
							className="self-start bg-[#03DAC5] hover:bg-[#1de9d5] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all"
						>
							Ver roadmaps →
						</Link>
					</AnimatedSection>
				</div>
			</section>

			{/* ── How It Works ─────────────────────────────────────────── */}
			<div ref={howItWorksRef}>
			<AnimatedSection className="py-20 px-0">
				<motion.h2
					className="text-4xl font-bold text-center mb-3 text-white"
					style={{ fontFamily: 'Orbitron, sans-serif' }}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					{t('howItWorks.title')}
				</motion.h2>
				<motion.p
					className="text-[#555555] text-base text-center mb-12 max-w-xl mx-auto"
					style={{ fontFamily: 'Space Grotesk, sans-serif' }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					{t('howItWorks.subtitle')}
				</motion.p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Workouts path */}
					<StaggerContainer
						className="p-10 rounded-2xl bg-[#0D0D0D] border border-[#32D74B]/10 space-y-6"
						staggerDelay={0.12}
					>
						<StaggerItem>
							<h3 className="text-lg font-bold text-[#32D74B]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
								{t('howItWorks.workouts.title')}
							</h3>
						</StaggerItem>
						{([1, 2, 3] as const).map((step) => (
							<StaggerItem key={step}>
								<div className="flex items-start gap-4">
									<span
										className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border bg-[#32D74B]/10 border-[#32D74B]/30 text-[#32D74B]"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{String(step).padStart(2, '0')}
									</span>
									<div>
										<p className="font-semibold text-white text-sm mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
											{t(`howItWorks.workouts.step${step}.title`)}
										</p>
										<p className="text-[#6B7280] text-sm leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
											{t(`howItWorks.workouts.step${step}.description`)}
										</p>
									</div>
								</div>
							</StaggerItem>
						))}
					</StaggerContainer>

					{/* Roadmaps path */}
					<StaggerContainer
						className="p-10 rounded-2xl bg-[#080D12] border border-[#03DAC5]/10 space-y-6"
						staggerDelay={0.12}
					>
						<StaggerItem>
							<h3 className="text-lg font-bold text-[#03DAC5]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
								{t('howItWorks.roadmaps.title')}
							</h3>
						</StaggerItem>
						{([1, 2, 3] as const).map((step) => (
							<StaggerItem key={step}>
								<div className="flex items-start gap-4">
									<span
										className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border bg-[#03DAC5]/10 border-[#03DAC5]/30 text-[#03DAC5]"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{String(step).padStart(2, '0')}
									</span>
									<div>
										<p className="font-semibold text-white text-sm mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
											{t(`howItWorks.roadmaps.step${step}.title`)}
										</p>
										<p className="text-[#6B7280] text-sm leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
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

			{/* ── Featured Exercises ───────────────────────────────────── */}
			<AnimatedSection className="py-20">
				<motion.h2
					className="text-4xl font-bold text-center mb-3 text-white"
					style={{ fontFamily: 'Orbitron, sans-serif' }}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					{t('featuredExercises.title')}
				</motion.h2>
				<motion.p
					className="text-[#555555] text-base text-center mb-12 max-w-xl mx-auto"
					style={{ fontFamily: 'Space Grotesk, sans-serif' }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					{t('featuredExercises.subtitle')}
				</motion.p>

				<StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6" staggerDelay={0.08}>
					{featuredExercises.map((ex) => (
						<StaggerItem key={ex.id}>
							<NavLink href={`/exercises/${createSlug(ex.name)}` as AppHref} className="group block">
								<motion.div
									className="rounded-xl bg-[#0D0D0D] border border-[#1A1A1A] overflow-hidden hover:border-primary-500/30 transition-colors duration-500"
									whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(163,134,255,0.15)' }}
									transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
								>
									<div className="relative aspect-[4/3] overflow-hidden">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={ex.image}
											alt={ex.name}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
										<span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColor[ex.difficulty] ?? difficultyColor[2]}`}>
											{t(`featuredExercises.difficulty.${ex.difficulty as 0 | 1 | 2 | 3 | 4 | 5}`)}
										</span>
									</div>
									<div className="p-4">
										<h3
											className="text-sm font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1"
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
													{t(`featuredExercises.muscleGroups.${mg as 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'legs' | 'glutes'}`) || mg}
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
						className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
					>
						{t('featuredExercises.viewAll')}
						<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
						</svg>
					</NavLink>
				</div>
			</AnimatedSection>

			{/* ── Stats Section ────────────────────────────────────────── */}
			<AnimatedSection className={`${fullBleed} py-20 px-14`} style={{ background: 'linear-gradient(135deg, #1A0D33 0%, #0D1A0D 50%, #0D1A1A 100%)' }}>
				<motion.h2
					className="text-4xl font-bold text-center text-white mb-3 max-w-2xl mx-auto"
					style={{ fontFamily: 'Orbitron, sans-serif' }}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					{t('featuredSection.title')}
				</motion.h2>
				<motion.p
					className="text-[#666666] text-base text-center mb-12 max-w-lg mx-auto"
					style={{ fontFamily: 'Space Grotesk, sans-serif' }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					{t('featuredSection.subtitle')}
				</motion.p>

				<StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto" staggerDelay={0.12}>
					{[
						{ countTo: 32, prefix: '', suffix: '%', gradient: 'from-white to-[#A386FF]', label: t('featuredSection.stat1') },
						{ countTo: 3, prefix: '0–', suffix: '', gradient: 'from-white to-[#32D74B]', label: t('featuredSection.stat2') },
						{ countTo: 2, prefix: '', suffix: ` ${t('featuredSection.weeks')}`, gradient: 'from-white to-[#03DAC5]', label: t('featuredSection.stat3') },
						{ countTo: exerciseCount > 0 ? exerciseCount : 60, prefix: '', suffix: '+', gradient: 'from-white to-[#A386FF]', label: t('featuredSection.stat4') },
					].map((stat, i) => (
						<StaggerItem key={i}>
							<motion.div
								className="flex flex-col items-center text-center p-8 rounded-2xl border border-white/10"
								style={{ background: 'rgba(255,255,255,0.04)' }}
								whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.03 }}
								transition={{ duration: 0.25 }}
							>
								<p
									className={`text-5xl font-bold bg-gradient-to-b ${stat.gradient} bg-clip-text text-transparent mb-3`}
									style={{ fontFamily: 'Orbitron, sans-serif' }}
								>
									{/* anime.js count-up */}
									<CountUp countTo={stat.countTo} prefix={stat.prefix} suffix={stat.suffix} />
								</p>
								<p className="text-[#AAAAAA] text-sm leading-snug" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.4 }}>
									{stat.label}
								</p>
							</motion.div>
						</StaggerItem>
					))}
				</StaggerContainer>
			</AnimatedSection>

			{/* ── FAQ ──────────────────────────────────────────────────── */}
			<AnimatedSection className="py-20">
				<motion.h2
					className="text-4xl font-bold text-center mb-3 text-white"
					style={{ fontFamily: 'Orbitron, sans-serif' }}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					{t('faq.title')}
				</motion.h2>
				<motion.p
					className="text-[#555555] text-base text-center mb-12 max-w-xl mx-auto"
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
									className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.03] transition-colors"
									onClick={() => setOpenFaq(openFaq === i ? null : i)}
								>
									<span
										className="font-semibold text-white"
										style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15 }}
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
										className="px-6 pb-5 text-[#6B7280] text-sm leading-relaxed border-t border-[#1A1A1A] pt-4"
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

			{/* ── Final CTA ────────────────────────────────────────────── */}
			<AnimatedSection className={`${fullBleed} bg-[#080808] py-20 px-14`}>
				<div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
					<motion.h2
						className="text-4xl md:text-5xl font-bold text-white"
						style={{ fontFamily: 'Orbitron, sans-serif' }}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
					>
						{t('cta.title')}
					</motion.h2>
					<motion.p
						className="text-[#6B7280] text-lg leading-relaxed"
						style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.5 }}
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{t('cta.description')}
					</motion.p>
					<motion.div
						className="flex flex-col sm:flex-row gap-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
					>
						<Link
							href="/workouts/new"
							className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-[#32D74B] hover:bg-[#4fe063] text-[#0C0C0C] font-bold text-base transition-all"
						>
							{t('cta.createWorkout')}
						</Link>
						<Link
							href="/blog"
							className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-base transition-all"
						>
							{t('cta.visitBlog')}
						</Link>
					</motion.div>
				</div>
			</AnimatedSection>

		</div>
	);
}
