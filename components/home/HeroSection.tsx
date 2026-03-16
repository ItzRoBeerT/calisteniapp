'use client';

import { useRef, useEffect, forwardRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { animate, utils as animeUtils } from 'animejs';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

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

// ── Anime.js: Letter-by-letter line ────────────────────────────────────────
function AnimatedLine({ text, color, delay }: { text: string; color: string; delay: number }) {
	const spanRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const letters = spanRef.current?.querySelectorAll('.letter');
		if (!letters?.length) return;
		animate(Array.from(letters), {
			translateY: ['110%', '0%'],
			opacity: [0, 1],
			delay: animeUtils.stagger(45, { start: delay }),
			duration: 750,
			ease: 'easeOutExpo',
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<span
			ref={spanRef}
			className="block font-bold overflow-hidden text-[13vw] md:text-[120px] lg:text-[140px]"
			style={{ color, fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.03em', lineHeight: 0.9 }}
		>
			{text.split('').map((char, i) => (
				<span
					key={i}
					className="letter inline-block opacity-0"
					style={{ willChange: 'transform, opacity', transform: 'translateY(110%)' }}
				>
					{char}
				</span>
			))}
		</span>
	);
}

// ── Canvas: Particle text — single line ────────────────────────────────────
interface Particle {
	tx: number; ty: number;
	x:  number; y:  number;
	color: string;
	delay: number;
}

function ParticleLine({ text, color }: { text: string; color: string }) {
	const canvasRef    = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas    = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		let animId:    number;
		let cancelled = false;

		const easeOutExpo = (x: number) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);

		const init = async () => {
			await document.fonts.load('bold 140px "Orbitron"');
			if (cancelled) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const W          = container.clientWidth;
			const vw         = window.innerWidth;
			const fontSize   = vw < 768 ? vw * 0.13 : vw < 1024 ? 120 : 140;
			const H          = Math.ceil(fontSize * 1.1);
			const particleGap = vw < 768 ? 3 : 4;

			canvas.width        = W;
			canvas.height       = H;
			canvas.style.width  = `${W}px`;
			canvas.style.height = `${H}px`;

			const off    = document.createElement('canvas');
			off.width    = W;
			off.height   = H;
			const offCtx = off.getContext('2d')!;

			offCtx.font          = `bold ${fontSize}px "Orbitron", sans-serif`;
			offCtx.letterSpacing = `${(-0.03 * fontSize).toFixed(1)}px`;
			offCtx.textBaseline  = 'top';
			offCtx.fillStyle     = color;
			offCtx.fillText(text, 0, 0);

			const { data } = offCtx.getImageData(0, 0, W, H);
			const particles: Particle[] = [];

			for (let py = 0; py < H; py += particleGap) {
				for (let px = 0; px < W; px += particleGap) {
					const idx = (py * W + px) * 4;
					if (data[idx + 3] > 100) {
						particles.push({
							tx:    px,
							ty:    py,
							x:     Math.random() * W * 3 - W,
							y:     Math.random() * H * 6 - H * 2,
							color: `rgb(${data[idx]},${data[idx + 1]},${data[idx + 2]})`,
							delay: Math.random() * 700,
						});
					}
				}
			}

			const DURATION  = 1200;
			let startTime: number | null = null;

			const render = (now: number) => {
				if (cancelled) return;
				if (!startTime) startTime = now;
				ctx.clearRect(0, 0, W, H);
				let allDone = true;

				for (const p of particles) {
					const elapsed = now - startTime - p.delay;
					let cx: number, cy: number;

					if (elapsed <= 0) {
						cx = p.x; cy = p.y;
						allDone = false;
					} else {
						const progress = Math.min(elapsed / DURATION, 1);
						const e = easeOutExpo(progress);
						cx = p.x + (p.tx - p.x) * e;
						cy = p.y + (p.ty - p.y) * e;
						if (progress < 1) allDone = false;
					}

					ctx.fillStyle = p.color;
					ctx.fillRect(cx, cy, 2, 2);
				}

				if (!allDone) animId = requestAnimationFrame(render);
			};

			animId = requestAnimationFrame(render);
		};

		init();
		return () => { cancelled = true; cancelAnimationFrame(animId); };
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div ref={containerRef} className="w-full overflow-hidden" style={{ lineHeight: 0 }}>
			<canvas ref={canvasRef} className="block" />
		</div>
	);
}

// ── Combined hero title ──────────────────────────────────────────────────────
function ParticleHeroTitle() {
	const t = useTranslations('HomePage');
	const line1 = t('hero.titleLine1').toUpperCase();
	const line2 = t('hero.titleLine2').toUpperCase();
	const line3 = t('hero.titleLine3').toUpperCase();

	return (
		<h1
			className="font-bold leading-none"
			style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.03em', lineHeight: 0.9 }}
			aria-label={`${line1} ${line2} ${line3}`}
		>
			<AnimatedLine text={line1} color="#FFFFFF" delay={80} />
			<ParticleLine text={line2} color="#a386ff" />
			<AnimatedLine text={line3} color="#FFFFFF" delay={480} />
		</h1>
	);
}

// ── HeroSection ─────────────────────────────────────────────────────────────
const fullBleed = 'relative left-1/2 -ml-[50vw] w-screen';

const HeroSection = forwardRef<HTMLElement>(function HeroSection(_, ref) {
	const t = useTranslations('HomePage');
	const innerRef = useRef<HTMLElement>(null);
	const resolvedRef = (ref as React.RefObject<HTMLElement>) ?? innerRef;
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			const supabase = createClient();
			if (supabase) {
				const { data: { user } } = await supabase.auth.getUser();
				setUser(user ?? null);
			}
			setIsLoading(false);
		};
		checkUser();
	}, []);

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
					<ParticleHeroTitle />

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
						{!isLoading && user ? (
							// Logged in: show 3 feature buttons
							<>
								<Link
									href="/exercises"
									className="bg-[#A386FF] hover:bg-[#b89fff] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all [font-family:'Orbitron',sans-serif]"
								>
									{t('features.feature1.cta')}
								</Link>
								<Link
									href="/workouts"
									className="bg-[#32D74B] hover:bg-[#4fe063] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all [font-family:'Orbitron',sans-serif]"
								>
									{t('features.feature2.cta')}
								</Link>
								<Link
									href="/roadmaps"
									className="bg-[#03DAC5] hover:bg-[#1de9d5] text-[#080808] font-bold text-sm px-6 py-3 rounded-md transition-all [font-family:'Orbitron',sans-serif]"
								>
									{t('features.feature3.cta')}
								</Link>
							</>
						) : (
							// Not logged in: show auth buttons
							<>
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
							</>
						)}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
});

export default HeroSection;
