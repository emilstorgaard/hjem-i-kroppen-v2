import { error } from '@sveltejs/kit';
import { pageParam } from '$lib/server/admin';
import { apiFail, inputFail, ok, readForm, requireId } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import { requireAdmin } from '$lib/server/guards';
import { setUserCache } from '$lib/server/session';
import { isGuid } from '$lib/booking/url';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { locals, params, url } = event;
	if (!isGuid(params.id)) error(404, 'Brugeren findes ikke.');
	const me = requireAdmin(event);
	const tid = url.searchParams.get('tid') ?? 'kommende';
	try {
		const [user, bookings] = await Promise.all([
			locals.api.admin.users.get(params.id),
			locals.api.admin.users.bookings(params.id, {
				upcoming: tid === 'kommende' ? true : tid === 'afsluttede' ? false : undefined,
				page: pageParam(url),
				pageSize: 20
			})
		]);
		return { account: user, bookings, tid, isSelf: me.id === user.id };
	} catch (err) {
		if (err instanceof ApiError) error(err.status === 0 ? 503 : err.status, err.detail);
		throw err;
	}
};

export const actions: Actions = {
	update: async (event) => {
		const form = await readForm(event.request, 'fullName', 'email');
		try {
			const user = await event.locals.api.admin.users.update(event.params.id, {
				fullName: form.fullName,
				email: form.email
			});
			if (event.locals.user?.id === user.id)
				setUserCache(event.cookies, {
					id: user.id,
					email: user.email,
					fullName: user.fullName,
					role: user.role
				});
			return ok('update', 'Oplysningerne er gemt.');
		} catch (err) {
			return apiFail(err, 'update', { fullName: form.fullName, email: form.email });
		}
	},

	role: async ({ request, locals, params }) => {
		const form = await readForm(request, 'role');
		if (form.role !== 'Admin' && form.role !== 'User')
			return inputFail('role', { role: ['Vælg en rolle.'] });
		try {
			await locals.api.admin.users.changeRole(params.id, { role: form.role });
			return ok(
				'role',
				form.role === 'Admin'
					? 'Brugeren er nu administrator.'
					: 'Brugeren er nu almindelig bruger.'
			);
		} catch (err) {
			return apiFail(err, 'role');
		}
	},

	activate: async ({ locals, params }) => {
		try {
			await locals.api.admin.users.activate(params.id);
			return ok('status', 'Brugeren er aktiveret.');
		} catch (err) {
			return apiFail(err, 'status');
		}
	},

	deactivate: async ({ locals, params }) => {
		try {
			await locals.api.admin.users.deactivate(params.id);
			return ok('status', 'Brugeren er deaktiveret og kan ikke længere logge ind.');
		} catch (err) {
			return apiFail(err, 'status');
		}
	},

	password: async ({ request, locals, params }) => {
		const form = await readForm(request, 'newPassword');
		try {
			await locals.api.admin.users.resetPassword(params.id, { newPassword: form.newPassword });
			return ok('password', 'Den nye adgangskode er gemt. Giv den til brugeren på en sikker måde.');
		} catch (err) {
			return apiFail(err, 'password');
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
