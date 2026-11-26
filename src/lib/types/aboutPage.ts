import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';

/**
 * The about page ("Om mig", alias `aboutPage`) exactly as the Delivery API returns it. Every property can be missing or
 * null while the editor is still filling in the page.
 */
export type AboutPageContent = {
	id: string;
	name: string;
	contentType: string;
	updateDate?: string;
	route: { path: string };
	properties: Partial<SeoProperties> & {
		label?: string | null;
		heading?: string | null;
		subtitle?: string | null;
		/** Textarea. Paragraphs are separated by a blank line. */
		text?: string | null;
		image?: UmbracoMedia[] | null;
	};
};

export type AboutPageProperties = SeoProperties & {
	label: string;
	heading: string;
	subtitle: string;
	/** The text split into paragraphs. */
	paragraphs: string[];
	image?: UmbracoMedia[];
};

/** The about page ready for rendering. */
export type AboutPage = {
	id: string;
	name: string;
	updatedAt?: string;
	properties: AboutPageProperties;
};
