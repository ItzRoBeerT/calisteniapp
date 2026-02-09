import { getTranslations } from 'next-intl/server';

export default async function Footer() {
	const currentYear = new Date().getFullYear();
	const t = await getTranslations('Footer');

	return (
		<footer className="bg-background bottom-0 mt-auto w-full border-t border-gray-200 dark:border-gray-800">
			<div className="container mx-auto py-2 px-4 md:px-6">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
						©{currentYear} OpenCalisthenics. {t('copyright')}
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{t('madeWith', { heart: '♥' })}
					</p>
				</div>
			</div>
		</footer>
	);
}
