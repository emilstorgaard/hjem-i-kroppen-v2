import { apiFail, ok, readForm, requireId } from '$lib/server/actions';
import { ApiError } from '$lib/server/booking-api';
import type { AdminServiceCategoryResponse, ServiceCategoryRequest } from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	let categories: AdminServiceCategoryResponse[] = [];
	let loadError: string | null = null;
	try {
		// The API lists categories in the order they were created.
		categories = await locals.api.all(locals.api.admin.serviceCategories.list, {});
	} catch (err) {
		if (!(err instanceof ApiError)) throw err;
		loadError = err.detail;
	}
	return { categories, loadError };
};

async function readCategory(request: Request) {
	const form = await readForm(request, 'id', 'name');
	const { data: _data, ...values } = form;
	const body: ServiceCategoryRequest = { name: form.name };
	return { id: form.id, body, values };
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { body, values } = await readCategory(request);
		try {
			await locals.api.admin.serviceCategories.create(body);
			return ok('save', `Kategorien "${body.name}" er oprettet.`);
		} catch (err) {
			return apiFail(err, 'save', values);
		}
	},

	update: async ({ request, locals }) => {
		const { id, body, values } = await readCategory(request);
		try {
			await locals.api.admin.serviceCategories.update(requireId(id), body);
			return ok('save', `Kategorien "${body.name}" er gemt.`);
		} catch (err) {
			return apiFail(err, 'save', values);
		}
	},

	delete: async ({ request, locals }) => {
		const form = await readForm(request, 'id');
		try {
			await locals.api.admin.serviceCategories.delete(requireId(form.id));
			return ok('row', 'Kategorien er slettet.');
		} catch (err) {
			return apiFail(err, 'row');
		}
	}
};
