import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import ToastContainer from '@/components/ui/ToastContainer';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Locale } from '@/i18n/navigation';
import ErrorBoundary from './error-boundary';
import ErrorPage from './error';

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<NextIntlClientProvider messages={messages}>
			<ErrorBoundary fallback={ErrorPage}>
				<Header />
				<main className="container mx-auto my-4 px-6 xl:px-0 flex-grow">
					{children}
				</main>
				<Footer />
				<ToastContainer />
			</ErrorBoundary>
		</NextIntlClientProvider>
	);
}
