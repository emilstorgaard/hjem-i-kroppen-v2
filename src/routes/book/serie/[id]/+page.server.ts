import { error } from '@sveltejs/kit';
import { ApiError } from '$lib/server/booking-api';
import {
	bookSeries,
	bookSession,
	cancelBooking,
	cancelSeriesBooking
} from '$lib/server/booking-actions';
import { isGuid } from '$lib/booking/url';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!isGuid(params.id)) error(404, 'Forløbet findes ikke.');
	const { api, user } = locals;

	try {
		const [series, myBookings] = await Promise.all([
			api.series.get(params.id),
			user
				? api.all(api.me.bookings.list, { seriesId: params.id, status: 'Active' })
				: Promise.resolve([])
		]);
		return {
			series,
			/** sessionId → bookingId */
			booked: Object.fromEntries(myBookings.map((b) => [b.sessionId, b.id])) as Record<
				string,
				string
			>
		};
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) error(404, err.detail);
		if (err instanceof ApiError) error(err.status === 0 ? 503 : err.status, err.detail);
		throw err;
	}
};

export const actions: Actions = {
	bookSeries,
	book: bookSession,
	cancel: cancelBooking,
	cancelSeries: cancelSeriesBooking
};
