import { error } from '@sveltejs/kit';
import { getContentItems } from './umbraco';
import type { PricesPage, PricesPageContent } from '$lib/types/pricesPage';

/** 2000 → `2.000`. A text value is kept as the editor wrote it. */
function formatPrice(price: number | string | null | undefined): string {
	if (typeof price === 'number') return price.toLocaleString('da-DK');
	return price?.trim() ?? '';
}

function toPricesPage(content: PricesPageContent): PricesPage {
	const p = content.properties;
	const heading = p.heading?.trim() || content.name;
	return {
		id: content.id,
		name: content.name,
		updatedAt: content.updateDate,
		properties: {
			metaTitle: p.metaTitle?.trim() || `${heading} | Hjem i Kroppen`,
			metaDescription: p.metaDescription?.trim() || 'Se priser på terapi hos Hjem i Kroppen.',
			ogImage: p.ogImage ?? undefined,
			heading,
			image: p.image ?? undefined,
			priceItems: (p.priceItems?.items ?? [])
				.map((b) => ({ id: b.content.id, ...b.content.properties }))
				.filter((i) => !!i.title?.trim())
				.map((i) => ({
					id: i.id,
					title: i.title!.trim(),
					duration: i.duration?.trim() ?? '',
					price: formatPrice(i.price),
					unit: i.unit?.trim() || 'kr.'
				}))
		}
	};
}

/**
 * The published prices page. Found by its document type, so it does not matter where it sits in the Umbraco tree or
 * what it is called. Returns null when it is not published.
 */
export async function findPricesPage(fetchFn?: typeof fetch): Promise<PricesPage | null> {
	const [item] = await getContentItems<PricesPageContent>(
		'filter=contentType:pricesPage&take=1',
		fetchFn
	);
	return item ? toPricesPage(item) : null;
}

/** Like `findPricesPage`, but a missing page is a 404. */
export async function getPricesPage(fetchFn?: typeof fetch): Promise<PricesPage> {
	const page = await findPricesPage(fetchFn);
	if (!page) error(404, 'Not found');
	return page;
}
