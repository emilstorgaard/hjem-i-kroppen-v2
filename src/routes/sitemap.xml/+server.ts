import type { RequestHandler } from '@sveltejs/kit';
import { SITE_URL } from '$lib/site';
import { getContentByPath } from '$lib/server/umbraco';
import { getTherapyPages } from '$lib/server/therapyPages';
import { findAboutPage } from '$lib/server/aboutPage';
import { findPricesPage } from '$lib/server/pricesPage';

type SitemapPage = {
	path: string;
	slug?: string;
	lastmod?: string;
	priority: string;
	changefreq: string;
};

// `slug` is the Umbraco content path, used to look up when the page was last changed
const staticPages: SitemapPage[] = [
	{ path: '/', slug: 'forside', priority: '1.0', changefreq: 'monthly' },
	{ path: '/book', priority: '0.9', changefreq: 'daily' }
];

async function lastModified(slug?: string): Promise<string | undefined> {
	if (!slug) return undefined;
	try {
		const item = await getContentByPath<{ updateDate?: string }>(slug);
		return item.updateDate ? new Date(item.updateDate).toISOString() : undefined;
	} catch {
		return undefined;
	}
}

export const GET: RequestHandler = async () => {
	// Therapy pages, the about page and the prices page are created in Umbraco, which also tells when each was last changed.
	const [therapyPages, aboutPage, pricesPage] = await Promise.all([
		getTherapyPages().catch(() => []),
		findAboutPage().catch(() => null),
		findPricesPage().catch(() => null)
	]);
	const pages: SitemapPage[] = [
		...staticPages,
		{ path: '/priser', lastmod: pricesPage?.updatedAt, priority: '0.8', changefreq: 'monthly' },
		{ path: '/om-mig', lastmod: aboutPage?.updatedAt, priority: '0.8', changefreq: 'monthly' },
		...therapyPages.map((page) => ({
			path: `/${page.slug}`,
			lastmod: page.updatedAt,
			priority: '0.8',
			changefreq: 'monthly'
		}))
	];
	const lastmods = await Promise.all(
		pages.map(async (page) =>
			page.lastmod ? new Date(page.lastmod).toISOString() : lastModified(page.slug)
		)
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page, i) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>${lastmods[i] ? `\n    <lastmod>${lastmods[i]}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
