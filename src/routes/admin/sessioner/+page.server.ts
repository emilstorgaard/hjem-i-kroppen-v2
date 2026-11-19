import { fail } from '@sveltejs/kit';
import { apiFail, inputFail, ok, optional, optionalInt, readForm } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import type { FormResult } from '$lib/booking/forms';
import { isGuid } from '$lib/booking/url';
import {
	addDays,
	dayRangeUtc,
	isoWeekString,
	parseIsoWeek,
	startOfWeek,
	todayKey,
	zonedDateTimeToIso
} from '$lib/utils/date';
import type {
	AdminSeriesListItemResponse,
	AdminServiceTypeResponse,
	AdminSessionResponse
} from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { api } = locals;
	const today = todayKey();
	const monday = parseIsoWeek(url.searchParams.get('uge')) ?? startOfWeek(today);
	const ydelse = url.searchParams.get('ydelse');
	const serviceTypeId = isGuid(ydelse) ? ydelse : undefined;
	const includeCancelled = url.searchParams.get('aflyste') === '1';
	const view = url.searchParams.get('visning') === 'liste' ? 'liste' : 'uge';
	const { from, to } = dayRangeUtc(monday, 7);

	let serviceTypes: AdminServiceTypeResponse[] = [];
	let sessions: AdminSessionResponse[] = [];
	let series: AdminSeriesListItemResponse[] = [];
	let loadError: string | null = null;
	try {
		[serviceTypes, sessions, series] = await Promise.all([
			api.all(api.admin.serviceTypes.list, {}),
			api.all(api.admin.sessions.list, {
				from,
				to,
				serviceTypeId,
				isCancelled: includeCancelled ? undefined : false
			}),
			api.all(api.admin.series.list, { upcoming: true, isCancelled: false })
		]);
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}

	return {
		today,
		monday,
		prevWeek: isoWeekString(addDays(monday, -7)),
		nextWeek: isoWeekString(addDays(monday, 7)),
		view,
		filters: { serviceTypeId: serviceTypeId ?? '', includeCancelled },
		serviceTypes: serviceTypes.toSorted(
			(a, b) => a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder
		),
		sessions: sessions.toSorted((a, b) => a.startsAt.localeCompare(b.startsAt)),
		series,
		loadError
	};
};

const MAX_REPEAT = 52;

export const actions: Actions = {
	/** Creates one session, or several when "Gentag" is used (same Copenhagen wall-clock time on each date, DST-safe). */
	create: async ({ request, locals }) => {
		const form = await readForm(
			request,
			'serviceTypeId',
			'seriesId',
			'startsAt',
			'durationMinutes',
			'capacity',
			'location',
			'notes',
			'repeatEvery',
			'repeatCount'
		);
		const { data: _data, ...values } = form;
		if (!isGuid(form.serviceTypeId))
			return inputFail('create', { serviceTypeId: ['Vælg en ydelse.'] }, values);
		const [datePart, timePart = ''] = form.startsAt.split('T');
		const first = zonedDateTimeToIso(datePart, timePart.slice(0, 5));
		if (!first) return inputFail('create', { startsAt: ['Angiv dato og tidspunkt.'] }, values);

		const step = Number(form.repeatEvery) || 0;
		const count =
			step > 0 ? Math.min(MAX_REPEAT, Math.max(1, Math.floor(Number(form.repeatCount)) || 1)) : 1;

		let created = 0;
		for (let i = 0; i < count; i++) {
			const startsAt =
				i === 0 ? first : zonedDateTimeToIso(addDays(datePart, i * step), timePart.slice(0, 5))!;
			try {
				await locals.api.admin.sessions.create({
					serviceTypeId: form.serviceTypeId,
					seriesId: optional(form.seriesId),
					startsAt,
					durationMinutes: optionalInt(form.durationMinutes),
					capacity: optionalInt(form.capacity),
					location: optional(form.location),
					notes: optional(form.notes)
				});
				created++;
			} catch (err) {
				if (created === 0 || !(err instanceof ApiError)) return apiFail(err, 'create', values);
				return fail(err.status || 503, {
					formId: 'create',
					message: `${created} af ${count} tider blev oprettet. Den næste fejlede: ${err.detail}`,
					values
				} satisfies FormResult);
			}
		}
		return ok('create', count === 1 ? 'Tiden er oprettet.' : `${count} tider er oprettet.`);
	}
};
