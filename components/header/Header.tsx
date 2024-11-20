import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import NavLink from '@/components/header/NavLink';
import LogoutButton from './logout-button';

export default async function Header() {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const user = session?.user;

	return (
		<header className="bg-surface backdrop-blur-sm bg-opacity-80 sticky top-0 z-50">
			<div className="container mx-auto p-4 flex justify-between items-center">
				<Link href={'/'}>Calistenia</Link>
				<div className="flex gap-2 items-center">
					<NavLink
						href={'/workouts'}
						className="hover:text-primary transition-colors ease-in"
					>
						Entrenamientos
					</NavLink>
					<NavLink
						href={'/exercises'}
						className="hover:text-primary transition-colors ease-in"
					>
						Ejercicios
					</NavLink>
					{user ? (
						<LogoutButton />
					) : (
						<NavLink
							href={'/login'}
							className="bg-secondary rounded p-2 hover:bg-secondaryHover transition text-black"
						>
							Login
						</NavLink>
					)}
				</div>
			</div>
		</header>
	);
}
