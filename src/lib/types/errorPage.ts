import type { SeoProperties } from './seo';

export type ErrorPageProperties = SeoProperties & {
	heading: string;
	bodyText?: string;
	buttonText: string;
};

export type ErrorPage = {
	id: string;
	name: string;
	contentType: string;
	properties: ErrorPageProperties;
};
