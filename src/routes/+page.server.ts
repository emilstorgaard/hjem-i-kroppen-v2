import { getHomePage } from '$lib/server/homePage';
import { findAboutPage } from '$lib/server/aboutPage';
import { getTherapyPages, toDanceType } from '$lib/server/therapyPages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [page, therapyPages, aboutPage] = await Promise.all([
		getHomePage(fetch),
		// The cards are the therapy pages in Umbraco, and the "Om mig" section is a teaser for the about page. The home
		// page still renders without them.
		getTherapyPages(fetch).catch(() => []),
		findAboutPage(fetch).catch(() => null)
	]);

	return {
		page,
		homeLabels: page.properties.labels,
		danceTypes: therapyPages.map(toDanceType),
		about: aboutPage?.properties ?? null
	};
};
