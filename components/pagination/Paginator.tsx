'use client';
import { useTranslations } from 'next-intl';

export default function Paginator(props: {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}) {
	const { totalPages, currentPage, onPageChange } = props;
	const t = useTranslations('Paginator');

	const getPagesToShow = () => {
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);
			if (currentPage > 4) pages.push('...');

			const startPage = Math.max(2, currentPage - 2);
			const endPage = Math.min(totalPages - 1, currentPage + 2);

			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 3) pages.push('...');
			pages.push(totalPages);
		}

		return pages;
	};

	const pagesToShow = getPagesToShow();

	return (
		<div className="flex justify-center mt-6">
			<nav aria-label="Pagination">
				<ul className="inline-flex items-center gap-1.5">
					<li>
						<button
							onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
							style={{
								fontFamily: 'Space Grotesk, sans-serif',
								...(currentPage === 1
									? { borderColor: 'rgba(255,255,255,0.05)', color: '#374151', cursor: 'not-allowed' }
									: { borderColor: 'rgba(255,255,255,0.1)', color: '#6B7280', background: 'rgba(255,255,255,0.05)' }),
							}}
						>
							{t('previous')}
						</button>
					</li>

					{pagesToShow.map((page, index) => (
						<li key={index}>
							{typeof page === 'number' ? (
								<button
									onClick={() => onPageChange(page)}
									className="w-8 h-8 rounded-lg border text-xs font-medium transition-colors"
									style={{
										fontFamily: 'Space Grotesk, sans-serif',
										...(currentPage === page
											? { background: 'rgba(163,134,255,0.2)', borderColor: 'rgba(163,134,255,0.5)', color: '#a388ff' }
											: { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#6B7280' }),
									}}
								>
									{page}
								</button>
							) : (
								<span className="w-8 h-8 flex items-center justify-center text-xs text-[#374151]">
									{page}
								</span>
							)}
						</li>
					))}

					<li>
						<button
							onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
							style={{
								fontFamily: 'Space Grotesk, sans-serif',
								...(currentPage === totalPages
									? { borderColor: 'rgba(255,255,255,0.05)', color: '#374151', cursor: 'not-allowed' }
									: { borderColor: 'rgba(255,255,255,0.1)', color: '#6B7280', background: 'rgba(255,255,255,0.05)' }),
							}}
						>
							{t('next')}
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
