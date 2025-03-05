import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
	title: 'Calisteniapp Blog',
	description:
		'Artículos sobre calistenia, rutinas, consejos y novedades de la app.',
};

export default function BlogPage() {
	const t = useTranslations('BlogPage');

	//TODO: Actualizar a una forma de iterar los blogs más dinámica
	const keys = ["1", "2", "3"] as const;

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-4 text-center">
				{t('title')}
			</h1>
			<p className="mb-6 text-center">{t('welcome')}</p>
			<ul>
				{keys.map((key) => (
					<li key={key} className="mb-4">
						<Link
							href={`/blog/${t(`Posts.${key}.slug`)}`}
							className="block p-4 rounded-lg bg-surface"
						>
							<h2 className="text-xl font-semibold mb-2">
								{t(`Posts.${key}.title`)}
							</h2>
							<p className="">{t(`Posts.${key}.excerpt`)}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
