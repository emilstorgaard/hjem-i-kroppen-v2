import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { withParams } from '$lib/booking/url';
import { ApiError, createBookingApi } from '$lib/server/booking-api';
import {
	TOKEN_COOKIE,
	clearSession,
	loginUrl,
	readUserCache,
	setUserCache
} from '$lib/server/session';

function clientIp(event: RequestEvent): string | undefined {
	try {
		return event.getClientAddress();
	} catch {
		return undefined;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const correlationId = crypto.randomUUID();
	const ip = clientIp(event);
	let token = event.cookies.get(TOKEN_COOKIE) ?? null;
	let user = token ? readUserCache(event.cookies) : null;

	if (token && !user) {
		try {
			user = await createBookingApi({
				fetch: event.fetch,
				token,
				clientIp: ip,
				correlationId
			}).me.get();
			setUserCache(event.cookies, user);
		} catch (err) {
			if (!(err instanceof ApiError)) throw err;
			if (err.status === 401) {
				// Expired, revoked or deactivated: continue as an anonymous visitor. Guarded pages redirect to /login.
				clearSession(event.cookies);
				token = null;
			}
			// Other failures (API down) leave the visitor signed out for this request only; the token is kept.
		}
	}

	event.locals.token = token;
	event.locals.user = user;
	event.locals.correlationId = correlationId;
	event.locals.api = createBookingApi({
		fetch: event.fetch,
		token,
		clientIp: ip,
		correlationId,
		// Any later 401 on an authenticated call: forget the token and ask the visitor to sign in again.
		onUnauthorized: () => {
			clearSession(event.cookies);
			redirect(303, loginUrl(withParams(event.url, {})));
		}
	});

	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	// Personalised pages must never be stored by shared caches.
	if (event.locals.token && !response.headers.has('Cache-Control'))
		response.headers.set('Cache-Control', 'private, no-store');

	return response;
};
