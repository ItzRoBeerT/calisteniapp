export const BLOG_POST_KEYS = ['1', '2', '3', '4'] as const;
export type BlogPostKey = (typeof BLOG_POST_KEYS)[number];
