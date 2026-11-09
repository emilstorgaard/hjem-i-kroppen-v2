import type { RequestHandler } from '@sveltejs/kit';
import { SITE_URL } from '$lib/site';
import { THERAPY_SLUGS } from '$lib/therapies';
import { getContentByPath } from '$lib/server/umbraco';

// `slug` is the Umbraco content path, used to look up when the page was last changed
const pages: { path: string; slug?: string; priority: string; changefreq: string }[] = [
	{ path: '/', slug: 'forside', priority: '1.0', changefreq: 'monthly' },
	{ path: '/priser', /* slug: 'priser', */ priority: '0.8', changefreq: 'monthly' },
	{ path: '/om-mig', /* slug: 'om-mig', */ priority: '0.8', changefreq: 'monthly' },
	...THERAPY_SLUGS.map((slug) => ({ path: `/${slug}`, priority: '0.8', changefreq: 'monthly' }))
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
	const lastmods = await Promise.all(pages.map((page) => lastModified(page.slug)));

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
