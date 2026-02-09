import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';

export default function Home() {
	const t = useTranslations('HomePage');

	return (
		<div className="w-full -mt-4">
			<main className="flex flex-col items-center w-full">
				{/* Hero Section */}
				<section className="relative flex flex-col items-center w-full gap-8 py-20 md:py-28 overflow-hidden">
					{/* Atmospheric background effects */}
					<div className="absolute inset-0 -z-10">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-700/20 blur-[120px]" />
						<div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-tertiary-700/10 blur-[100px]" />
						<div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-secondary-700/10 blur-[80px]" />
					</div>

					{/* Decorative grid pattern */}
					<div
						className="absolute inset-0 -z-10 opacity-[0.03]"
						style={{
							backgroundImage:
								'linear-gradient(rgba(187,134,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(187,134,252,0.3) 1px, transparent 1px)',
							backgroundSize: '60px 60px',
						}}
					/>

					<div className="relative flex flex-col items-center gap-6 max-w-4xl mx-auto px-4">
						<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-900/50 border border-primary-700/30 text-primary-300 text-sm font-medium tracking-wider uppercase">
							<span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
							{t('hero.badge')}
						</span>

						<h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
							<span className="block text-white">{t('hero.titleLine1')}</span>
							<span className="block bg-gradient-to-r from-primary-400 via-primary-500 to-tertiary-500 bg-clip-text text-transparent">
								{t('hero.titleLine2')}
							</span>
						</h1>

						<p className="text-center text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
							{t('about')}
						</p>

						{/* 3 CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
							<NavLink
								href="/exercises"
								className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-900/40 hover:shadow-primary-700/50 hover:scale-[1.02] transition-all duration-300"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
								</svg>
								{t('hero.exercises')}
							</NavLink>

							<NavLink
								href="/workouts"
								className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg overflow-hidden bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-lg shadow-secondary-900/40 hover:shadow-secondary-700/50 hover:scale-[1.02] transition-all duration-300"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
								</svg>
								{t('hero.workouts')}
							</NavLink>

							<NavLink
								href="/roadmaps"
								className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg overflow-hidden bg-gradient-to-r from-tertiary-600 to-tertiary-700 text-white shadow-lg shadow-tertiary-900/40 hover:shadow-tertiary-700/50 hover:scale-[1.02] transition-all duration-300"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
								</svg>
								{t('hero.roadmaps')}
							</NavLink>
						</div>
					</div>
				</section>

				{/* Feature Cards Section */}
				<section className="w-full py-16 md:py-20">
					<h2
						className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
						style={{ fontFamily: 'Orbitron, sans-serif' }}
					>
						{t('features.title')}
					</h2>
					<p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
						{t('features.subtitle')}
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
						{/* Exercises Card */}
						<NavLink href="/exercises" className="group block">
							<div className="relative h-full p-8 rounded-2xl bg-surface border border-white/5 overflow-hidden transition-all duration-500 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-1">
								<div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors duration-500" />
								<div className="relative">
									<div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary-900/50 border border-primary-700/30 mb-6 group-hover:scale-110 transition-transform duration-300">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
										</svg>
									</div>
									<h3
										className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{t('features.feature1.title')}
									</h3>
									<p className="text-gray-400 leading-relaxed mb-6">
										{t('features.feature1.description')}
									</p>
									<span className="inline-flex items-center gap-2 text-primary-400 font-medium text-sm group-hover:gap-3 transition-all">
										{t('features.explore')}
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
										</svg>
									</span>
								</div>
							</div>
						</NavLink>

						{/* Workouts Card */}
						<NavLink href="/workouts" className="group block">
							<div className="relative h-full p-8 rounded-2xl bg-surface border border-white/5 overflow-hidden transition-all duration-500 hover:border-secondary-500/30 hover:shadow-2xl hover:shadow-secondary-900/20 hover:-translate-y-1">
								<div className="absolute top-0 right-0 w-40 h-40 bg-secondary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary-500/10 transition-colors duration-500" />
								<div className="relative">
									<div className="w-14 h-14 flex items-center justify-center rounded-xl bg-secondary-900/50 border border-secondary-700/30 mb-6 group-hover:scale-110 transition-transform duration-300">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
										</svg>
									</div>
									<h3
										className="text-xl font-bold text-white mb-3 group-hover:text-secondary-400 transition-colors"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{t('features.feature2.title')}
									</h3>
									<p className="text-gray-400 leading-relaxed mb-6">
										{t('features.feature2.description')}
									</p>
									<span className="inline-flex items-center gap-2 text-secondary-400 font-medium text-sm group-hover:gap-3 transition-all">
										{t('features.explore')}
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
										</svg>
									</span>
								</div>
							</div>
						</NavLink>

						{/* Roadmaps Card */}
						<NavLink href="/roadmaps" className="group block">
							<div className="relative h-full p-8 rounded-2xl bg-surface border border-white/5 overflow-hidden transition-all duration-500 hover:border-tertiary-500/30 hover:shadow-2xl hover:shadow-tertiary-900/20 hover:-translate-y-1">
								<div className="absolute top-0 right-0 w-40 h-40 bg-tertiary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-tertiary-500/10 transition-colors duration-500" />
								<div className="relative">
									<div className="w-14 h-14 flex items-center justify-center rounded-xl bg-tertiary-900/50 border border-tertiary-700/30 mb-6 group-hover:scale-110 transition-transform duration-300">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-tertiary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
										</svg>
									</div>
									<h3
										className="text-xl font-bold text-white mb-3 group-hover:text-tertiary-400 transition-colors"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										{t('features.feature3.title')}
									</h3>
									<p className="text-gray-400 leading-relaxed mb-6">
										{t('features.feature3.description')}
									</p>
									<span className="inline-flex items-center gap-2 text-tertiary-400 font-medium text-sm group-hover:gap-3 transition-all">
										{t('features.explore')}
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
										</svg>
									</span>
								</div>
							</div>
						</NavLink>
					</div>
				</section>

				{/* Stats Section */}
				<section className="w-full py-16 md:py-20">
					<div className="relative rounded-3xl overflow-hidden">
						{/* Background with layered gradients */}
						<div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(3,218,197,0.15),transparent_50%)]" />
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(50,215,75,0.1),transparent_50%)]" />

						{/* Noise texture overlay */}
						<div
							className="absolute inset-0 opacity-[0.04]"
							style={{
								backgroundImage:
									'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
							}}
						/>

						<div className="relative px-8 py-14 md:py-20 md:px-12">
							<h2
								className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
								style={{ fontFamily: 'Orbitron, sans-serif' }}
							>
								{t('featuredSection.title')}
							</h2>
							<p className="text-primary-200/60 text-center mb-12 max-w-lg mx-auto">
								{t('featuredSection.subtitle')}
							</p>

							<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="text-center p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-300">
									<p
										className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-primary-300 bg-clip-text text-transparent mb-3"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										32%
									</p>
									<p className="text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat1')}
									</p>
								</div>

								<div className="text-center p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-300">
									<p
										className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-secondary-300 bg-clip-text text-transparent mb-3"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										0-3
									</p>
									<p className="text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat2')}
									</p>
								</div>

								<div className="text-center p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-300">
									<p
										className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-tertiary-300 bg-clip-text text-transparent mb-3"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										2<span className="text-2xl md:text-3xl ml-1">{t('featuredSection.weeks')}</span>
									</p>
									<p className="text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat3')}
									</p>
								</div>

								<div className="text-center p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-300">
									<p
										className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-primary-300 bg-clip-text text-transparent mb-3"
										style={{ fontFamily: 'Orbitron, sans-serif' }}
									>
										564
									</p>
									<p className="text-sm text-primary-100/70 leading-relaxed">
										{t('featuredSection.stat4')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full py-16 md:py-20">
					<div className="relative flex flex-col items-center text-center px-6 py-16 md:py-20 rounded-3xl overflow-hidden bg-surface border border-white/5">
						{/* Decorative elements */}
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-tertiary-500/30 to-transparent" />

						<h2
							className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl"
							style={{ fontFamily: 'Orbitron, sans-serif' }}
						>
							{t('cta.title')}
						</h2>
						<p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
							{t('cta.description')}
						</p>

						<div className="flex flex-col sm:flex-row gap-4">
							<NavLink
								href="/exercises"
								className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-lg shadow-lg shadow-primary-900/30 hover:shadow-primary-700/40 hover:scale-[1.02] transition-all duration-300"
							>
								{t('cta.button')}
								<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
								</svg>
							</NavLink>

							<NavLink
								href="/roadmaps"
								className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
							>
								{t('cta.roadmapsButton')}
							</NavLink>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
