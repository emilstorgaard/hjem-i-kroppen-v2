import type { AdminUserResponse } from '$lib/types/booking';
import type { BookingApi } from './booking-api';

/** Active users matching `?bruger=` for the user pickers (at least 2 characters). */
export async function searchUsers(
	api: BookingApi,
	query: string | null
): Promise<AdminUserResponse[] | null> {
	const search = query?.trim() ?? '';
	if (search.length < 2) return null;
	return (await api.admin.users.list({ search, isActive: true, pageSize: 10 })).items;
}

/** `?side=` as a 1-based page number. */
export function pageParam(url: URL, name = 'side'): number {
	return Math.max(1, Math.floor(Number(url.searchParams.get(name))) || 1);
}
