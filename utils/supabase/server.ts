import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { InternalServerError } from '../errors';

export async function createClient() {
	const cookieStore = await cookies();

	// Verificar si las variables de entorno necesarias están configuradas
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
		throw new InternalServerError(
			'No se pudo conectar con la base de datos. Por favor, contacta al administrador.'
		);
	}

	try {
		// Create a server's supabase client with newly configured cookie,
		// which could be used to maintain user's session
		return createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						try {
							cookiesToSet.forEach(({ name, value, options }) =>
								cookieStore.set(name, value, options)
							);
						} catch {
							// The `setAll` method was called from a Server Component.
							// This can be ignored if you have middleware refreshing
							// user sessions.
						}
					},
				},
			}
		);
	} catch (error) {
		console.error('Error al crear el cliente de Supabase:', error);
		throw new InternalServerError(
			'Hubo un problema al conectarse con la base de datos. Por favor, inténtalo de nuevo más tarde.'
		);
	}
}
