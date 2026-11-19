import { redirect } from '@sveltejs/kit';
import { apiFail, inputFail, ok, readForm } from '$lib/server/actions';
import { cancelBooking, cancelSeriesBooking } from '$lib/server/booking-actions';
import { ApiError } from '$lib/server/booking-api';
import { requireUser } from '$lib/server/guards';
import { clearSession, setUserCache } from '$lib/server/session';
import type { BookingResponse, Paged } from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

const PAST_PAGE_SIZE = 10;

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);
	const { api } = event.locals;
	const pastPage = Math.max(1, Number(event.url.searchParams.get('tidligere')) || 1);

	let upcoming: BookingResponse[] = [];
	let past: Paged<BookingResponse> = {
		items: [],
		page: 1,
		pageSize: PAST_PAGE_SIZE,
		totalCount: 0,
		totalPages: 0
	};
	let loadError: string | null = null;
	const seriesTitles: Record<string, string> = {};

	try {
		[upcoming, past] = await Promise.all([
			api.all(api.me.bookings.list, { upcoming: true, status: 'Active' }),
			api.me.bookings.list({ upcoming: false, page: pastPage, pageSize: PAST_PAGE_SIZE })
		]);
		// BookingResponse has no series title, so look the series up (cancelled series may be gone; fall back in the UI).
		const seriesIds = [
			...new Set(
				[...upcoming, ...past.items].map((b) => b.seriesId).filter((id): id is string => !!id)
			)
		];
		const series = await Promise.all(seriesIds.map((id) => api.series.get(id).catch(() => null)));
		for (const s of series) if (s) seriesTitles[s.id] = s.title;
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}

	return { profile: user, upcoming, past, seriesTitles, loadError };
};

export const actions: Actions = {
	cancel: cancelBooking,
	cancelSeries: cancelSeriesBooking,

	updateProfile: async (event) => {
		requireUser(event);
		const form = await readForm(event.request, 'fullName', 'email');
		try {
			const user = await event.locals.api.me.update({ fullName: form.fullName, email: form.email });
			setUserCache(event.cookies, user);
			return ok('profile', 'Dine oplysninger er gemt.');
		} catch (err) {
			return apiFail(err, 'profile', { fullName: form.fullName, email: form.email });
		}
	},

	changePassword: async (event) => {
		requireUser(event);
		const form = await readForm(
			event.request,
			'currentPassword',
			'newPassword',
			'newPasswordRepeat'
		);
		if (form.newPassword !== form.newPasswordRepeat) {
			return inputFail('password', { newPasswordRepeat: ['Adgangskoderne er ikke ens.'] });
		}
		try {
			await event.locals.api.me.changePassword({
				currentPassword: form.currentPassword,
				newPassword: form.newPassword
			});
			return ok('password', 'Din adgangskode er ændret.');
		} catch (err) {
			return apiFail(err, 'password');
		}
	},

	deactivate: async (event) => {
		requireUser(event);
		const form = await readForm(event.request, 'password');
		try {
			await event.locals.api.me.deactivate({ password: form.password });
		} catch (err) {
			return apiFail(err, 'deactivate');
		}
		clearSession(event.cookies);
		redirect(303, '/');
	}
};
