import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

// Logging out only forgets the token here. The API has no revoke endpoint, so a copied token stays valid until it expires.
export const load: PageServerLoad = () => redirect(303, '/');

export const actions: Actions = {
	default: ({ cookies }) => {
		clearSession(cookies);
		redirect(303, '/');
	}
};
