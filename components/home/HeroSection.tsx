'use client';

import { useRef, useEffect, forwardRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { animate, utils as animeUtils } from 'animejs';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';

// ── Anime.js: Dot Grid background ──────────────────────────────────────────
const DOT_COLS = 28;
const DOT_ROWS = 14;

function HeroDotGrid() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const dots = ref.current?.querySelectorAll<HTMLElement>('.dot-cell');
		if (!dots?.length) return;

		const targetOpacities = Array.from(dots).map(() => 0.04 + Math.random() * 0.14);

		animate(Array.from(dots), {
			opacity: [0, (_, i) => targetOpacities[i]],
			scale: [0, 1],
			delay: animeUtils.stagger(20, { grid: [DOT_COLS, DOT_ROWS], from: 'center' }),
			duration: 900,
			ease: 'easeOutExpo',
		});

		setTimeout(() => {
			dots.forEach((dot, i) => {
				const base = targetOpacities[i];
				animate(dot, {
					opacity: [base, base * 0.2 + 0.02],
					duration: 1800 + Math.random() * 2400,
					delay: Math.random() * 3000,
					loop: true,
					alternate: true,
					ease: 'easeInOutSine',
				});
			});
		}, 1200);
	}, []);

	return (
		<div
			ref={ref}
			className="absolute left-0 right-0 bottom-0 pointer-events-none overflow-hidden"
			style={{
				top: '-72px',
				display: 'grid',
				gridTemplateColumns: `repeat(${DOT_COLS}, 1fr)`,
				gridTemplateRows: `repeat(${DOT_ROWS}, 1fr)`,
			}}
		>
			{Array.from({ length: DOT_COLS * DOT_ROWS }).map((_, i) => (
				<div key={i} className="dot-cell flex items-center justify-center opacity-0">
					<div className="w-[3px] h-[3px] rounded-full bg-white" />
				</div>
			))}
		</div>
	);
}

// ── Anime.js: Letter-by-letter hero title ──────────────────────────────────
const HERO_COLORS = ['text-white', 'text-[#a386ff]', 'text-white'] as const;

function AnimatedHeroTitle() {
	const t = useTranslations('HomePage');
	const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const words = [
		{ text: t('hero.titleLine1').toUpperCase(), color: HERO_COLORS[0] },
		{ text: t('hero.titleLine2').toUpperCase(), color: HERO_COLORS[1] },
		{ text: t('hero.titleLine3').toUpperCase(), color: HERO_COLORS[2] },
	];

	useEffect(() => {
		words.forEach((_, wi) => {
			const letters = wordRefs.current[wi]?.querySelectorAll('.letter');
			if (!letters?.length) return;

			animate(Array.from(letters), {
				translateY: ['110%', '0%'],
				opacity: [0, 1],
				delay: animeUtils.stagger(45, { start: wi * 160 + 80 }),
				duration: 750,
				ease: 'easeOutExpo',
			});
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<h1
			className="font-bold leading-none"
			style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.03em', lineHeight: 0.9 }}
		>
			{words.map(({ text, color }, wi) => (
				<span
					key={wi}
					ref={(el) => { wordRefs.current[wi] = el; }}
					className={`block ${color} text-[13vw] md:text-[120px] lg:text-[140px] overflow-hidden`}
				>
					{text.split('').map((char, li) => (
						<span
							key={li}
							className="letter inline-block opacity-0"
							style={{ willChange: 'transform, opacity', transform: 'translateY(110%)' }}
						>
							{char}
						</span>
					))}
				</span>
			))}
		</h1>
	);
}

// ── HeroSection ─────────────────────────────────────────────────────────────
const fullBleed = 'relative left-1/2 -ml-[50vw] w-screen';

const HeroSection = forwardRef<HTMLElement>(function HeroSection(_, ref) {
	const t = useTranslations('HomePage');
	const innerRef = useRef<HTMLElement>(null);
	const resolvedRef = (ref as React.RefObject<HTMLElement>) ?? innerRef;

	const { scrollYProgress } = useScroll({ target: resolvedRef, offset: ['start start', 'end start'] });
	// Parallax only on md+ — on mobile transforms cause scroll conflicts
	const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
	const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
	const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

	return (
		<section
			ref={ref ?? innerRef}
			className={`${fullBleed} bg-[#0C0C0C] overflow-x-hidden`}
		>
			<HeroDotGrid />

			<div className="relative min-h-[calc(100dvh-72px)]">
				{/* Image — absolute background, anchored right — hidden on mobile */}
				<motion.div
					className="hidden md:block absolute inset-y-0 right-0 w-[55%] pointer-events-none"
					style={{ y: imageY }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					<Image
						src="/images/home_image.png"
						alt="Calisthenics athlete"
						fill
						className="object-contain object-top object-center"
					/>
				</motion.div>

				{/* Text — parallax only on md+ */}
				<motion.div
					className="relative z-10 flex flex-col justify-center px-8 md:px-14 lg:px-[56px] py-16 md:py-20"
					style={{ y: contentY, opacity: heroOpacity }}
				>
					<AnimatedHeroTitle />

					<motion.p
						className="text-[#808080] text-sm mt-6 mb-7"
						style={{ fontFamily: 'Space Grotesk, sans-serif' }}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
					>
						{t('hero.tagline')}
					</motion.p>

					<motion.div
						className="flex items-center gap-4"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
					>
						<Link
							href="/register"
							className="bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm px-8 py-[14px] [font-family:'Orbitron',sans-serif] transition-all"
						>
							{t('hero.startFree')}
						</Link>
						<Link
							href="/login"
							className="bg-[#0C0C0C] hover:bg-[#1a1a1a] text-white font-bold text-sm px-8 py-[14px] [font-family:'Orbitron',sans-serif] border border-[#333333] transition-all"
						>
							{t('hero.login')} →
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
});

export default HeroSection;
