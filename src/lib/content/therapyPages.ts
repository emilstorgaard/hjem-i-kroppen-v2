import { danceTypes } from '$lib/content/danceTypes';
import { therapyTestimonials } from '$lib/content/therapyTestimonials';
import type { TherapySlug } from '$lib/therapies';
import type { BookingOption } from '$lib/types/bookingOption';
import type { TherapyPage } from '$lib/types/therapyPage';

// Static placeholders shaped exactly like the Umbraco pages, so only the loader changes later.
// Info text comes from the home page cards.
// TODO: Remove once the therapy pages exist in Umbraco.
function build(slug: TherapySlug, bookingOptions?: BookingOption[]): TherapyPage {
	const type = danceTypes.find((t) => t.slug === slug)!;

	return {
		id: `placeholder-${slug}`,
		name: type.title,
		contentType: 'therapyPage',
		properties: {
			metaTitle: `${type.title} | Hjem i Kroppen`,
			metaDescription: type.description,
			heading: type.title,
			info: type.description,
			audience: type.audience,
			participants: type.participants,
			testimonials: therapyTestimonials[slug],
			bookingOptions
		}
	};
}

export const therapyPages: Record<TherapySlug, TherapyPage> = {
	danseterapi: build('danseterapi'),
	gruppeterapi: build('gruppeterapi', [
		{ title: 'Espergærde teater 4 gange 2/2' },
		{ title: '3 kvinder af 4 gange Tibberup vænge' },
		{ title: 'AOF lørdag formiddag' },
		{ title: 'Workshop' }
	]),
	samtaleterapi: build('samtaleterapi')
};
