import type { UmbracoMedia } from './umbraco';

/** A card on the home page, built from a therapy page in Umbraco. `slug` is the page's URL segment. */
export type DanceType = {
	slug: string;
	title: string;
	description: string;
	/** The therapy page's image, if it has one. */
	image?: UmbracoMedia;
	audience: string;
	participants: string;
};
