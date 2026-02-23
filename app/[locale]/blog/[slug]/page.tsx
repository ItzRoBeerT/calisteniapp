import { BlogPostLayout } from '@/components/blog/BlogPostLayout';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { BLOG_POST_KEYS } from '../config';

const OTHER_LOCALE: Record<string, string> = { es: 'en', en: 'es' };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const t = await getTranslations('BlogPage');

	const postKey = BLOG_POST_KEYS.find(
		(key) => t(`Posts.${key}.slug` as Parameters<typeof t>[0]) === slug
	);

	if (!postKey) {
		return { title: 'Post not found' };
	}

	return {
		title: t(`Posts.${postKey}.title` as Parameters<typeof t>[0]),
		description: t(`Posts.${postKey}.excerpt` as Parameters<typeof t>[0]),
	};
}

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) {
	const { slug, locale } = await params;
	const t = await getTranslations('BlogPage');
	const tPost = await getTranslations('BlogPost');

	let postKey = BLOG_POST_KEYS.find(
		(key) => t(`Posts.${key}.slug` as Parameters<typeof t>[0]) === slug
	);

	if (!postKey) {
		// Slug not found in current locale — try the other locale (cross-locale navigation)
		const otherLocale = OTHER_LOCALE[locale] ?? 'en';
		const tOther = await getTranslations({ locale: otherLocale, namespace: 'BlogPage' });

		const crossLocaleKey = BLOG_POST_KEYS.find(
			(key) => tOther(`Posts.${key}.slug` as Parameters<typeof tOther>[0]) === slug
		);

		if (crossLocaleKey) {
			// Redirect to the correct slug in the current locale
			const correctSlug = t(`Posts.${crossLocaleKey}.slug` as Parameters<typeof t>[0]);
			redirect(`/${locale}/blog/${correctSlug}`);
		}

		notFound();
	}

	const title = t(`Posts.${postKey}.title` as Parameters<typeof t>[0]);
	const date = t(`Posts.${postKey}.date` as Parameters<typeof t>[0]);
	const content = t(`Posts.${postKey}.content` as Parameters<typeof t>[0]);

	return (
		<BlogPostLayout
			title={title}
			date={date}
			content={content}
			backLabel={tPost('backToBlog')}
			publishedOnLabel={tPost('publishedOn')}
			trainingLogLabel={tPost('trainingLog')}
			postNumber={postKey}
		/>
	);
}
