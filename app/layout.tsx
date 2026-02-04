import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './[locale]/globals.css';

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
    <html lang="es" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
