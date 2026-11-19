import type { RequestEvent } from '@sveltejs/kit';
import { formatDateTime } from '$lib/utils/date';
import { apiFail, ok, readForm, requireId } from './actions';
import { requireUser } from './guards';

// Booking mutations shared by the calendar (/book) and the series page (/book/serie/[id]).

export async function bookSession(event: RequestEvent) {
	requireUser(event);
	const form = await readForm(event.request, 'sessionId', 'note');
	try {
		const booking = await event.locals.api.me.bookings.create({
			sessionId: requireId(form.sessionId),
			note: form.note || null
		});
		return ok(
			'book',
			`Du er booket ${formatDateTime(booking.startsAt)}. Vi glæder os til at se dig.`,
			{ values: { sessionId: booking.sessionId } }
		);
	} catch (err) {
		return apiFail(err, 'book', { note: form.note, sessionId: form.sessionId });
	}
}

export async function bookSeries(event: RequestEvent) {
	requireUser(event);
	const form = await readForm(event.request, 'seriesId', 'note', 'sessionId');
	try {
		const result = await event.locals.api.me.series.book(requireId(form.seriesId), {
			note: form.note || null
		});
		const count = result.bookings.length;
		return ok(
			'book',
			count === 1
				? 'Du er booket på forløbets kommende tid.'
				: `Du er booket på hele forløbet (${count} tider).`
		);
	} catch (err) {
		return apiFail(err, 'book', { note: form.note, sessionId: form.sessionId });
	}
}

export async function cancelBooking(event: RequestEvent) {
	requireUser(event);
	const form = await readForm(event.request, 'bookingId');
	try {
		await event.locals.api.me.bookings.cancel(requireId(form.bookingId));
		return ok('cancel', 'Din booking er aflyst.');
	} catch (err) {
		return apiFail(err, 'cancel');
	}
}

export async function cancelSeriesBooking(event: RequestEvent) {
	requireUser(event);
	const form = await readForm(event.request, 'seriesId');
	try {
		await event.locals.api.me.series.cancel(requireId(form.seriesId));
		return ok('cancel', 'Dine kommende tider i forløbet er aflyst.');
	} catch (err) {
		return apiFail(err, 'cancel');
	}
}
