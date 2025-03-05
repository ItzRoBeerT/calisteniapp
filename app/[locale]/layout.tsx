import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Locale } from '@/i18n/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Calistenia',
	description: 'Aprende calistenia con nosotros y con nuestra comunidad',
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{locale: string}>;
}>) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html lang="en" className="min-h-full relative">
			<body className={inter.className}>
				<NextIntlClientProvider messages={messages}>
					<Header />
					<div className="color"></div>
					<main className="container mx-auto my-4 px-6 xl:px-0">
						{children}
					</main>
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
