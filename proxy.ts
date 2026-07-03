import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

type PathnameMap = Record<string, string | Record<string, string>>;

type CompiledTemplate = {
	regex: RegExp;
	paramNames: string[];
};

function escapeRegex(value: string) {
	return value.replace(/pattern[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compileTemplate(template: string): CompiledTemplate {
	const tokenRegex = /\[\[?\.\.\.(\w+)\]\]|\[(\w+)\]/g;
	const paramNames: string[] = [];
	let pattern = '^';
	let lastIndex = 0;

	for (const match of template.matchAll(tokenRegex)) {
		const fullMatch = match[0];
		const start = match.index ?? 0;
		const catchAllName = match[1];
		const singleName = match[2];
		const paramName = catchAllName || singleName;

		pattern += escapeRegex(template.slice(lastIndex, start));

		if (catchAllName) {
			pattern += '(.*)';
		} else {
			pattern += '([^/]+)';
		}

		paramNames.push(paramName);
		lastIndex = start + fullMatch.length;
	}

	pattern += escapeRegex(template.slice(lastIndex));
	pattern += '$';

	return {
		regex: new RegExp(pattern),
		paramNames,
	};
}

function applyParams(template: string, params: Record<string, string>) {
	return template.replace(/\[\[?\.\.\.(\w+)\]\]|\[(\w+)\]/g, (_, catchAll, single) => {
		const name = (catchAll || single) as string;
		return params[name] ?? '';
	});
}

function routeSpecificity(template: string) {
	const dynamicSegments = (template.match(/\[\[?\.\.\.(\w+)\]\]|\[(\w+)\]/g) || []).length;
	const staticLength = template.replace(/\[\[?\.\.\.(\w+)\]\]|\[(\w+)\]/g, '').length;

	return {
		dynamicSegments,
		staticLength,
	};
}

function rewriteLocalizedPathname(request: NextRequest) {
	const url = request.nextUrl.clone();
	const { pathname } = url;

	const localeMatch = pathname.match(/^\/([^/]+)(\/.*)?$/);
	if (!localeMatch) {
		return null;
	}

	const locale = localeMatch[1];
	if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
		return null;
	}

	const localizedPath = localeMatch[2] || '/';
	const pathnames = routing.pathnames as PathnameMap;
	const sortedEntries = Object.entries(pathnames).sort(([aInternal], [bInternal]) => {
		const a = routeSpecificity(aInternal);
		const b = routeSpecificity(bInternal);

		if (a.dynamicSegments !== b.dynamicSegments) {
			return a.dynamicSegments - b.dynamicSegments;
		}

		return b.staticLength - a.staticLength;
	});

	for (const [internalTemplate, value] of sortedEntries) {
		const localizedTemplate =
			typeof value === 'string'
				? value
				: value[locale] || value[routing.defaultLocale] || internalTemplate;

		if (localizedTemplate === internalTemplate) {
			continue;
		}

		const { regex, paramNames } = compileTemplate(localizedTemplate);
		const match = localizedPath.match(regex);

		if (!match) {
			continue;
		}

		const params = Object.fromEntries(
			paramNames.map((name, index) => [name, match[index + 1] || ''])
		);
		const internalPath = applyParams(internalTemplate, params);

		if (internalPath !== localizedPath) {
			url.pathname = `/${locale}${internalPath}`;
			return NextResponse.rewrite(url);
		}
	}

	return null;
}

export default function proxy(request: NextRequest) {
	if (request.nextUrl.pathname === '/__webpack_hmr_admin') {
		return new NextResponse(null, { status: 204 });
	}

	const rewritten = rewriteLocalizedPathname(request);
	if (rewritten) {
		return rewritten;
	}

	return intlMiddleware(request);
}

export const config = {
	// Match the root and locale-prefixed routes while excluding static files and API routes.
	matcher: [
		'/',
		'/__webpack_hmr_admin',
		'/(en|es)/:path*',
		'/((?!api|_next|_vercel|.*\..*).*)',
	],
};