import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';
import type { BlockList, PriceItemBlock } from './elementTypes';

export type PricesPageProperties = SeoProperties & {
	heading: string;
	image?: UmbracoMedia[];
	priceItems: BlockList<PriceItemBlock>;
};

export type PricesPage = {
	id: string;
	name: string;
	contentType: string;
	properties: PricesPageProperties;
};
