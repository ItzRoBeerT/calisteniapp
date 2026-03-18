import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './[locale]/globals.css';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'OpenCalisthenics',
  description: 'Aprende calistenia con nosotros y con nuestra comunidad',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} ${orbitron.variable} flex flex-col min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
