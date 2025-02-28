import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calisteniapp Blog',
  description: 'Artículos sobre calistenia, rutinas, consejos y novedades de la app.',
};

const blogPosts = [
  {
    title: 'Introducción a la Calistenia',
    slug: 'introduccion-a-la-calistenia',
    excerpt: 'Descubre los fundamentos de la calistenia y cómo empezar tu entrenamiento.',
  },
  {
    title: 'Novedades: Integración de IA para Rutinas Personalizadas',
    slug: 'ia-rutinas-personalizadas',
    excerpt: 'Ahora puedes generar rutinas personalizadas con nuestra nueva función de IA.',
  },
  {
    title: 'Progresiones Calisténicas: Del Nivel Básico al Avanzado',
    slug: 'progresiones-calistenicas',
    excerpt: 'Aprende cómo avanzar en tus ejercicios de calistenia con progresiones efectivas.',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Nuestro Blog</h1>
      <p className="mb-6">
        Bienvenido al blog de Calisteniapp. Aquí encontrarás artículos, guías y consejos para mejorar tu entrenamiento de calistenia y aprovechar al máximo nuestra aplicación.
      </p>
      <ul>
        {blogPosts.map((post) => (
          <li key={post.slug} className="mb-4">
            <Link href={`/blog/${post.slug}`} className="block p-4 rounded-lg bg-surface">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}