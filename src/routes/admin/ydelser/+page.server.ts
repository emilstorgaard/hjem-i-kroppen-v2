import { apiFail, ok, optional, readForm, requireId } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import { isCategory } from '$lib/booking/categories';
import type {
	AdminServiceTypeResponse,
	ServiceCategory,
	ServiceTypeRequest
} from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const kategori = url.searchParams.get('kategori');
	const aktiv = url.searchParams.get('aktiv');
	let serviceTypes: AdminServiceTypeResponse[] = [];
	let loadError: string | null = null;
	try {
		serviceTypes = await locals.api.all(locals.api.admin.serviceTypes.list, {
			category: isCategory(kategori) ? kategori : undefined,
			isActive: aktiv === 'ja' ? true : aktiv === 'nej' ? false : undefined
		});
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}
	return {
		serviceTypes: serviceTypes.toSorted(
			(a, b) =>
				a.category.localeCompare(b.category) ||
				a.sortOrder - b.sortOrder ||
				a.name.localeCompare(b.name)
		),
		filters: { kategori: isCategory(kategori) ? kategori : '', aktiv: aktiv ?? '' },
		loadError
	};
};

async function readServiceType(request: Request) {
	const form = await readForm(
		request,
		'id',
		'category',
		'name',
		'description',
		'defaultDurationMinutes',
		'defaultCapacity',
		'sortOrder',
		'isActive'
	);
	const { data: _data, ...values } = form;
	const body: ServiceTypeRequest = {
		category: form.category as ServiceCategory,
		name: form.name,
		description: optional(form.description),
		defaultDurationMinutes: Number(form.defaultDurationMinutes),
		defaultCapacity: Number(form.defaultCapacity),
		sortOrder: Number(form.sortOrder) || 0,
		isActive: form.isActive === 'on'
	};
	return { id: form.id, body, values };
}

function toRequest(t: AdminServiceTypeResponse, sortOrder = t.sortOrder): ServiceTypeRequest {
	return {
		category: t.category,
		name: t.name,
		description: t.description,
		defaultDurationMinutes: t.defaultDurationMinutes,
		defaultCapacity: t.defaultCapacity,
		sortOrder,
		isActive: t.isActive
	};
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { body, values } = await readServiceType(request);
		try {
			await locals.api.admin.serviceTypes.create(body);
			return ok('save', `Ydelsen "${body.name}" er oprettet.`);
		} catch (err) {
			return apiFail(err, 'save', values);
		}
	},

	update: async ({ request, locals }) => {
		const { id, body, values } = await readServiceType(request);
		try {
			await locals.api.admin.serviceTypes.update(requireId(id), body);
			return ok('save', `Ydelsen "${body.name}" er gemt.`);
		} catch (err) {
			return apiFail(err, 'save', values);
		}
	},

	toggle: async ({ request, locals }) => {
		const form = await readForm(request, 'id', 'activate');
		try {
			const id = requireId(form.id);
			if (form.activate === '1') await locals.api.admin.serviceTypes.activate(id);
			else await locals.api.admin.serviceTypes.deactivate(id);
			return ok('row', form.activate === '1' ? 'Ydelsen er aktiveret.' : 'Ydelsen er deaktiveret.');
		} catch (err) {
			return apiFail(err, 'row');
		}
	},

	delete: async ({ request, locals }) => {
		const form = await readForm(request, 'id');
		try {
			await locals.api.admin.serviceTypes.delete(requireId(form.id));
			return ok('row', 'Ydelsen er slettet.');
		} catch (err) {
			return apiFail(err, 'row');
		}
	},

	/** Moves a service type up or down within its category by renumbering the category's sort order. */
	move: async ({ request, locals }) => {
		const form = await readForm(request, 'id', 'direction');
		const { api } = locals;
		try {
			const id = requireId(form.id);
			const current = await api.admin.serviceTypes.get(id);
			const siblings = (
				await api.all(api.admin.serviceTypes.list, { category: current.category })
			).toSorted((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
			const index = siblings.findIndex((t) => t.id === id);
			const target = index + (form.direction === 'up' ? -1 : 1);
			if (index === -1 || target < 0 || target >= siblings.length) return ok('row', '');
			[siblings[index], siblings[target]] = [siblings[target], siblings[index]];
			// Renumber 10, 20, 30 … and only save the ones that changed.
			for (const [i, t] of siblings.entries()) {
				const sortOrder = (i + 1) * 10;
				if (t.sortOrder !== sortOrder)
					await api.admin.serviceTypes.update(t.id, toRequest(t, sortOrder));
			}
			return ok('row', '');
		} catch (err) {
			return apiFail(err, 'row');
		}
	}
};
