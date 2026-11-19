import { pageParam } from '$lib/server/admin';
import { ApiError } from '$lib/server/booking-api';
import type { AdminUserResponse, Paged, UserRole } from '$lib/types/booking';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ locals, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const rolle = url.searchParams.get('rolle');
	const role: UserRole | undefined = rolle === 'Admin' || rolle === 'User' ? rolle : undefined;
	const aktiv = url.searchParams.get('aktiv') ?? '';
	const page = pageParam(url);

	let users: Paged<AdminUserResponse> = {
		items: [],
		page,
		pageSize: PAGE_SIZE,
		totalCount: 0,
		totalPages: 0
	};
	let loadError: string | null = null;
	try {
		users = await locals.api.admin.users.list({
			search: q || undefined,
			role,
			isActive: aktiv === 'ja' ? true : aktiv === 'nej' ? false : undefined,
			page,
			pageSize: PAGE_SIZE
		});
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}
	return { users, filters: { q, rolle: role ?? '', aktiv }, loadError };
};
