import { ApiError } from '$lib/server/booking-api';
import { addDays, dateKeyOf, dayRangeUtc, startOfWeek, todayKey } from '$lib/utils/date';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { api } = locals;
	const today = todayKey();
	const monday = startOfWeek(today);
	const week = dayRangeUtc(monday, 7);

	try {
		const [weekSessions, upcomingBookings, activeUsers, upcomingSeries] = await Promise.all([
			api.all(api.admin.sessions.list, { from: week.from, to: week.to, isCancelled: false }),
			// The API sorts bookings by session start, not by when they were made, so this shows the next bookings.
			api.admin.bookings.list({ upcoming: true, status: 'Active', pageSize: 8 }),
			api.admin.users.list({ isActive: true, pageSize: 1 }),
			api.admin.series.list({ upcoming: true, isCancelled: false, pageSize: 1 })
		]);
		const todaySessions = weekSessions.filter((s) => dateKeyOf(s.startsAt) === today);
		return {
			today,
			monday,
			sunday: addDays(monday, 6),
			weekSessions,
			todaySessions,
			upcomingBookings: upcomingBookings.items,
			activeUserCount: activeUsers.totalCount,
			upcomingSeriesCount: upcomingSeries.totalCount,
			loadError: null
		};
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		return {
			today,
			monday,
			sunday: addDays(monday, 6),
			weekSessions: [],
			todaySessions: [],
			upcomingBookings: [],
			activeUserCount: 0,
			upcomingSeriesCount: 0,
			loadError: err.detail
		};
	}
};
