import NavLink from '@/components/header/NavLink';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Home() {
	const t = useTranslations('HomePage');
	const tGlobal = useTranslations('Globals');

	return (
		<div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen px-8 py-8 gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center w-full max-w-7xl mx-auto">
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
						Descubre nuestros ejercicios
					</NavLink>
				</section>

				{/* Featured Section */}
				<section className="w-full bg-gradient-to-r from-purple-900 to-purple-700 p-10 rounded-2xl text-white shadow-xl">
					<h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
						¿Y tú, cuántas dominadas puedes hacer?
					</h2>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">32%</p>
							<p className="text-sm">Solo el 32% puede hacer más de 10 dominadas seguidas</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">0-3</p>
							<p className="text-sm">El promedio inicial es de 0 a 3 dominadas</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">2 semanas</p>
							<p className="text-sm">Con entrenamiento constante, se pueden lograr 5 en solo 2 semanas</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
							<p className="text-4xl font-bold text-yellow-300 mb-2">564</p>
							<p className="text-sm">Récord mundial: 564 dominadas en 30 minutos</p>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="w-full">
					<h2 className="text-3xl font-bold text-center mb-12">Nuestras funcionalidades</h2>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						{/* Feature 1 */}
						<div className="flex flex-col items-center p-6 bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
								<Image
									src="/file.svg"
									alt="Crea rutinas personalizadas"
									width={32}
									height={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2 text-center">
								Crea tus propias rutinas
							</h3>
							<p className="text-center">
								Diseña rutinas adaptadas a tus objetivos y nivel. Organiza tus ejercicios y establece un plan personalizado.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="flex flex-col items-center p-6 bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
								<Image
									src="/thumb-up.svg"
									alt="Aprende ejercicios correctamente"
									width={32}
									height={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2 text-center">
								Aprende ejercicios correctamente
							</h3>
							<p className="text-center">
								Guías detalladas con técnicas correctas para prevenir lesiones y maximizar resultados en cada ejercicio.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="flex flex-col items-center p-6 bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
								<Image
									src="/window.svg"
									alt="IA para crear planes"
									width={32}
									height={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2 text-center">
								IA para tu entrenamiento
							</h3>
							<p className="text-center">
								Deja que nuestra inteligencia artificial cree un plan de entrenamiento adaptado a tus objetivos y nivel actual.
							</p>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full bg-surface p-10 rounded-xl text-center">
					<h2 className="text-3xl font-bold mb-4">
						Empieza hoy tu camino en calistenia
					</h2>
					<p className="mb-8 max-w-2xl mx-auto">
						Únete a nuestra comunidad y descubre cómo puedes superar tus límites con programas de entrenamiento progresivos.
					</p>
					<NavLink
						href={'/exercises'}
						className="inline-block bg-purple-600 hover:bg-purple-700 transition-colors px-8 py-4 rounded-lg text-white font-bold text-lg"
					>
						¡Comienza ahora!
					</NavLink>
				</section>

				
			</main>
		</div>
	);
}
