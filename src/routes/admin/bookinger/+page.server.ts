import { pageParam } from '$lib/server/admin';
import { apiFail, ok, readForm, requireId } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import { isGuid } from '$lib/booking/url';
import { addDays, isDateKey, startOfDayUtc } from '$lib/utils/date';
import type {
	AdminBookingResponse,
	AdminServiceTypeResponse,
	AdminUserResponse,
	BookingStatus,
	Paged
} from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ locals, url }) => {
	const { api } = locals;
	const p = url.searchParams;
	const userIdParam = p.get('userId');
	const userSearch = p.get('bruger')?.trim() ?? '';
	const ydelse = p.get('ydelse');
	const statusParam = p.get('status');
	const status: BookingStatus | undefined =
		statusParam === 'Active' || statusParam === 'Cancelled' ? statusParam : undefined;
	const fra = p.get('fra');
	const til = p.get('til');
	const tid = p.get('tid') ?? 'kommende';
	const page = pageParam(url);

	let bookings: Paged<AdminBookingResponse> = {
		items: [],
		page,
		pageSize: PAGE_SIZE,
		totalCount: 0,
		totalPages: 0
	};
	let serviceTypes: AdminServiceTypeResponse[] = [];
	let user: AdminUserResponse | null = null;
	let userCandidates: AdminUserResponse[] = [];
	let loadError: string | null = null;

	try {
		let userId = isGuid(userIdParam) ? userIdParam : undefined;
		// The API filters on one userId, so a name/e-mail search is resolved first: one match is used directly,
		// several are offered as choices.
		if (!userId && userSearch.length >= 2) {
			const matches = (await api.admin.users.list({ search: userSearch, pageSize: 10 })).items;
			if (matches.length === 1) userId = matches[0].id;
			else userCandidates = matches;
		}

		const [list, types, selectedUser] = await Promise.all([
			userCandidates.length > 1
				? Promise.resolve(bookings)
				: api.admin.bookings.list({
						userId,
						serviceTypeId: isGuid(ydelse) ? ydelse : undefined,
						status,
						upcoming: tid === 'kommende' ? true : tid === 'afsluttede' ? false : undefined,
						from: isDateKey(fra) ? startOfDayUtc(fra).toISOString() : undefined,
						to: isDateKey(til) ? startOfDayUtc(addDays(til, 1)).toISOString() : undefined,
						page,
						pageSize: PAGE_SIZE
					}),
			api.all(api.admin.serviceTypes.list, {}),
			userId ? api.admin.users.get(userId).catch(() => null) : Promise.resolve(null)
		]);
		bookings = list;
		serviceTypes = types;
		user = selectedUser;
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}

	return {
		bookings,
		serviceTypes,
		filterUser: user,
		userCandidates,
		filters: {
			bruger: userSearch,
			ydelse: isGuid(ydelse) ? ydelse : '',
			status: status ?? '',
			fra: fra ?? '',
			til: til ?? '',
			tid
		},
		loadError
	};
};

export const actions: Actions = {
	cancel: async ({ request, locals }) => {
		const form = await readForm(request, 'bookingId');
		try {
			await locals.api.admin.bookings.cancel(requireId(form.bookingId));
			return ok('cancel', 'Bookingen er aflyst.');
		} catch (err) {
			return apiFail(err, 'cancel');
		}
	}
};
