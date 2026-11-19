import { requireAdmin } from '$lib/server/guards';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	requireAdmin(event);
};
