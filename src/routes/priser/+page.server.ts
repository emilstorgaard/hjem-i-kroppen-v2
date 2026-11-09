import { pricesPage } from '$lib/content/pricesPage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// TODO: Replace with `await getContentByPath<PricesPage>('priser', fetch)` once the page exists in Umbraco.
	return { page: pricesPage };
};
