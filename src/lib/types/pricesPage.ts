import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';
import type { BlockList, ElementBlock } from './elementTypes';

/**
 * The prices page ("Priser", alias `pricesPage`) exactly as the Delivery API returns it. Every property can be missing
 * or null while the editor is still filling in the page.
 */
export type PricesPageContent = {
	id: string;
	name: string;
	contentType: string;
	updateDate?: string;
	route: { path: string };
	properties: Partial<SeoProperties> & {
		heading?: string | null;
		image?: UmbracoMedia[] | null;
		/** Element type Pris (`priceItem`). `price` is a Numeric property, but a Textstring value is accepted too. */
		priceItems?: BlockList<
			ElementBlock<{
				title?: string | null;
				duration?: string | null;
				price?: number | string | null;
				unit?: string | null;
			}>
		> | null;
	};
};

export type PriceItem = {
	id: string;
	title: string;
	duration: string;
	/** Formatted for display, e.g. `2.000`. */
	price: string;
	unit: string;
};

export type PricesPageProperties = SeoProperties & {
	heading: string;
	image?: UmbracoMedia[];
	priceItems: PriceItem[];
};

/** The prices page ready for rendering. */
export type PricesPage = {
	id: string;
	name: string;
	updatedAt?: string;
	properties: PricesPageProperties;
};
