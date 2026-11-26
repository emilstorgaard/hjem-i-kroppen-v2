import { getContentByPath } from './umbraco';
import { blockProperties, toLines, toParagraphs, toTestimonials } from './content';
import { HOME_LABEL_KEYS, pickLabels } from '$lib/labels';
import type { HomePage, HomePageContent } from '$lib/types/homePage';

const trim = (value: string | null | undefined) => value?.trim() || undefined;

function toHomePage(content: HomePageContent): HomePage {
	const p = content.properties;
	const heroTitle = toLines(p.heroTitle);
	return {
		id: content.id,
		name: content.name,
		updatedAt: content.updateDate,
		properties: {
			metaTitle: p.metaTitle?.trim() || 'Hjem i Kroppen',
			metaDescription: p.metaDescription?.trim() ?? '',
			ogImage: p.ogImage ?? undefined,
			heroTitle: heroTitle.length > 0 ? heroTitle : ['Hjem i Kroppen'],
			heroText: toLines(p.heroText),
			heroVideo: p.heroVideo?.[0],
			dmt: {
				heading: p.dmtHeading?.trim() ?? '',
				paragraphs: toParagraphs(p.dmtText),
				points: blockProperties(p.dmtPoints)
					.map((point) => ({ title: point.title?.trim() ?? '', text: point.text?.trim() ?? '' }))
					.filter((point) => point.title !== '' || point.text !== '')
			},
			testimonials: toTestimonials(p.testimonials),
			contactHeading: p.contactHeading?.trim() ?? '',
			contactText: toParagraphs(p.contactText),
			email: trim(p.email),
			phone: trim(p.phone),
			addresses: blockProperties(p.addresses)
				.map((a) => ({
					label: a.label?.trim() || 'Adresse',
					streetAddress: a.streetAddress?.trim() ?? '',
					postalCode: a.postalCode?.trim() ?? '',
					city: a.city?.trim() ?? ''
				}))
				.filter((a) => a.streetAddress !== '' || a.city !== ''),
			labels: pickLabels(p, HOME_LABEL_KEYS)
		}
	};
}

/** The home page (Umbraco path `forside`). It also holds the contact details and addresses used on other pages. */
export async function getHomePage(fetchFn?: typeof fetch): Promise<HomePage> {
	return toHomePage(await getContentByPath<HomePageContent>('forside', fetchFn));
}
