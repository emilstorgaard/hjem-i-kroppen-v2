import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { UserResponse } from '$lib/types/booking';
import { withParams } from '$lib/booking/url';
import { loginUrl } from './session';

/** UX guard only: the API authorizes every call itself. */
export function requireUser(event: Pick<RequestEvent, 'locals' | 'url'>): UserResponse {
	// withParams drops form action markers (`?/book`), so the visitor returns to the page itself.
	if (!event.locals.user) redirect(303, loginUrl(withParams(event.url, {})));
	return event.locals.user;
}

export function requireAdmin(event: Pick<RequestEvent, 'locals' | 'url'>): UserResponse {
	const user = requireUser(event);
	if (user.role !== 'Admin') error(403, 'Du har ikke adgang til denne side.');
	return user;
}
