import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Home() {

	const t = useTranslations('HomePage')
	const tGlobal = useTranslations('Globals')
	
	return (
		<div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen px-8 py-8 gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center sm:items-start">
				<section className="flex flex-col items-center w-full gap-6 bg-surface p-8 rounded-lg">
					<h1 className="text-4xl font-bold text-center">
						{t('Blog.welcome')}
						<label className="text-primary">{tGlobal('brand')}</label>
					</h1>
					<p className="text-center">
						{t('about')}
					</p>
					<NavLink
						href={'/blog'}
						className="bg-purple-600 p-4 rounded-lg"
					>
						{t('Blog.visit')}
					</NavLink>
				</section>
				<section className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
					<div className="text-center sm:text-left">
						<h2 className="text-xl font-bold mb-2">
							{t('favourites')}
						</h2>
						<p>
							{t('explore')}
						</p>
					</div>
					<Image
						src="https://nachogst.com/wp-content/uploads/2023/04/1e027aa3-76a0-4488-afff-13eba5fdd879.webp"
						alt="Generando comunidad"
						width={300}
						height={172}
						className="rounded-lg"
						priority
					/>
				</section>
				<section className="flex flex-col items-center sm:flex-row-reverse justify-between w-full gap-6">
					<div className="text-center sm:text-right">
						<h2 className="text-xl font-bold mb-2">
							{t('check')}
						</h2>
						<p>
							{t('comment')}
						</p>
					</div>
					<Image
						src="https://nachogst.com/wp-content/uploads/2024/06/a56c89e4-03bf-49f5-8a39-62056cf1f717.webp"
						alt="Consejos y curiosidades"
						width={300}
						height={172}
						className="rounded-lg"
					/>
				</section>
				<section className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
					<div className="text-center sm:text-left">
						<h2 className="text-xl font-bold mb-2">
							{t('community')}
						</h2>
						<p>
							{t('share')}
						</p>
					</div>
					<Image
						src="https://nachogst.com/wp-content/uploads/2024/06/07ee8b21-3a73-45a5-a754-d7e104910b75.webp"
						alt="Generando comunidad"
						width={300}
						height={172}
						className="rounded-lg"
					/>
				</section>
				<section className="flex flex-col items-center sm:flex-row-reverse justify-between w-full gap-6">
					<div className="text-center sm:text-right">
						<h2 className="text-xl font-bold mb-2">
							{t('share_tips')}
						</h2>
						<p>
							{t('share_text')}
						</p>
					</div>
					<Image
						src="https://nachogst.com/wp-content/uploads/2024/06/07ee8b21-3a73-45a5-a754-d7e104910b75.webp"
						alt="Consejos y curiosidades"
						width={300}
						height={172}
						className="rounded-lg"
					/>
				</section>
			</main>
		</div>
	);
}
