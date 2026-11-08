import { getContentByPath } from '$lib/server/umbraco';
import { danceTypes } from '$lib/content/danceTypes';
import { testimonials } from '$lib/content/testimonials';
import type { HomePage } from '$lib/types/homePage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const page = await getContentByPath<HomePage>('forside', fetch);

	// TODO: Fetch danceTypes and testimonials from Umbraco once the content is ready.
	return {
		page,
		danceTypes,
		testimonials
	};
};
