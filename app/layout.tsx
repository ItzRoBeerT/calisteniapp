import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import Header from "@/components/header/Header";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Calistenia",
  description: "Aprende calistenia con nosotros y con nuestra comunidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
