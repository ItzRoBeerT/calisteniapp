import type { Config } from 'tailwindcss';

export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: '#121212',
				surface: '#1E1E1E',
				foreground: 'var(--foreground)',
				primary: {
					100: '#E3D9FF',
					200: '#D0B8FF',
					300: '#B79FFF',
					400: '#A386FF',
					500: '#BB86FC', // Color base
					600: '#9A64D6',
					700: '#7E4AB2',
					800: '#633D8F',
					900: '#4A2F6D',
				},
				secondary: {
					100: '#D3F9B9',
					200: '#A4F28C',
					300: '#76EB5F',
					400: '#47E534',
					500: '#32D74B', // Color base
					600: '#29B63F',
					700: '#1F9B35',
					800: '#177A2A',
					900: '#106220',
				},
				tertiary: {
					100: '#A2F1EB',
					200: '#76E5E0',
					300: '#4BCBD4',
					400: '#23B1C8',
					500: '#03DAC5', // Color base
					600: '#02B4A3',
					700: '#028F88',
					800: '#017A6E',
					900: '#006256',
				},
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'scaleX(0)' },
					'100%': { opacity: '1', transform: 'scaleX(1)' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.5s ease-out forwards',
			},
		},
	},
	plugins: [],
} satisfies Config;
