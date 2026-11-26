import { getPricesPage } from '$lib/server/pricesPage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	return { page: await getPricesPage(fetch) };
};
