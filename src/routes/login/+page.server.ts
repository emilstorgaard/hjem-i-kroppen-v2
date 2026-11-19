import { redirect } from '@sveltejs/kit';
import { apiFail, readForm } from '$lib/server/actions';
import { safeRedirectTo, setSession } from '$lib/server/session';
import type { UserResponse } from '$lib/types/booking';
import type { Actions, PageServerLoad } from './$types';

function defaultTarget(user: UserResponse): string {
	return user.role === 'Admin' ? '/admin' : '/min-side';
}

export const load: PageServerLoad = ({ locals, url }) => {
	const redirectTo = url.searchParams.get('redirectTo');
	if (locals.user) redirect(303, safeRedirectTo(redirectTo, defaultTarget(locals.user)));
	return { redirectTo: safeRedirectTo(redirectTo, '') };
};

export const actions: Actions = {
	default: async ({ request, cookies, locals, url }) => {
		const form = await readForm(request, 'email', 'password', 'redirectTo');
		let user: UserResponse;
		try {
			const login = await locals.api.auth.login({ email: form.email, password: form.password });
			setSession(cookies, login);
			user = login.user;
		} catch (err) {
			return apiFail(err, 'login', { email: form.email });
		}
		redirect(
			303,
			safeRedirectTo(form.redirectTo || url.searchParams.get('redirectTo'), defaultTarget(user))
		);
	}
};
