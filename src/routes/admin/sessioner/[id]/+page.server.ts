import { error, redirect } from '@sveltejs/kit';
import { searchUsers } from '$lib/server/admin';
import { apiFail, inputFail, ok, optional, readForm, requireId } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import { isGuid } from '$lib/booking/url';
import { dateKeyOf, fromLocalInput, isoWeekString } from '$lib/utils/date';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	if (!isGuid(params.id)) error(404, 'Tiden findes ikke.');
	const { api } = locals;
	const includeCancelled = url.searchParams.get('alle') === '1';
	const query = url.searchParams.get('bruger') ?? '';
	try {
		const [session, bookings, userResults] = await Promise.all([
			api.admin.sessions.get(params.id),
			api.all((q) => api.admin.sessions.bookings(params.id, q), { includeCancelled }),
			searchUsers(api, query)
		]);
		return { session, bookings, includeCancelled, query, userResults };
	} catch (err) {
		if (err instanceof ApiError) error(err.status === 0 ? 503 : err.status, err.detail);
		throw err;
	}
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		const form = await readForm(request, 'startsAt', 'endsAt', 'capacity', 'location', 'notes');
		const { data: _data, ...values } = form;
		const startsAt = fromLocalInput(form.startsAt);
		const endsAt = fromLocalInput(form.endsAt);
		if (!startsAt || !endsAt) {
			return inputFail(
				'update',
				{
					...(startsAt ? {} : { startsAt: ['Angiv dato og tidspunkt.'] }),
					...(endsAt ? {} : { endsAt: ['Angiv dato og tidspunkt.'] })
				},
				values
			);
		}
		try {
			await locals.api.admin.sessions.update(params.id, {
				startsAt,
				endsAt,
				capacity: Number(form.capacity),
				location: optional(form.location),
				notes: optional(form.notes)
			});
			return ok('update', 'Tiden er opdateret.');
		} catch (err) {
			return apiFail(err, 'update', values);
		}
	},

	cancel: async ({ locals, params }) => {
		try {
			await locals.api.admin.sessions.cancel(params.id);
			return ok('cancel', 'Tiden er aflyst, og dens bookinger er annulleret.');
		} catch (err) {
			return apiFail(err, 'cancel');
		}
	},

	delete: async ({ locals, params }) => {
		let week: string;
		try {
			const session = await locals.api.admin.sessions.get(params.id);
			week = isoWeekString(dateKeyOf(session.startsAt));
			await locals.api.admin.sessions.delete(params.id);
		} catch (err) {
			return apiFail(err, 'delete');
		}
		redirect(303, `/admin/sessioner?uge=${week}`);
	},

	addBooking: async ({ request, locals, params }) => {
		const form = await readForm(request, 'userId', 'note');
		try {
			await locals.api.admin.bookings.create({
				userId: requireId(form.userId),
				sessionId: params.id,
				note: optional(form.note)
			});
			return ok('addBooking', 'Brugeren er booket på tiden.');
		} catch (err) {
			return apiFail(err, 'addBooking');
		}
	},

	cancelBooking: async ({ request, locals }) => {
		const form = await readForm(request, 'bookingId');
		try {
			await locals.api.admin.bookings.cancel(requireId(form.bookingId));
			return ok('cancelBooking', 'Bookingen er aflyst.');
		} catch (err) {
			return apiFail(err, 'cancelBooking');
		}
	}
};
