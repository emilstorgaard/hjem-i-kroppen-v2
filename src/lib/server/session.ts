import type { Cookies } from '@sveltejs/kit';
import type { LoginResponse, UserResponse } from '$lib/types/booking';

/** httpOnly cookie holding the API access token. The browser never sees the token. */
export const TOKEN_COOKIE = 'hik_session';
/**
 * Short-lived httpOnly cache of `GET /me`, for display and routing only. The API stays the only authority:
 * a tampered value can at most show a menu item, every API call is still authorized with the token.
 */
export const USER_COOKIE = 'hik_user';
const USER_CACHE_SECONDS = 5 * 60;

// `secure` is left to SvelteKit: always true, except on http://localhost during development.
const baseOptions = { path: '/', httpOnly: true, sameSite: 'lax' } as const;

/** Stores the token with a lifetime matching the JWT's `expiresAt`. */
export function setSession(cookies: Cookies, login: LoginResponse): void {
	const maxAge = Math.max(0, Math.floor((Date.parse(login.expiresAt) - Date.now()) / 1000));
	cookies.set(TOKEN_COOKIE, login.accessToken, { ...baseOptions, maxAge });
	setUserCache(cookies, login.user);
}

export function setUserCache(cookies: Cookies, user: UserResponse): void {
	cookies.set(USER_COOKIE, JSON.stringify(user), { ...baseOptions, maxAge: USER_CACHE_SECONDS });
}

export function clearSession(cookies: Cookies): void {
	cookies.delete(TOKEN_COOKIE, { path: '/' });
	cookies.delete(USER_COOKIE, { path: '/' });
}

export function readUserCache(cookies: Cookies): UserResponse | null {
	const raw = cookies.get(USER_COOKIE);
	if (!raw) return null;
	try {
		const user = JSON.parse(raw) as Partial<UserResponse>;
		if (
			typeof user.id !== 'string' ||
			typeof user.email !== 'string' ||
			typeof user.fullName !== 'string'
		)
			return null;
		return {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			role: user.role === 'Admin' ? 'Admin' : 'User'
		};
	} catch {
		return null;
	}
}

/** Only same-site relative paths are allowed as redirect targets (no open redirects). */
export function safeRedirectTo(value: string | null | undefined, fallback = '/'): string {
	if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\'))
		return fallback;
	return value;
}

export function loginUrl(redirectTo: string): string {
	return `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
}
