import { aboutPage } from '$lib/content/aboutPage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// TODO: Replace with `await getContentByPath<AboutPage>('om-mig', fetch)` once the page exists in Umbraco.
	return { page: aboutPage };
};
