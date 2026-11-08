import type { RequestHandler } from '@sveltejs/kit';
import { SITE_URL } from '$lib/site';
import { getContentByPath } from '$lib/server/umbraco';

// `slug` is the Umbraco content path, used to look up when the page was last changed
const pages = [{ path: '/', slug: 'forside', priority: '1.0', changefreq: 'monthly' }];

async function lastModified(slug: string): Promise<string | undefined> {
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
