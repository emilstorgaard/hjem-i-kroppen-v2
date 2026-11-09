import type { UmbracoMedia } from './umbraco';
import type { SeoProperties } from './seo';
import type { DanceType } from './danceType';
import type { Testimonial } from './testimonial';
import type { BookingOption } from './bookingOption';

export type TherapyPageProperties = SeoProperties &
	Pick<DanceType, 'audience' | 'participants'> & {
		heading: string;
		info: string;
		image?: UmbracoMedia[];
		testimonials: Testimonial[];
		bookingOptions?: BookingOption[];
	};

export type TherapyPage = {
	id: string;
	name: string;
	contentType: string;
	properties: TherapyPageProperties;
};
