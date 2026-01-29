import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calistenia',
  description: 'Aprende calistenia con nosotros y con nuestra comunidad',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
