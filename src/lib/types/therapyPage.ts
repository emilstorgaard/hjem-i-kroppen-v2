import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';
import type { Testimonial } from './testimonial';
import type { BookingOptionRef } from './bookingOption';
import type { BlockList, ElementBlock } from './elementTypes';

/**
 * A therapy page ("Terapiside", alias `therapyPage`) exactly as the Delivery API returns it. Every property can be
 * missing or null while the editor is still filling in the page.
 */
export type TherapyPageContent = {
	id: string;
	name: string;
	contentType: string;
	updateDate?: string;
	route: { path: string };
	properties: Partial<SeoProperties> & {
		heading?: string | null;
		info?: string | null;
		image?: UmbracoMedia[] | null;
		/** Optional image for the home page card. Falls back to `image`. */
		cardImage?: UmbracoMedia[] | null;
		audience?: string | null;
		participants?: string | null;
		/** Element type Anmeldelse: `quote`, `author` ("name" is reserved in Umbraco) and `rating`. */
		testimonials?: BlockList<
			ElementBlock<{ quote?: string | null; author?: string | null; rating?: number | null }>
		> | null;
		/** Element type Bookingmulighed: optional `title` and `serviceType` (id from the service type picker). */
		bookingOptions?: BlockList<
			ElementBlock<{ title?: string | null; serviceType?: string | null }>
		> | null;
		/** Id of a booking category, chosen with the custom category picker. */
		bookingCategory?: string | null;
	};
};

export type TherapyPageProperties = SeoProperties & {
	heading: string;
	info: string;
	image?: UmbracoMedia[];
	cardImage?: UmbracoMedia[];
	audience: string;
	participants: string;
	testimonials: Testimonial[];
	bookingOptions: BookingOptionRef[];
	/** Booking category the "Book" buttons filter on. Null when none is chosen. */
	bookingCategoryId: string | null;
};

/** A therapy page ready for rendering. `slug` is the last segment of its Umbraco URL, e.g. `danseterapi`. */
export type TherapyPage = {
	id: string;
	name: string;
	slug: string;
	updatedAt?: string;
	properties: TherapyPageProperties;
};
