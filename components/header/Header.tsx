import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import UserMenu from './UserMenu';
import { InternalServerError } from '@/utils/errors';

export default async function Header() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// Obtener el nombre del usuario si está autenticado
		let userName = null;
		if (user) {
			const { data: userData, error } = await supabase
				.from('profiles')
				.select('full_name, username')
				.eq('id', user.id)
				.single();
			
			if (userData) {
				// Usar full_name si está disponible, de lo contrario usar username o el email como última opción
				userName = userData.full_name || userData.username || user.email;
			} else {
				userName = user.email; // Si no hay perfil, usar el email
			}
		}

		return (
			<header className="bg-surface backdrop-blur-sm bg-opacity-80 sticky top-0 z-50">
				<div className="container mx-auto p-4 flex justify-between items-center">
					<Link href="/">Calistenia</Link>
					<div className="flex gap-2 items-center">
						<NavLink
							href="/workouts"
							className="hover:text-primary-500 transition-colors ease-in"
						>
							Entrenamientos
						</NavLink>
						<NavLink
							href="/exercises"
							className="hover:text-primary-500 transition-colors ease-in"
						>
							Ejercicios
						</NavLink>
				            <NavLink
				                href="/roadmaps"
				                className="hover:text-primary-500 transition-colors ease-in"
				            >
				                Roadmaps
				            </NavLink>
						{user ? (
							<UserMenu userName={userName || 'Usuario'} />
						) : (
							<NavLink
								href="/login"
								className="bg-purple-500 rounded p-2 hover:bg-purple-600 transition text-black"
							>
								Login
							</NavLink>
						)}
					</div>
				</div>
			</header>
		);
	} catch (error) {
		// Lanzamos nuestro error personalizado para que sea capturado por error.tsx
		if (error instanceof InternalServerError) {
			throw error;  // Ya es un error personalizado, lo relanzamos
		}
		
		// Si es otro tipo de error, lo convertimos a nuestro formato de error personalizado
		console.error('Error en el componente Header:', error);
		throw new InternalServerError('Ocurrió un problema al cargar la navegación. Por favor, intenta nuevamente.');
	}
}
