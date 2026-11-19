import { redirect } from '@sveltejs/kit';
import { pageParam } from '$lib/server/admin';
import { apiFail, inputFail, optional, optionalInt, readForm } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import { isGuid } from '$lib/booking/url';
import { addDays, fromLocalInput, zonedDateTimeToIso } from '$lib/utils/date';
import type {
	AdminSeriesListItemResponse,
	AdminServiceTypeResponse,
	Paged
} from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
	const { api } = locals;
	const q = url.searchParams.get('q') ?? '';
	const ydelse = url.searchParams.get('ydelse');
	const status = url.searchParams.get('status') ?? 'kommende';
	const page = pageParam(url);

	let series: Paged<AdminSeriesListItemResponse> = {
		items: [],
		page,
		pageSize: PAGE_SIZE,
		totalCount: 0,
		totalPages: 0
	};
	let serviceTypes: AdminServiceTypeResponse[] = [];
	let loadError: string | null = null;
	try {
		[series, serviceTypes] = await Promise.all([
			api.admin.series.list({
				search: q || undefined,
				serviceTypeId: isGuid(ydelse) ? ydelse : undefined,
				upcoming: status === 'kommende' ? true : status === 'afsluttede' ? false : undefined,
				isCancelled: status === 'aflyste' ? true : status === 'alle' ? undefined : false,
				page,
				pageSize: PAGE_SIZE
			}),
			api.all(api.admin.serviceTypes.list, { category: 'Group' })
		]);
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}

	return {
		series,
		serviceTypes,
		filters: { q, ydelse: isGuid(ydelse) ? ydelse : '', status },
		loadError
	};
};

const MAX_SESSIONS = 52;

export const actions: Actions = {
	/**
	 * Start times come either from the explicit list (`startTimes`, datetime-local, edited with JS) or, without JS,
	 * from the generator fields (first date, time, interval and count). Each is converted from Copenhagen time to UTC.
	 */
	create: async ({ request, locals }) => {
		const form = await readForm(
			request,
			'serviceTypeId',
			'title',
			'location',
			'notes',
			'durationMinutes',
			'capacity',
			'genDate',
			'genTime',
			'genEvery',
			'genCount'
		);
		const { data, ...values } = form;
		if (!isGuid(form.serviceTypeId))
			return inputFail('create', { serviceTypeId: ['Vælg en ydelse.'] }, values);

		const listed = data
			.getAll('startTimes')
			.map((v) => (typeof v === 'string' ? v.trim() : ''))
			.filter(Boolean);
		let startTimes: (string | null)[];
		if (listed.length > 0) {
			startTimes = listed.map(fromLocalInput);
		} else {
			const count = Math.min(MAX_SESSIONS, Math.max(1, Math.floor(Number(form.genCount)) || 1));
			const every = Number(form.genEvery) || 7;
			startTimes =
				form.genDate && form.genTime
					? Array.from({ length: count }, (_, i) =>
							zonedDateTimeToIso(addDays(form.genDate, i * every), form.genTime)
						)
					: [];
		}
		if (startTimes.length === 0)
			return inputFail(
				'create',
				{ startTimes: ['Tilføj mindst én dato og et tidspunkt.'] },
				values
			);
		const invalid = startTimes.findIndex((t) => !t);
		if (invalid !== -1)
			return inputFail(
				'create',
				{ [`startTimes[${invalid}]`]: ['Ugyldig dato eller tidspunkt.'] },
				values
			);

		let id: string;
		try {
			const created = await locals.api.admin.series.create({
				serviceTypeId: form.serviceTypeId,
				title: optional(form.title),
				startTimes: (startTimes as string[]).toSorted(),
				durationMinutes: optionalInt(form.durationMinutes),
				capacity: optionalInt(form.capacity),
				location: optional(form.location),
				notes: optional(form.notes)
			});
			id = created.id;
		} catch (err) {
			return apiFail(err, 'create', values);
		}
		redirect(303, `/admin/forloeb/${id}`);
	}
};
