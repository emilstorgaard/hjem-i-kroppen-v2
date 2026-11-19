import { error } from '@sveltejs/kit';
import { pageParam, searchUsers } from '$lib/server/admin';
import { apiFail, ok, optional, readForm, requireId } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import { isGuid } from '$lib/booking/url';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	if (!isGuid(params.id)) error(404, 'Forløbet findes ikke.');
	const { api } = locals;
	const includeCancelled = url.searchParams.get('alle') === '1';
	const query = url.searchParams.get('bruger') ?? '';
	try {
		const [series, participants, userResults] = await Promise.all([
			api.admin.series.get(params.id),
			api.admin.series.participants(params.id, {
				includeCancelled,
				page: pageParam(url),
				pageSize: 50
			}),
			searchUsers(api, query)
		]);
		return { series, participants, includeCancelled, query, userResults };
	} catch (err) {
		if (err instanceof ApiError) error(err.status === 0 ? 503 : err.status, err.detail);
		throw err;
	}
};

export const actions: Actions = {
	rename: async ({ request, locals, params }) => {
		const form = await readForm(request, 'title');
		try {
			await locals.api.admin.series.update(params.id, { title: form.title });
			return ok('rename', 'Titlen er gemt.');
		} catch (err) {
			return apiFail(err, 'rename', { title: form.title });
		}
	},

	cancel: async ({ locals, params }) => {
		try {
			await locals.api.admin.series.cancel(params.id);
			return ok('cancel', 'Forløbet er aflyst.');
		} catch (err) {
			return apiFail(err, 'cancel');
		}
	},

	addUser: async ({ request, locals, params }) => {
		const form = await readForm(request, 'userId', 'note');
		try {
			const result = await locals.api.admin.series.bookUser(params.id, {
				userId: requireId(form.userId),
				note: optional(form.note)
			});
			return ok(
				'addUser',
				`Brugeren er booket på ${result.bookings.length} ${result.bookings.length === 1 ? 'tid' : 'tider'}.`
			);
		} catch (err) {
			return apiFail(err, 'addUser');
		}
	},

	removeUser: async ({ request, locals, params }) => {
		const form = await readForm(request, 'userId');
		try {
			await locals.api.admin.series.cancelUser(params.id, requireId(form.userId));
			return ok('removeUser', 'Brugerens kommende tider i forløbet er aflyst.');
		} catch (err) {
			return apiFail(err, 'removeUser');
		}
	}
};
