import { redirect } from '@sveltejs/kit';
import { apiFail, inputFail, readForm } from '$lib/server/actions';
import { loginUrl, safeRedirectTo, setSession } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	const redirectTo = url.searchParams.get('redirectTo');
	if (locals.user) redirect(303, safeRedirectTo(redirectTo, '/min-side'));
	return { redirectTo: safeRedirectTo(redirectTo, '') };
};

export const actions: Actions = {
	default: async ({ request, cookies, locals, url }) => {
		const form = await readForm(
			request,
			'fullName',
			'email',
			'password',
			'passwordRepeat',
			'redirectTo'
		);
		const values = { fullName: form.fullName, email: form.email };
		const target = safeRedirectTo(
			form.redirectTo || url.searchParams.get('redirectTo'),
			'/min-side'
		);

		if (form.password !== form.passwordRepeat) {
			return inputFail('register', { passwordRepeat: ['Adgangskoderne er ikke ens.'] }, values);
		}

		try {
			await locals.api.auth.register({
				email: form.email,
				fullName: form.fullName,
				password: form.password
			});
		} catch (err) {
			return apiFail(err, 'register', values);
		}

		// Registration does not sign in, so sign in right away and continue where the visitor was going.
		try {
			setSession(
				cookies,
				await locals.api.auth.login({ email: form.email, password: form.password })
			);
		} catch {
			redirect(303, loginUrl(target));
		}
		redirect(303, target);
	}
};
