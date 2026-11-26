import { error } from '@sveltejs/kit';
import { getHomePage } from '$lib/server/homePage';
import { bookingLinks, getTherapyPages } from '$lib/server/therapyPages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	// Therapy pages are created in Umbraco. Any other path ends here and gets a 404.
	const page = (await getTherapyPages(fetch)).find((p) => p.slug === params.slug);
	if (!page) error(404, 'Not found');

	const [home, links] = await Promise.all([
		// Phone, e-mail and addresses live on the Umbraco home page. The page still renders without them.
		getHomePage(fetch).catch(() => null),
		bookingLinks(locals.api, page)
	]);

	return {
		page,
		bookHref: links.bookHref,
		bookingOptions: links.options,
		homeLabels: home?.properties.labels ?? {},
		contact: home?.properties ?? null,
		addresses: home?.properties.addresses ?? []
	};
};
