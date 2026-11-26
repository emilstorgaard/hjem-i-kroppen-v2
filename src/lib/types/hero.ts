import type { UmbracoMedia } from './umbraco';

export type HeroProperties = {
	/** The title's lines, e.g. `['DANS DIG', 'FRI']`. */
	heroTitle: string[];
	/** One entry per line of the hero text. */
	heroText: string[];
	/** Background video. Missing means a plain dark background. */
	heroVideo?: UmbracoMedia;
};
