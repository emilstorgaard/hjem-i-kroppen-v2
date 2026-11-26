import { getAboutPage } from '$lib/server/aboutPage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	return { page: await getAboutPage(fetch) };
};
