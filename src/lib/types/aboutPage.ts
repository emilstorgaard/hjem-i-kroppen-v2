import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';

export type AboutPageProperties = SeoProperties & {
	label: string;
	heading: string;
	subtitle: string;
	text: string;
	image?: UmbracoMedia[];
};

export type AboutPage = {
	id: string;
	name: string;
	contentType: string;
	properties: AboutPageProperties;
};
