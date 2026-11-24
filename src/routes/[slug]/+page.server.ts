import { error } from '@sveltejs/kit';
import { getContentByPath } from '$lib/server/umbraco';
import { bookingHref, getTherapyPages } from '$lib/server/therapyPages';
import { addresses } from '$lib/content/addresses';
import type { HomePage } from '$lib/types/homePage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	// Therapy pages are created in Umbraco. Any other path ends here and gets a 404.
	const page = (await getTherapyPages(fetch)).find((p) => p.slug === params.slug);
	if (!page) error(404, 'Not found');

	const [home, bookHref] = await Promise.all([
		// Phone and e-mail live on the Umbraco home page. The page still renders without them.
		getContentByPath<HomePage>('forside', fetch).catch(() => null),
		bookingHref(locals.api, page.properties.bookingCategoryId)
	]);

	return {
		page,
		bookHref,
		contact: home?.properties ?? null,
		// TODO: Fetch the addresses from Umbraco.
		addresses
	};
};
