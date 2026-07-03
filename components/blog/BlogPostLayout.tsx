'use client';

import { Link } from '@/i18n/navigation';

interface BlogPostLayoutProps {
	title: string;
	date: string;
	content: string;
	backLabel: string;
	publishedOnLabel: string;
	trainingLogLabel: string;
	postNumber: string;
}

export function BlogPostLayout({
	title,
	date,
	content,
	backLabel,
	publishedOnLabel,
	trainingLogLabel,
	postNumber,
}: BlogPostLayoutProps) {
	const paragraphs = content.split('\n\n').filter(Boolean);
	const wordCount = content.split(/\s+/).filter(Boolean).length;
	const readingTime = Math.max(1, Math.ceil(wordCount / 200));

	const firstParagraph = paragraphs[0] ?? '';
	const firstLetter = firstParagraph[0] ?? '';
	const firstParaRest = firstParagraph.slice(1);
	const restParagraphs = paragraphs.slice(1);

	const publicationYear = date.match(/\d{4}/)?.[0] ?? '';

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
			`}</style>

			{/* Subtle grid background */}
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

			{/* Ambient radial glow */}
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

			{/* Main content */}
			<div className="relative z-10 container mx-auto max-w-4xl px-6 pt-6 pb-16">

				{/* Article header */}
				<header className="relative mb-14">
					{/* Ghost watermark year */}
					<div
						className="absolute select-none pointer-events-none"
						style={{
							fontFamily: 'var(--font-heading), sans-serif',
							fontSize: 'clamp(5rem, 18vw, 12rem)',
							fontWeight: 700,
							color: 'rgba(187,134,252,0.038)',
							lineHeight: 1,
							top: '-0.25rem',
							right: '0',
							zIndex: 0,
						}}
					>
						{publicationYear}
					</div>

					<div className="relative z-10">
						{/* Overline */}
						<div className="rv rv-d1 flex items-center gap-3 mb-6">
							<div
								className="w-5 h-[2px] bg-secondary-400"
								style={{ boxShadow: '0 0 8px rgba(50,215,75,0.7)' }}
							/>
							<span className="font-mono text-xs tracking-[0.38em] uppercase text-secondary-400">
								{trainingLogLabel}
							</span>
						</div>

						{/* Title */}
						<h1
							className="rv rv-d2 font-bold text-white leading-tight mb-8"
							style={{
								fontFamily: 'var(--font-heading), sans-serif',
								fontSize: 'clamp(1.9rem, 5.5vw, 3.6rem)',
								textShadow: '0 0 80px rgba(187,134,252,0.22)',
								lineHeight: 1.12,
							}}
						>
							{title}
						</h1>

						{/* Meta bar */}
						<div className="rv rv-d3 flex flex-wrap items-center gap-5 font-mono text-xs">
							<div className="flex items-center gap-2">
								<span
									className="w-1.5 h-1.5 rounded-full bg-secondary-400"
									style={{ boxShadow: '0 0 7px rgba(50,215,75,0.9)' }}
								/>
								<span className="text-gray-500 tracking-widest uppercase">
									{publishedOnLabel}
								</span>
								<span className="text-secondary-300 tracking-wide">{date}</span>
							</div>
							<span className="text-gray-700">·</span>
							<div className="flex items-center gap-2 text-gray-500">
								<svg
									width="10"
									height="12"
									viewBox="0 0 10 12"
									fill="currentColor"
									className="opacity-50"
								>
									<rect x="0" y="0" width="10" height="1.5" rx="0.75" />
									<rect x="0" y="3.5" width="7" height="1.5" rx="0.75" />
									<rect x="0" y="7" width="10" height="1.5" rx="0.75" />
									<rect x="0" y="10.5" width="5" height="1.5" rx="0.75" />
								</svg>
								<span className="tracking-widest">{readingTime} MIN</span>
							</div>
						</div>
					</div>

					{/* Decorative divider + scroll progress */}
					<div className="rv rv-d4 mt-10">
						<div className="flex items-center gap-3 mb-3">
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
						</div>
				</header>

				{/* Article body */}
				<article className="rv rv-d5 max-w-3xl mx-auto">
					{/* First paragraph with drop cap and left accent */}
					{firstParagraph && (
						<div className="relative mb-8">
							<div
								className="absolute left-0 top-0 bottom-0 w-[2px]"
								style={{
									background:
										'linear-gradient(to bottom, rgba(187,134,252,0.6), rgba(187,134,252,0.05))',
								}}
							/>
							<p
								className="leading-[1.9] text-gray-300 text-lg"
								style={{ paddingLeft: '1.25rem' }}
							>
								<span
									style={{
										fontFamily: 'var(--font-heading), sans-serif',
										fontSize: '3.4rem',
										fontWeight: 700,
										float: 'left',
										lineHeight: '0.83',
										marginRight: '0.07em',
										marginTop: '0.14em',
										color: '#A386FF',
										textShadow: '0 0 28px rgba(163,134,255,0.65)',
									}}
								>
									{firstLetter}
								</span>
								{firstParaRest}
							</p>
						</div>
					)}

					{/* Remaining paragraphs */}
					{restParagraphs.map((paragraph, i) => (
						<p
							key={i}
							className="leading-[1.9] text-gray-300 text-base mb-8"
						>
							{paragraph}
						</p>
					))}
				</article>

				{/* Footer */}
				<footer className="mt-16 pt-10 border-t border-white/5">
					<div className="flex items-center gap-4 mb-10">
						<div className="h-px flex-1 bg-gradient-to-l from-primary-500/30 to-transparent" />
						<div className="flex gap-1.5 items-center">
							<span className="block w-1 h-1 rounded-full bg-primary-400/25" />
							<span
								className="block w-2 h-2 rotate-45 border border-primary-500/60"
								style={{ boxShadow: '0 0 5px rgba(187,134,252,0.25)' }}
							/>
							<span className="block w-1 h-1 rounded-full bg-primary-400/25" />
						</div>
						<div className="h-px flex-1 bg-gradient-to-r from-primary-500/30 to-transparent" />
					</div>
					<div className="text-center">
						<Link
							href="/blog"
							className="group inline-flex items-center gap-3 px-8 py-3 font-mono text-xs tracking-[0.22em] uppercase text-primary-400 border border-primary-500/35 rounded hover:bg-primary-500/10 hover:border-primary-500/60 hover:text-primary-300 transition-all duration-300"
						>
							<span className="transition-transform duration-300 group-hover:-translate-x-1">
								←
							</span>
							{backLabel}
						</Link>
					</div>
				</footer>
			</div>
		</div>
	);
}
