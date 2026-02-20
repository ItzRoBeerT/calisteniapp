import { BlogPostLayout } from '@/components/blog/BlogPostLayout';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const POST_KEYS = ['1', '2', '3'] as const;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const t = await getTranslations('BlogPage');

	const postKey = POST_KEYS.find(
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
	const { slug } = await params;
	const t = await getTranslations('BlogPage');
	const tPost = await getTranslations('BlogPost');

	const postKey = POST_KEYS.find(
		(key) => t(`Posts.${key}.slug` as Parameters<typeof t>[0]) === slug
	);

	if (!postKey) {
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
