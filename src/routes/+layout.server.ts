import { getContentByPath } from '$lib/server/umbraco';
import { pickLabels, SETTINGS_LABEL_KEYS } from '$lib/labels';
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
		labels: pickLabels(settings.properties, SETTINGS_LABEL_KEYS),
		errorPage,
		// For display and routing only (header menu, guards); the API authorizes every call itself.
		user: locals.user
	};
};
