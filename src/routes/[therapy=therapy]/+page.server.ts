import { getContentByPath } from '$lib/server/umbraco';
import { addresses } from '$lib/content/addresses';
import { therapyPages } from '$lib/content/therapyPages';
import type { TherapySlug } from '$lib/therapies';
import type { HomePage } from '$lib/types/homePage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Phone and e-mail live on the Umbraco home page. The page still renders without them.
	const home = await getContentByPath<HomePage>('forside', fetch).catch(() => null);

	return {
		// TODO: Replace with `await getContentByPath<TherapyPage>(params.therapy, fetch)` once the pages exist in Umbraco.
		page: therapyPages[params.therapy as TherapySlug],
		contact: home?.properties ?? null,
		// TODO: Fetch the addresses from Umbraco.
		addresses
	};
};
