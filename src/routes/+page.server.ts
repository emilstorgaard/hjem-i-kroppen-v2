import { getContentByPath } from '$lib/server/umbraco';
import { addresses } from '$lib/content/addresses';
import { getTherapyPages, toDanceType } from '$lib/server/therapyPages';
import { testimonials } from '$lib/content/testimonials';
import type { HomePage } from '$lib/types/homePage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [page, therapyPages] = await Promise.all([
		getContentByPath<HomePage>('forside', fetch),
		// The cards are the therapy pages in Umbraco. The home page still renders without them.
		getTherapyPages(fetch).catch(() => [])
	]);

	// TODO: Fetch testimonials from Umbraco once the content is ready.
	return {
		page,
		danceTypes: therapyPages.map(toDanceType),
		testimonials,
		// TODO: Fetch the addresses from Umbraco (same list as on the therapy pages).
		addresses
	};
};
