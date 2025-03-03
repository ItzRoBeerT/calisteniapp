import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Calistenia',
	description: 'Aprende calistenia con nosotros y con nuestra comunidad',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="min-h-full relative">
			<body className={inter.className}>
				<Header />
				<div className='color'></div>
				<main className="container mx-auto my-4 px-6 xl:px-0">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
