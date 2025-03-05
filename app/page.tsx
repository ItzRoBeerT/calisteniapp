import NavLink from '@/components/header/NavLink';
import Image from 'next/image';

export default function Home() {
	return (
		<div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen px-8 py-8 gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center sm:items-start">
				<section className="flex flex-col items-center w-full gap-6 bg-surface p-8 rounded-lg">
					<h1 className="text-4xl font-bold text-center">
						Bienvenido a{' '}
						<label className="text-primary">Calistenia</label>
					</h1>
					<p className="text-center">
						La calistenia es una disciplina de entrenamiento físico
						que utiliza el peso corporal como resistencia. En
						Calistenia, encontrarás una variedad de entrenamientos y
						ejercicios para mejorar tu fuerza y flexibilidad.
					</p>
					<NavLink
						href={'/blog'}
						className="bg-purple-600 p-4 rounded-lg"
					>
						Visita Nuestro Blog
					</NavLink>
				</section>
				<section className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
					<div className="text-center sm:text-left">
						<h2 className="text-xl font-bold mb-2">
							Consulta tus ejercicios de calistenia favoritos
						</h2>
						<p>
							Explora una variedad de ejercicios diseñados para
							mejorar tu fuerza y flexibilidad.
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
							Revisa todos los entrenamientos y puntúalos
						</h2>
						<p>
							Evalúa y comenta sobre los entrenamientos que te
							ayudan a alcanzar tus metas.
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
							Genera comunidad comentando y compartiendo
						</h2>
						<p>
							Comparte tus experiencias, consejos y progresos con
							otros usuarios. Juntos podemos construir una
							comunidad de apoyo y motivación.
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
							Comparte consejos y curiosidades de calistenia
						</h2>
						<p>
							Todos tenemos algo que aportar. Comparte tus mejores
							consejos, técnicas y curiosidades sobre calistenia
							con la comunidad.
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
