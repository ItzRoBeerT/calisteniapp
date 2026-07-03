'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Paginator from '@/components/pagination/Paginator';
import { BLOG_POST_KEYS } from '@/app/[locale]/blog/config';

const POSTS_PER_PAGE = 5;

export default function BlogList() {
	const t = useTranslations('BlogPage');
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(BLOG_POST_KEYS.length / POSTS_PER_PAGE);
	const start = (currentPage - 1) * POSTS_PER_PAGE;
	const visibleKeys = BLOG_POST_KEYS.slice(start, start + POSTS_PER_PAGE);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<>
			<ul>
				{visibleKeys.map((key, index) => {
					const globalIndex = start + index;
					return (
						<li key={key} className={`rv rv-d${Math.min(index + 5, 7)}`}>
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
										fontFamily: 'var(--font-heading), sans-serif',
										fontSize: '1.75rem',
									}}
								>
									{String(globalIndex + 1).padStart(2, '0')}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<h2
										className="font-bold text-white mb-3 group-hover:text-primary-200 transition-colors duration-300"
										style={{
											fontFamily: 'var(--font-heading), sans-serif',
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
					);
				})}
			</ul>
			<div className="mt-4">
				<Paginator
					totalPages={totalPages}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</>
	);
}
