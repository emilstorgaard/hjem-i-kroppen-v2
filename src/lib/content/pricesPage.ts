import type { PricesPage } from '$lib/types/pricesPage';
import type { PriceItemBlock } from '$lib/types/elementTypes';

// Static placeholder shaped exactly like the Umbraco page, so only the loader changes later.
// TODO: Remove once the "priser" page exists in Umbraco.
const item = (
	id: string,
	title: string,
	duration: string,
	price: string,
	unit = 'kr.'
): PriceItemBlock => ({
	content: { contentType: 'priceItem', id, properties: { title, duration, price, unit } },
	settings: null
});

export const pricesPage: PricesPage = {
	id: 'placeholder-priser',
	name: 'Priser',
	contentType: 'pricesPage',
	properties: {
		metaTitle: 'Priser | Hjem i Kroppen',
		metaDescription: 'Se priser på danseterapi, gruppeterapi og samtaleterapi hos Hjem i Kroppen.',
		heading: 'Priser',
		priceItems: {
			items: [
				item('1', '1:1 Danseterapi', '60 min.', '700'),
				item('2', 'Gruppeterapi', '4 x 60 min.', '2.000'),
				item('3', '1:1 Samtaleterapi', '60 min.', '700')
			]
		}
	}
};
