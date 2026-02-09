'use client';

import { useRef, type ComponentProps } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';
import type { Link } from '@/i18n/navigation';

type AppHref = ComponentProps<typeof Link>['href'];

// Reusable scroll-triggered section wrapper
function AnimatedSection({
	children,
	className,
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-80px' });

	return (
		<motion.section
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 60 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
			transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.section>
	);
}

// Stagger children on scroll
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
			variants={{
				visible: {
					transition: { staggerChildren: staggerDelay },
				},
			}}
		>
			{children}
		</motion.div>
	);
}

function StaggerItem({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, y: 40, scale: 0.95 },
				visible: {
					opacity: 1,
					y: 0,
					scale: 1,
					transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
				},
			}}
		>
			{children}
		</motion.div>
	);
}

// Animated counter for stats
function AnimatedCounter({
	value,
	suffix = '',
	className,
}: {
	value: string;
	suffix?: string;
	className?: string;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-40px' });

	return (
		<motion.p
			ref={ref}
			className={className}
			style={{ fontFamily: 'Orbitron, sans-serif' }}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={
				isInView
					? { opacity: 1, scale: 1 }
					: { opacity: 0, scale: 0.5 }
			}
			transition={{
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{value}
			{suffix && (
				<span className="text-xl md:text-3xl ml-1">{suffix}</span>
			)}
		</motion.p>
	);
}

export default function HomePageClient() {
	const t = useTranslations('HomePage');

	// Parallax refs and transforms
	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});

	// Different speeds for depth layers (further back = moves slower/more)
	const bgBlobsY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
	const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
	const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
	const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

	return (
		<div className="w-full">
			{/* Hero Section - full viewport width breakout with parallax */}
			<section
				ref={heroRef}
				className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden"
			>
				<div className="relative flex flex-col items-center gap-8 py-16 md:py-24">
					{/* Atmospheric background effects - deepest parallax layer */}
					<motion.div
						className="absolute inset-0 -z-10 overflow-visible"
						style={{ y: bgBlobsY }}
					>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-700/20 blur-[120px] animate-glow-pulse" />
						<div className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-tertiary-700/10 blur-[100px] animate-float" />
						<div className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full bg-secondary-700/10 blur-[80px] animate-float-slow" />
					</motion.div>

					{/* Animated grid pattern - mid parallax layer */}
					<motion.div
						className="absolute inset-0 -z-10 animate-grid-fade"
						style={{
							y: gridY,
							backgroundImage:
								'linear-gradient(rgba(187,134,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(187,134,252,0.3) 1px, transparent 1px)',
							backgroundSize: '60px 60px',
						}}
					/>

					{/* Content - foreground parallax layer with fade-out */}
					<motion.div
						className="relative flex flex-col items-center gap-6 max-w-4xl mx-auto px-6"
						style={{ y: contentY, opacity: heroOpacity }}
					>
					{/* Badge - slides down */}
					<motion.span
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-900/50 border border-primary-700/30 text-primary-300 text-sm font-medium tracking-wider uppercase"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.1,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
						{t('hero.badge')}
					</motion.span>

					{/* Title - line 1 clips in */}
					<motion.h1
						className="text-4xl sm:text-5xl md:text-7xl font-bold text-center leading-tight"
						style={{ fontFamily: 'Orbitron, sans-serif' }}
					>
						<motion.span
							className="block text-white"
							initial={{ opacity: 0, x: -40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.7,
								delay: 0.25,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							{t('hero.titleLine1')}
						</motion.span>
						{/* Title line 2 - gradient with shimmer */}
						<motion.span
							className="block relative overflow-hidden"
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.7,
								delay: 0.4,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<span
								className="bg-clip-text text-transparent"
								style={{
									backgroundImage:
										'linear-gradient(90deg, #A386FF, #BB86FC, #03DAC5, #A386FF)',
									backgroundSize: '200% 100%',
									animation:
										'gradient-shift 8s ease infinite',
								}}
							>
								{t('hero.titleLine2')}
							</span>
						</motion.span>
					</motion.h1>

					{/* Description - fades up */}
					<motion.p
						className="text-center text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
						style={{ fontFamily: 'Space Grotesk, sans-serif' }}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.7,
							delay: 0.55,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						{t('about')}
					</motion.p>

					{/* CTA Buttons - staggered entrance */}
					<motion.div
						className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
						initial="hidden"
						animate="visible"
						variants={{
							visible: {
								transition: {
									staggerChildren: 0.12,
									delayChildren: 0.7,
								},
							},
						}}
					>
						{[
							{
								href: '/exercises' as AppHref,
								gradient:
									'from-primary-600 to-primary-700',
								shadow: 'shadow-primary-900/40 hover:shadow-primary-700/50',
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
										/>
									</svg>
								),
								label: t('hero.exercises'),
							},
							{
								href: '/workouts' as AppHref,
								gradient:
									'from-secondary-600 to-secondary-700',
								shadow: 'shadow-secondary-900/40 hover:shadow-secondary-700/50',
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
										/>
									</svg>
								),
								label: t('hero.workouts'),
							},
							{
								href: '/roadmaps' as AppHref,
								gradient:
									'from-tertiary-600 to-tertiary-700',
								shadow: 'shadow-tertiary-900/40 hover:shadow-tertiary-700/50',
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
										/>
									</svg>
								),
								label: t('hero.roadmaps'),
							},
						].map((btn) => (
							<motion.div
								key={String(btn.href)}
								variants={{
									hidden: {
										opacity: 0,
										y: 20,
										scale: 0.9,
									},
									visible: {
										opacity: 1,
										y: 0,
										scale: 1,
										transition: {
											duration: 0.5,
											ease: [0.22, 1, 0.36, 1],
										},
									},
								}}
								whileHover={{ scale: 1.04, y: -2 }}
								whileTap={{ scale: 0.97 }}
							>
								<NavLink
									href={btn.href}
									className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r ${btn.gradient} text-white shadow-lg ${btn.shadow} transition-shadow duration-300 overflow-hidden`}
								>
									{/* Shimmer effect on hover */}
									<span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
									</span>
									<span className="relative flex items-center gap-3">
										{btn.icon}
										{btn.label}
									</span>
								</NavLink>
							</motion.div>
						))}
					</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Feature Cards Section */}
			<AnimatedSection className="py-12 md:py-16">
				<motion.h2
					className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
					style={{ fontFamily: 'Orbitron, sans-serif' }}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{
						duration: 0.6,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					{t('features.title')}
				</motion.h2>
				<motion.p
					className="text-gray-500 text-center mb-10 max-w-xl mx-auto"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					{t('features.subtitle')}
				</motion.p>

				<StaggerContainer
					className="grid grid-cols-1 md:grid-cols-3 gap-6"
					staggerDelay={0.15}
				>
					{/* Exercises Card */}
					<StaggerItem>
						<NavLink href="/exercises" className="group block">
							<motion.div
								className="relative h-full p-6 md:p-8 rounded-2xl bg-surface border border-white/5 overflow-hidden transition-colors duration-500 hover:border-primary-500/30"
								whileHover={{
									y: -6,
									boxShadow:
										'0 25px 50px -12px rgba(163, 134, 255, 0.15)',
								}}
								transition={{
									duration: 0.3,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors duration-500" />
								<div className="relative">
									<motion.div
										className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary-900/50 border border-primary-700/30 mb-6"
										whileHover={{
											scale: 1.15,
											rotate: 5,
										}}
										transition={{ duration: 0.3 }}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-7 h-7 text-primary-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.5}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
											/>
										</svg>
									</motion.div>
									<h3
										className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors"
										style={{
											fontFamily:
												'Orbitron, sans-serif',
										}}
									>
										{t('features.feature1.title')}
									</h3>
									<p className="text-gray-400 leading-relaxed mb-6">
										{t('features.feature1.description')}
									</p>
									<span className="inline-flex items-center gap-2 text-primary-400 font-medium text-sm group-hover:gap-3 transition-all">
										{t('features.explore')}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-4 h-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
											/>
										</svg>
									</span>
								</div>
							</motion.div>
						</NavLink>
					</StaggerItem>

					{/* Workouts Card */}
					<StaggerItem>
						<NavLink href="/workouts" className="group block">
							<motion.div
								className="relative h-full p-6 md:p-8 rounded-2xl bg-surface border border-white/5 overflow-hidden transition-colors duration-500 hover:border-secondary-500/30"
								whileHover={{
									y: -6,
									boxShadow:
										'0 25px 50px -12px rgba(50, 215, 75, 0.15)',
								}}
								transition={{
									duration: 0.3,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<div className="absolute top-0 right-0 w-40 h-40 bg-secondary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary-500/10 transition-colors duration-500" />
								<div className="relative">
									<motion.div
										className="w-14 h-14 flex items-center justify-center rounded-xl bg-secondary-900/50 border border-secondary-700/30 mb-6"
										whileHover={{
											scale: 1.15,
											rotate: 5,
										}}
										transition={{ duration: 0.3 }}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-7 h-7 text-secondary-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.5}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
											/>
										</svg>
									</motion.div>
									<h3
										className="text-xl font-bold text-white mb-3 group-hover:text-secondary-400 transition-colors"
										style={{
											fontFamily:
												'Orbitron, sans-serif',
										}}
									>
										{t('features.feature2.title')}
									</h3>
									<p className="text-gray-400 leading-relaxed mb-6">
										{t('features.feature2.description')}
									</p>
									<span className="inline-flex items-center gap-2 text-secondary-400 font-medium text-sm group-hover:gap-3 transition-all">
										{t('features.explore')}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-4 h-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
											/>
										</svg>
									</span>
								</div>
							</motion.div>
						</NavLink>
					</StaggerItem>

					{/* Roadmaps Card */}
					<StaggerItem>
						<NavLink href="/roadmaps" className="group block">
							<motion.div
								className="relative h-full p-6 md:p-8 rounded-2xl bg-surface border border-white/5 overflow-hidden transition-colors duration-500 hover:border-tertiary-500/30"
								whileHover={{
									y: -6,
									boxShadow:
										'0 25px 50px -12px rgba(3, 218, 197, 0.15)',
								}}
								transition={{
									duration: 0.3,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<div className="absolute top-0 right-0 w-40 h-40 bg-tertiary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-tertiary-500/10 transition-colors duration-500" />
								<div className="relative">
									<motion.div
										className="w-14 h-14 flex items-center justify-center rounded-xl bg-tertiary-900/50 border border-tertiary-700/30 mb-6"
										whileHover={{
											scale: 1.15,
											rotate: 5,
										}}
										transition={{ duration: 0.3 }}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-7 h-7 text-tertiary-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.5}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
											/>
										</svg>
									</motion.div>
									<h3
										className="text-xl font-bold text-white mb-3 group-hover:text-tertiary-400 transition-colors"
										style={{
											fontFamily:
												'Orbitron, sans-serif',
										}}
									>
										{t('features.feature3.title')}
									</h3>
									<p className="text-gray-400 leading-relaxed mb-6">
										{t('features.feature3.description')}
									</p>
									<span className="inline-flex items-center gap-2 text-tertiary-400 font-medium text-sm group-hover:gap-3 transition-all">
										{t('features.explore')}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-4 h-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
											/>
										</svg>
									</span>
								</div>
							</motion.div>
						</NavLink>
					</StaggerItem>
				</StaggerContainer>
			</AnimatedSection>

			{/* Stats Section */}
			<AnimatedSection className="py-12 md:py-16">
				<div className="relative rounded-3xl overflow-hidden">
					{/* Background with layered gradients */}
					<div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(3,218,197,0.15),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(50,215,75,0.1),transparent_50%)]" />

					<div className="relative px-6 py-12 md:py-16 md:px-10">
						<motion.h2
							className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
							style={{ fontFamily: 'Orbitron, sans-serif' }}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.6,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							{t('featuredSection.title')}
						</motion.h2>
						<motion.p
							className="text-primary-200/60 text-center mb-10 max-w-lg mx-auto"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.15 }}
						>
							{t('featuredSection.subtitle')}
						</motion.p>

						<StaggerContainer
							className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
							staggerDelay={0.12}
						>
							<StaggerItem>
								<motion.div
									className="text-center p-4 md:p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] transition-colors duration-300"
									whileHover={{
										backgroundColor:
											'rgba(255,255,255,0.1)',
										scale: 1.03,
									}}
									transition={{ duration: 0.25 }}
								>
									<AnimatedCounter
										value="32%"
										className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-primary-300 bg-clip-text text-transparent mb-3"
									/>
									<p className="text-xs md:text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat1')}
									</p>
								</motion.div>
							</StaggerItem>

							<StaggerItem>
								<motion.div
									className="text-center p-4 md:p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] transition-colors duration-300"
									whileHover={{
										backgroundColor:
											'rgba(255,255,255,0.1)',
										scale: 1.03,
									}}
									transition={{ duration: 0.25 }}
								>
									<AnimatedCounter
										value="0-3"
										className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-secondary-300 bg-clip-text text-transparent mb-3"
									/>
									<p className="text-xs md:text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat2')}
									</p>
								</motion.div>
							</StaggerItem>

							<StaggerItem>
								<motion.div
									className="text-center p-4 md:p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] transition-colors duration-300"
									whileHover={{
										backgroundColor:
											'rgba(255,255,255,0.1)',
										scale: 1.03,
									}}
									transition={{ duration: 0.25 }}
								>
									<AnimatedCounter
										value="2"
										suffix={t('featuredSection.weeks')}
										className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-tertiary-300 bg-clip-text text-transparent mb-3"
									/>
									<p className="text-xs md:text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat3')}
									</p>
								</motion.div>
							</StaggerItem>

							<StaggerItem>
								<motion.div
									className="text-center p-4 md:p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] transition-colors duration-300"
									whileHover={{
										backgroundColor:
											'rgba(255,255,255,0.1)',
										scale: 1.03,
									}}
									transition={{ duration: 0.25 }}
								>
									<AnimatedCounter
										value="564"
										className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-primary-300 bg-clip-text text-transparent mb-3"
									/>
									<p className="text-xs md:text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat4')}
									</p>
								</motion.div>
							</StaggerItem>
						</StaggerContainer>
					</div>
				</div>
			</AnimatedSection>

			{/* CTA Section */}
			<AnimatedSection className="py-12 md:py-16">
				<div className="relative flex flex-col items-center text-center px-6 py-14 md:py-16 rounded-3xl overflow-hidden bg-surface border border-white/5">
					{/* Decorative top line with animation */}
					<motion.div
						className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
						initial={{ scaleX: 0 }}
						whileInView={{ scaleX: 1 }}
						viewport={{ once: true }}
						transition={{
							duration: 1,
							delay: 0.3,
							ease: [0.22, 1, 0.36, 1],
						}}
					/>
					<motion.div
						className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-tertiary-500/30 to-transparent"
						initial={{ scaleX: 0 }}
						whileInView={{ scaleX: 1 }}
						viewport={{ once: true }}
						transition={{
							duration: 1,
							delay: 0.5,
							ease: [0.22, 1, 0.36, 1],
						}}
					/>

					<motion.h2
						className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl"
						style={{ fontFamily: 'Orbitron, sans-serif' }}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.6,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						{t('cta.title')}
					</motion.h2>
					<motion.p
						className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{t('cta.description')}
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row gap-4"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={{
							visible: {
								transition: {
									staggerChildren: 0.12,
									delayChildren: 0.25,
								},
							},
						}}
					>
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.5,
										ease: [0.22, 1, 0.36, 1],
									},
								},
							}}
							whileHover={{ scale: 1.04, y: -2 }}
							whileTap={{ scale: 0.97 }}
						>
							<NavLink
								href="/workouts/new"
								className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-bold text-lg shadow-lg shadow-secondary-900/30 hover:shadow-secondary-700/40 transition-shadow duration-300 overflow-hidden"
							>
								<span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
								</span>
								<span className="relative flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										/>
									</svg>
									{t('cta.createWorkout')}
								</span>
							</NavLink>
						</motion.div>

						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.5,
										ease: [0.22, 1, 0.36, 1],
									},
								},
							}}
							whileHover={{ scale: 1.04, y: -2 }}
							whileTap={{ scale: 0.97 }}
						>
							<NavLink
								href="/blog"
								className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5"
									/>
								</svg>
								{t('cta.visitBlog')}
							</NavLink>
						</motion.div>
					</motion.div>
				</div>
			</AnimatedSection>
		</div>
	);
}
