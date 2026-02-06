export default function Paginator(props: {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}) {
	const { totalPages, currentPage, onPageChange } = props;

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
		<div className="flex justify-center mt-4">
			<nav aria-label="Pagination">
				<ul className="inline-flex items-center gap-2">
					{/* Botón Anterior */}
					<li>
						<button
							onClick={() =>
								currentPage > 1 && onPageChange(currentPage - 1)
							}
							className={`rounded px-4 py-2 ${
								currentPage === 1
									? 'bg-gray-300 text-gray-600'
									: 'bg-white text-gray-800'
							}`}
							disabled={currentPage === 1}
						>
							Anterior
						</button>
					</li>

					{/* Páginas */}
					{pagesToShow.map((page, index) => (
						<li key={index}>
							{typeof page === 'number' ? (
								<button
									onClick={() => onPageChange(page)}
									className={`rounded px-4 py-2 ${
										currentPage === page
											? 'bg-primary-500 text-white'
											: 'bg-white text-gray-800'
									}`}
								>
									{page}
								</button>
							) : (
								<span className="px-4 py-2 text-gray-500">
									{page}
								</span>
							)}
						</li>
					))}

					{/* Botón Siguiente */}
					<li>
						<button
							onClick={() =>
								currentPage < totalPages &&
								onPageChange(currentPage + 1)
							}
							className={`rounded px-4 py-2 ${
								currentPage === totalPages
									? 'bg-gray-300 text-gray-600'
									: 'bg-white text-gray-800'
							}`}
							disabled={currentPage === totalPages}
						>
							Siguiente
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
