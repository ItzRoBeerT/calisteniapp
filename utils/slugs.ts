export function createSlug(slug: string) {
	return slug.toLowerCase().replace(/\s+/g, '-');
}

export function desSlugify(slug: string) {
	return slug.replace(/-/g, ' ');
}
