import { error } from '@sveltejs/kit';
import { getContentItems } from './umbraco';
import { toParagraphs } from './content';
import type { AboutPage, AboutPageContent } from '$lib/types/aboutPage';

function toAboutPage(content: AboutPageContent): AboutPage {
	const p = content.properties;
	const heading = p.heading?.trim() || content.name;
	const paragraphs = toParagraphs(p.text);
	return {
		id: content.id,
		name: content.name,
		updatedAt: content.updateDate,
		properties: {
			metaTitle: p.metaTitle?.trim() || `${content.name} | Hjem i Kroppen`,
			metaDescription: p.metaDescription?.trim() || paragraphs[0] || '',
			ogImage: p.ogImage ?? undefined,
			label: p.label?.trim() || content.name,
			heading,
			subtitle: p.subtitle?.trim() ?? '',
			paragraphs,
			image: p.image ?? undefined
		}
	};
}

/**
 * The published about page. Found by its document type, so it does not matter where it sits in the Umbraco tree or what
 * it is called. Returns null when it is not published.
 */
export async function findAboutPage(fetchFn?: typeof fetch): Promise<AboutPage | null> {
	const [item] = await getContentItems<AboutPageContent>(
		'filter=contentType:aboutPage&take=1',
		fetchFn
	);
	return item ? toAboutPage(item) : null;
}

/** Like `findAboutPage`, but a missing page is a 404. */
export async function getAboutPage(fetchFn?: typeof fetch): Promise<AboutPage> {
	const page = await findAboutPage(fetchFn);
	if (!page) error(404, 'Not found');
	return page;
}
