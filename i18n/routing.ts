import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ['en', 'es'],

	// Used when no locale matches
	defaultLocale: 'es',

	// Localized pathnames
	pathnames: {
		'/': '/',
		'/exercises': {
			en: '/exercises',
			es: '/ejercicios',
		},
		'/exercises/[slug]': {
			en: '/exercises/[slug]',
			es: '/ejercicios/[slug]',
		},
		'/workouts': {
			en: '/workouts',
			es: '/entrenamientos',
		},
		'/workouts/[id]': {
			en: '/workouts/[id]',
			es: '/entrenamientos/[id]',
		},
		'/workouts/[id]/edit': {
			en: '/workouts/[id]/edit',
			es: '/entrenamientos/[id]/editar',
		},
		'/workouts/new': {
			en: '/workouts/new',
			es: '/entrenamientos/nuevo',
		},
		'/roadmaps': {
			en: '/roadmaps',
			es: '/roadmaps',
		},
		'/roadmaps/[id]': {
			en: '/roadmaps/[id]',
			es: '/roadmaps/[id]',
		},
		'/roadmaps/build': {
			en: '/roadmaps/build',
			es: '/roadmaps/crear',
		},
		'/blog': {
			en: '/blog',
			es: '/blog',
		},
		'/blog/[slug]': {
			en: '/blog/[slug]',
			es: '/blog/[slug]',
		},
		'/login': {
			en: '/login',
			es: '/iniciar-sesion',
		},
		'/register': {
			en: '/register',
			es: '/registro',
		},
	},
});
