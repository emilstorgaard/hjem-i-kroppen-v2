import { getContentItems } from './umbraco';
import type { BookingApi } from './booking-api';
import type { BookingOption } from '$lib/types/bookingOption';
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
			audience: p.audience?.trim() ?? '',
			participants: p.participants?.trim() ?? '',
			testimonials: (p.testimonials?.items ?? [])
				.map((b) => b.content.properties)
				.filter((t) => !!t.quote?.trim())
				.map((t) => ({
					quote: t.quote!.trim(),
					name: t.author?.trim() ?? '',
					rating: Number(t.rating) || 5
				})),
			bookingOptions: (p.bookingOptions?.items ?? [])
				.map((b) => b.content.properties)
				.map((o) => ({
					title: o.title?.trim() ?? '',
					serviceTypeId: o.serviceType?.trim() || null
				}))
				.filter((o) => o.title !== '' || o.serviceTypeId !== null),
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
	const { heading, info, image, audience, participants } = page.properties;
	return {
		slug: page.slug,
		title: heading,
		description: info,
		image: image?.[0],
		audience,
		participants
	};
}

function bookUrl(categorySlug: string, serviceTypeId?: string): string {
	const params = new URLSearchParams({ kategori: categorySlug });
	if (serviceTypeId) params.set('ydelse', serviceTypeId);
	return `/book?${params}`;
}

/**
 * The page's booking links. `bookHref` is the calendar filtered on the page's category, or the whole calendar when no
 * category is chosen or it no longer exists. Each booking option links to its service type within that service type's
 * own category; an option whose service type is gone or inactive falls back to `bookHref`, and uses the service type's
 * name when it has no title. If the booking API cannot be reached, everything falls back to `/book`.
 */
export async function bookingLinks(
	api: BookingApi,
	page: TherapyPage
): Promise<{ bookHref: string; options: BookingOption[] }> {
	const { bookingCategoryId, bookingOptions } = page.properties;
	const needsServiceTypes = bookingOptions.some((o) => o.serviceTypeId !== null);
	const [categories, serviceTypes] = await Promise.all([
		bookingCategoryId ? api.all(api.serviceCategories.list, {}).catch(() => []) : [],
		needsServiceTypes ? api.all(api.serviceTypes.list, {}).catch(() => []) : []
	]);

	const category = categories.find((c) => c.id === bookingCategoryId);
	const bookHref = category ? bookUrl(category.slug) : '/book';
	const options = bookingOptions.flatMap((option) => {
		const serviceType = serviceTypes.find((t) => t.id === option.serviceTypeId);
		const title = option.title || serviceType?.name;
		if (!title) return [];
		return [
			{ title, href: serviceType ? bookUrl(serviceType.category.slug, serviceType.id) : bookHref }
		];
	});
	return { bookHref, options };
}
