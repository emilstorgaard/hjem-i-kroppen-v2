import { ApiError } from '$lib/server/booking-api';
import {
	bookSeries,
	bookSession,
	cancelBooking,
	cancelSeriesBooking
} from '$lib/server/booking-actions';
import { isGuid } from '$lib/booking/url';
import {
	dateKeyOf,
	dayRangeUtc,
	isoWeekString,
	parseIsoWeek,
	startOfWeek,
	todayKey
} from '$lib/utils/date';
import type { ServiceCategoryResponse, SessionResponse } from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, untrack }) => {
	const today = todayKey();
	const requestedWeek = parseIsoWeek(url.searchParams.get('uge'));
	const monday = requestedWeek ?? startOfWeek(today);
	const kategori = url.searchParams.get('kategori');
	const ydelse = url.searchParams.get('ydelse');
	const serviceTypeId = isGuid(ydelse) ? ydelse : undefined;
	const onlyAvailable = url.searchParams.get('ledige') === '1';
	// The open session lives in the URL so the sheet works without JS and survives login, but opening and
	// closing it must not reload the week.
	const selectedId = untrack(() => url.searchParams.get('session'));

	const { from, to } = dayRangeUtc(monday, 7);
	const { api, user } = locals;

	const base = {
		today,
		monday,
		week: isoWeekString(monday),
		filters: { kategori: null as string | null, ydelse: serviceTypeId ?? null, onlyAvailable },
		/** Categories with at least one active service type, in display order. */
		categories: [] as ServiceCategoryResponse[],
		serviceTypes: [] as Awaited<ReturnType<typeof api.serviceTypes.list>>['items'],
		sessions: [] as SessionResponse[],
		/** sessionId → bookingId for the visitor's active upcoming bookings. */
		booked: {} as Record<string, string>,
		bookedSeries: [] as string[],
		nextAvailableWeek: null as string | null,
		selected: null as SessionResponse | null,
		loadError: null as string | null
	};

	try {
		// `?kategori=` holds the category slug (e.g. danseterapi), so links from the therapy pages keep working.
		const [categories, serviceTypes] = await Promise.all([
			api.all(api.serviceCategories.list, {}),
			api.all(api.serviceTypes.list, {})
		]);
		// Only categories with something bookable become filters.
		base.categories = categories.filter((c) => serviceTypes.some((t) => t.category.id === c.id));
		base.serviceTypes = serviceTypes;
		const category = base.categories.find((c) => c.slug === kategori);
		base.filters.kategori = category?.slug ?? null;
		const filters = {
			categoryId: category?.id,
			serviceTypeId,
			onlyAvailable: onlyAvailable || undefined
		};

		const [sessions, myBookings] = await Promise.all([
			api.all(api.sessions.list, { from, to, ...filters }),
			user
				? api.all(api.me.bookings.list, { upcoming: true, status: 'Active' })
				: Promise.resolve([])
		]);

		base.sessions = sessions;
		for (const b of myBookings) base.booked[b.sessionId] = b.id;
		base.bookedSeries = [
			...new Set(myBookings.map((b) => b.seriesId).filter((id): id is string => !!id))
		];

		if (sessions.length === 0) {
			const next = await api.sessions.list({
				...filters,
				from: to,
				onlyAvailable: true,
				pageSize: 1
			});
			if (next.items[0]) base.nextAvailableWeek = isoWeekString(dateKeyOf(next.items[0].startsAt));
		}

		if (isGuid(selectedId) && !sessions.some((s) => s.id === selectedId)) {
			base.selected = await api.sessions.get(selectedId).catch(() => null);
		}
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		base.loadError = err.detail;
	}

	return base;
};

export const actions: Actions = {
	book: bookSession,
	bookSeries,
	cancel: cancelBooking,
	cancelSeries: cancelSeriesBooking
};
