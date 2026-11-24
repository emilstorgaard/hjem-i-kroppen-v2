import { getContentItems } from './umbraco';
import type { BookingApi } from './booking-api';
import type { DanceType } from '$lib/types/danceType';
import type { TherapyPage, TherapyPageContent } from '$lib/types/therapyPage';

/** The last segment of the Umbraco route, e.g. `/forside/danseterapi/` → `danseterapi`. */
function slugOf(path: string): string {
	return path.split('/').filter(Boolean).at(-1) ?? '';
}

function toTherapyPage(content: TherapyPageContent): TherapyPage {
	const p = content.properties;
	const heading = p.heading?.trim() || content.name;
	const info = p.info?.trim() ?? '';
	return {
		id: content.id,
		name: content.name,
		slug: slugOf(content.route.path),
		updatedAt: content.updateDate,
		properties: {
			metaTitle: p.metaTitle?.trim() || `${heading} | Hjem i Kroppen`,
			metaDescription: p.metaDescription?.trim() || info,
			ogImage: p.ogImage ?? undefined,
			heading,
			info,
			image: p.image ?? undefined,
			cardImage: p.cardImage ?? undefined,
			audience: p.audience?.trim() ?? '',
			participants: p.participants?.trim() ?? '',
			testimonials: (p.testimonials?.items ?? [])
				.map((b) => b.content.properties)
				.filter((t) => !!t.quote?.trim())
				.map((t) => ({
					quote: t.quote!.trim(),
					name: t.name?.trim() ?? '',
					rating: Number(t.rating) || 5
				})),
			bookingOptions: (p.bookingOptions?.items ?? [])
				.map((b) => b.content.properties)
				.filter((o) => !!o.title?.trim())
				.map((o) => ({ title: o.title!.trim(), seriesId: o.seriesId?.trim() || undefined })),
			bookingCategoryId: p.bookingCategory?.trim() || null
		}
	};
}

/** All published therapy pages, in the order they have in the Umbraco tree. */
export async function getTherapyPages(fetchFn?: typeof fetch): Promise<TherapyPage[]> {
	const items = await getContentItems<TherapyPageContent>(
		'filter=contentType:therapyPage&sort=sortOrder:asc&take=100',
		fetchFn
	);
	return items.map(toTherapyPage).filter((page) => page.slug !== '');
}

/** The home page card for a therapy page. */
export function toDanceType(page: TherapyPage): DanceType {
	const { heading, info, image, cardImage, audience, participants } = page.properties;
	return {
		slug: page.slug,
		title: heading,
		description: info,
		image: cardImage?.[0] ?? image?.[0],
		audience,
		participants
	};
}

/**
 * Where the page's "Book" buttons point: the booking calendar filtered on the chosen category, or the whole calendar
 * when no category is chosen, the category no longer exists or the booking API cannot be reached.
 */
export async function bookingHref(api: BookingApi, categoryId: string | null): Promise<string> {
	if (!categoryId) return '/book';
	try {
		const categories = await api.all(api.serviceCategories.list, {});
		const category = categories.find((c) => c.id === categoryId);
		return category ? `/book?kategori=${encodeURIComponent(category.slug)}` : '/book';
	} catch {
		return '/book';
	}
}
