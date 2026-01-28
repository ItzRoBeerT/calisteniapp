import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Home() {
	const t = useTranslations('HomePage');
	const tGlobal = useTranslations('Globals');

	return (
		<div className="w-full">
			<main className="flex flex-col gap-16 items-center w-full py-8">
				{/* Hero Section */}
				<section className="flex flex-col items-center w-full gap-6 bg-surface p-8 rounded-lg shadow-lg border-l-4 border-purple-600">
					<h1 className="text-5xl font-bold text-center">
						<span>{t('Blog.welcome')}</span>
						<span className="text-primary ml-2">{tGlobal('brand')}</span>
					</h1>
					<p className="text-center text-lg max-w-3xl">
						{t('about')}
					</p>
					<NavLink
						href={'/exercises'}
						className="bg-purple-600 hover:bg-purple-700 transition-colors px-8 py-4 rounded-lg text-white font-bold text-lg mt-4"
					>
						{t('discoverExercises')}
					</NavLink>
				</section>

				{/* Featured Section */}
				<section className="w-full bg-gradient-to-r from-purple-900 to-purple-700 p-10 rounded-2xl text-white shadow-xl">
					<h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
						{t('featuredSection.title')}
					</h2>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">32%</p>
							<p className="text-sm">{t('featuredSection.stat1')}</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">0-3</p>
							<p className="text-sm">{t('featuredSection.stat2')}</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">2 {t('featuredSection.weeks')}</p>
							<p className="text-sm">{t('featuredSection.stat3')}</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">564</p>
							<p className="text-sm">{t('featuredSection.stat4')}</p>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="w-full">
					<h2 className="text-3xl font-bold text-center mb-12">{t('features.title')}</h2>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						{/* Feature 1 */}
						<div className="flex flex-col items-center p-6 bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
								<Image
									src="/file.svg"
									alt={t('features.feature1.alt')}
									width={32}
									height={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2 text-center">
								{t('features.feature1.title')}
							</h3>
							<p className="text-center">
								{t('features.feature1.description')}
							</p>
						</div>

						{/* Feature 2 */}
						<div className="flex flex-col items-center p-6 bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
								<Image
									src="/thumb-up.svg"
									alt={t('features.feature2.alt')}
									width={32}
									height={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2 text-center">
								{t('features.feature2.title')}
							</h3>
							<p className="text-center">
								{t('features.feature2.description')}
							</p>
						</div>

						{/* Feature 3 */}
						<div className="flex flex-col items-center p-6 bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
								<Image
									src="/window.svg"
									alt={t('features.feature3.alt')}
									width={32}
									height={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2 text-center">
								{t('features.feature3.title')}
							</h3>
							<p className="text-center">
								{t('features.feature3.description')}
							</p>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full bg-surface p-10 rounded-xl text-center">
					<h2 className="text-3xl font-bold mb-4">
						{t('cta.title')}
					</h2>
					<p className="mb-8 max-w-2xl mx-auto">
						{t('cta.description')}
					</p>
					<NavLink
						href={'/exercises'}
						className="inline-block bg-purple-600 hover:bg-purple-700 transition-colors px-8 py-4 rounded-lg text-white font-bold text-lg"
					>
						{t('cta.button')}
					</NavLink>
				</section>

				
			</main>
		</div>
	);
}
