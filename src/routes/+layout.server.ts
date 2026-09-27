import { getContentByPath } from '$lib/api/umbraco';
import type { Settings } from '$lib/types/settings';
import type { ErrorPage } from '$lib/types/errorPage';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const [settings, errorPage] = await Promise.all([
		getContentByPath('indstillinger', fetch).then((d) => d as Settings),
		getContentByPath('fejlside', fetch)
			.then((d) => d as ErrorPage)
			.catch(() => null)
	]);

	return {
		settings,
		errorPage
	};
};
