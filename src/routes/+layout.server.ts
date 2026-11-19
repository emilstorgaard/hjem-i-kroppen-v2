import { getContentByPath } from '$lib/server/umbraco';
import type { Settings } from '$lib/types/settings';
import type { ErrorPage } from '$lib/types/errorPage';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const [settings, errorPage] = await Promise.all([
		getContentByPath<Settings>('indstillinger', fetch),
		getContentByPath<ErrorPage>('fejlside', fetch).catch(() => null)
	]);

	return {
		settings,
		errorPage,
		// For display and routing only (header menu, guards); the API authorizes every call itself.
		user: locals.user
	};
};
