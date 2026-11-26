import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';
import type { Testimonial, TestimonialElement } from './testimonial';
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
		audience?: string | null;
		participants?: string | null;
		/** Element type Anmeldelse. */
		testimonials?: BlockList<ElementBlock<TestimonialElement>> | null;
		testimonialsLabel?: string | null;
		testimonialsHeading?: string | null;
		bookingOptionsLabel?: string | null;
		bookingOptionsHeading?: string | null;
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
	audience: string;
	participants: string;
	testimonials: Testimonial[];
	/** The page's own label and heading above the testimonials. Empty means the default text. */
	testimonialsLabel: string;
	testimonialsHeading: string;
	/** Label and heading above the booking options. The defaults apply when empty. */
	bookingOptionsLabel: string;
	bookingOptionsHeading: string;
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
