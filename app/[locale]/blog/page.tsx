import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
	title: 'OpenCalisthenics Blog',
	description:
		'Artículos sobre calistenia, rutinas, consejos y novedades de la app.',
};

export default function BlogPage() {
	const t = useTranslations('BlogPage');

	//TODO: Actualizar a una forma de iterar los blogs más dinámica
	const keys = ['1', '2', '3'] as const;

	return (
		<div className="relative min-h-screen bg-background overflow-x-hidden">
			<style>{`
				@keyframes revealUp {
					from { opacity: 0; transform: translateY(22px); }
					to   { opacity: 1; transform: translateY(0);    }
				}
				.rv { animation: revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
				.rv-d1 { animation-delay: 0.05s; }
				.rv-d2 { animation-delay: 0.15s; }
				.rv-d3 { animation-delay: 0.25s; }
				.rv-d4 { animation-delay: 0.35s; }
				.rv-d5 { animation-delay: 0.48s; }
				.rv-d6 { animation-delay: 0.60s; }
				.rv-d7 { animation-delay: 0.72s; }
			`}</style>

			{/* Grid background */}
			<div
				className="fixed inset-0 pointer-events-none z-0"
				style={{
					backgroundImage: `
						linear-gradient(rgba(187,134,252,0.022) 1px, transparent 1px),
						linear-gradient(90deg, rgba(187,134,252,0.022) 1px, transparent 1px)
					`,
					backgroundSize: '48px 48px',
				}}
			/>

			{/* Ambient glow */}
			<div
				className="fixed pointer-events-none z-0"
				style={{
					top: '-15%',
					left: '50%',
					transform: 'translateX(-50%)',
					width: '900px',
					height: '700px',
					background:
						'radial-gradient(ellipse at center, rgba(187,134,252,0.055) 0%, transparent 68%)',
				}}
			/>

			<div className="relative z-10 container mx-auto max-w-4xl px-6 pt-6 pb-20">
				{/* Page header */}
				<header className="relative mb-14">
					{/* Ghost watermark */}
					<div
						className="absolute select-none pointer-events-none right-0 top-0"
						style={{
							fontFamily: 'Orbitron, sans-serif',
							fontSize: 'clamp(5rem, 18vw, 12rem)',
							fontWeight: 700,
							color: 'rgba(187,134,252,0.038)',
							lineHeight: 1,
							zIndex: 0,
						}}
					>
						BLOG
					</div>

					<div className="relative z-10">
						{/* Overline */}
						<div className="rv rv-d1 flex items-center gap-3 mb-6">
							<div
								className="w-5 h-[2px] bg-secondary-400"
								style={{ boxShadow: '0 0 8px rgba(50,215,75,0.7)' }}
							/>
							<span className="font-mono text-xs tracking-[0.38em] uppercase text-secondary-400">
								OpenCalisthenics
							</span>
						</div>

						{/* Title */}
						<h1
							className="rv rv-d2 font-bold text-white mb-5"
							style={{
								fontFamily: 'Orbitron, sans-serif',
								fontSize: 'clamp(1.9rem, 5.5vw, 3.6rem)',
								textShadow: '0 0 80px rgba(187,134,252,0.22)',
								lineHeight: 1.12,
							}}
						>
							{t('title')}
						</h1>

						{/* Welcome */}
						<p className="rv rv-d3 text-gray-500 text-sm leading-relaxed max-w-lg">
							{t('welcome')}
						</p>
					</div>

					{/* Decorative divider */}
					<div className="rv rv-d4 mt-10 flex items-center gap-3">
						<div className="h-px flex-1 bg-gradient-to-r from-primary-500/50 via-primary-500/15 to-transparent" />
						<div className="flex gap-1.5 items-center">
							<span className="block w-1 h-1 rounded-full bg-primary-400/25" />
							<span className="block w-1 h-1 rounded-full bg-primary-400/50" />
							<span
								className="block w-2 h-2 rotate-45 border border-primary-500/70"
								style={{ boxShadow: '0 0 6px rgba(187,134,252,0.3)' }}
							/>
							<span className="block w-1 h-1 rounded-full bg-primary-400/50" />
							<span className="block w-1 h-1 rounded-full bg-primary-400/25" />
						</div>
						<div className="h-px flex-1 bg-gradient-to-l from-primary-500/50 via-primary-500/15 to-transparent" />
					</div>
				</header>

				{/* Posts list */}
				<ul>
					{keys.map((key, index) => (
						<li key={key} className={`rv rv-d${index + 5}`}>
							<Link
								href={{
									pathname: '/blog/[slug]',
									params: { slug: t(`Posts.${key}.slug`) },
								}}
								className="group relative flex items-start gap-6 py-10 border-b border-white/5 hover:border-primary-500/20 transition-colors duration-300"
							>
								{/* Left accent bar — slides in on hover */}
								<div
									className="absolute left-0 top-4 bottom-4 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
									style={{
										background:
											'linear-gradient(to bottom, rgba(187,134,252,0.7), rgba(187,134,252,0.05))',
									}}
								/>

								{/* Ordinal number */}
								<div
									className="shrink-0 w-12 text-right font-bold leading-none pt-1 text-gray-700 group-hover:text-primary-500/50 transition-colors duration-300"
									style={{
										fontFamily: 'Orbitron, sans-serif',
										fontSize: '1.75rem',
									}}
								>
									{String(index + 1).padStart(2, '0')}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<h2
										className="font-bold text-white mb-3 group-hover:text-primary-200 transition-colors duration-300"
										style={{
											fontFamily: 'Orbitron, sans-serif',
											fontSize: 'clamp(0.95rem, 2.2vw, 1.25rem)',
											lineHeight: 1.3,
										}}
									>
										{t(`Posts.${key}.title`)}
									</h2>
									<p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
										{t(`Posts.${key}.excerpt`)}
									</p>
								</div>

								{/* Date + arrow */}
								<div className="shrink-0 flex flex-col items-end gap-3 pt-1">
									<span className="font-mono text-xs text-secondary-400/60 tracking-wider whitespace-nowrap hidden sm:block">
										{t(`Posts.${key}.date`)}
									</span>
									<span className="font-mono text-primary-400/40 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300">
										→
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
