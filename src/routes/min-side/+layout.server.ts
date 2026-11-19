import { requireUser } from '$lib/server/guards';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	requireUser(event);
};
