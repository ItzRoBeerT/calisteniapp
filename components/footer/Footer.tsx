import Link from 'next/link';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-background bottom-0 mt-auto w-full border-t border-gray-200 dark:border-gray-800">
			<div className="container mx-auto py-2 px-4 md:px-6">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
						© {currentYear} Calisteniapp. Todos los derechos reservados.
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Hecho con ♥ para la comunidad de calistenia
					</p>
				</div>
			</div>
		</footer>
	);
}
