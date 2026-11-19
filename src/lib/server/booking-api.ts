import { env } from '$env/dynamic/private';
import type * as T from '$lib/types/booking';

const API_PREFIX = '/api/v1';
const TIMEOUT_MS = 10_000;
/** The API caps `pageSize` at 100. */
export const MAX_PAGE_SIZE = 100;

/** Fallbacks for errors that carry no usable `detail` from the API (network failures and 500s). */
export const GENERIC_ERROR = 'Der opstod en uventet fejl. Prøv igen om lidt.';
export const NETWORK_ERROR = 'Vi kunne ikke få forbindelse til bookingsystemet. Prøv igen om lidt.';

/** A failed API call, mapped from `application/problem+json`. `status` is 0 for network failures and timeouts. */
export class ApiError extends Error {
	readonly status: number;
	readonly code: string;
	/** Danish, safe to show to the user. */
	readonly detail: string;
	/** Field path (camelCase, e.g. `email` or `startTimes[0]`) → Danish messages. Only set on 422. */
	readonly fieldErrors: Record<string, string[]>;
	readonly parameters: Record<string, unknown>;
	readonly traceId?: string;
	readonly correlationId?: string;
	/** Seconds from `Retry-After` on 429. */
	readonly retryAfter?: number;

	constructor(init: {
		status: number;
		code: string;
		detail: string;
		fieldErrors?: Record<string, string[]>;
		parameters?: Record<string, unknown>;
		traceId?: string;
		correlationId?: string;
		retryAfter?: number;
	}) {
		super(`${init.status} ${init.code}: ${init.detail}`);
		this.name = 'ApiError';
		this.status = init.status;
		this.code = init.code;
		this.detail = init.detail;
		this.fieldErrors = init.fieldErrors ?? {};
		this.parameters = init.parameters ?? {};
		this.traceId = init.traceId;
		this.correlationId = init.correlationId;
		this.retryAfter = init.retryAfter;
	}
}

export type BookingApiContext = {
	/** SvelteKit's `event.fetch`. */
	fetch: typeof fetch;
	/** Access token from the session cookie. */
	token?: string | null;
	/** The real client IP, forwarded as `X-Forwarded-For` so the API rate-limits per visitor instead of per frontend server. */
	clientIp?: string;
	/** Sent as `X-Correlation-Id` on every call made while handling one incoming request. */
	correlationId?: string;
	/** Called when a request that carried a token gets 401. May throw (e.g. a SvelteKit redirect). */
	onUnauthorized?: () => never | void;
};

type Query = Record<string, string | number | boolean | null | undefined>;
type RequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	query?: object;
	body?: unknown;
};

function baseUrl(): string {
	const url = env.BOOKING_API_URL;
	if (!url) throw new Error('BOOKING_API_URL is not set');
	return url.replace(/\/+$/, '');
}

function buildUrl(path: string, query?: object): string {
	const url = new URL(`${baseUrl()}${API_PREFIX}${path}`);
	for (const [key, value] of Object.entries((query ?? {}) as Query)) {
		if (value !== undefined && value !== null && value !== '')
			url.searchParams.set(key, String(value));
	}
	return url.toString();
}

function toFieldErrors(errors: T.ApiProblem['errors']): Record<string, string[]> {
	const result: Record<string, string[]> = {};
	for (const [field, list] of Object.entries(errors ?? {}))
		result[field] = list.map((e) => e.message);
	return result;
}

async function toApiError(res: Response): Promise<ApiError> {
	const retryAfter = Number(res.headers.get('Retry-After')) || undefined;
	let problem: Partial<T.ApiProblem> | null = null;
	try {
		problem = (await res.json()) as Partial<T.ApiProblem>;
	} catch {
		// Not JSON, e.g. a reverse proxy error page.
	}

	const useDetail =
		res.status < 500 && typeof problem?.detail === 'string' && problem.detail.length > 0;
	return new ApiError({
		status: res.status,
		code: problem?.code ?? (res.status >= 500 ? 'server.unexpected_error' : 'request.failed'),
		detail: useDetail ? problem!.detail! : GENERIC_ERROR,
		fieldErrors: toFieldErrors(problem?.errors),
		parameters: problem?.parameters,
		traceId: problem?.traceId,
		correlationId: problem?.correlationId ?? res.headers.get('X-Correlation-Id') ?? undefined,
		retryAfter
	});
}

/** Creates a client bound to one incoming request (token, client IP and correlation id). Server-only. */
export function createBookingApi(ctx: BookingApiContext) {
	async function request<R>(path: string, options: RequestOptions = {}): Promise<R> {
		const headers: Record<string, string> = { Accept: 'application/json' };
		if (options.body !== undefined) headers['Content-Type'] = 'application/json';
		if (ctx.token) headers.Authorization = `Bearer ${ctx.token}`;
		if (ctx.clientIp) headers['X-Forwarded-For'] = ctx.clientIp;
		if (ctx.correlationId) headers['X-Correlation-Id'] = ctx.correlationId;

		let res: Response;
		try {
			res = await ctx.fetch(buildUrl(path, options.query), {
				method: options.method ?? 'GET',
				headers,
				body: options.body === undefined ? undefined : JSON.stringify(options.body),
				signal: AbortSignal.timeout(TIMEOUT_MS)
			});
		} catch (err) {
			console.error(
				`[booking-api] ${options.method ?? 'GET'} ${path} failed (correlationId ${ctx.correlationId})`,
				err
			);
			throw new ApiError({
				status: 0,
				code: 'network.error',
				detail: NETWORK_ERROR,
				correlationId: ctx.correlationId
			});
		}

		if (!res.ok) {
			const error = await toApiError(res);
			if (res.status >= 500)
				console.error(
					`[booking-api] ${options.method ?? 'GET'} ${path} → ${res.status} (correlationId ${error.correlationId})`
				);
			if (res.status === 401 && ctx.token) ctx.onUnauthorized?.();
			throw error;
		}

		if (res.status === 204) return undefined as R;
		const text = await res.text();
		return (text ? JSON.parse(text) : undefined) as R;
	}

	const get = <R>(path: string, query?: object) => request<R>(path, { query });
	const post = <R>(path: string, body?: unknown) => request<R>(path, { method: 'POST', body });
	const put = <R>(path: string, body: unknown) => request<R>(path, { method: 'PUT', body });
	const del = (path: string) => request<void>(path, { method: 'DELETE' });

	/** Fetches every page of a list (the API caps `pageSize` at 100). */
	async function all<R, Q extends T.PageQuery>(
		list: (query: Q) => Promise<T.Paged<R>>,
		query: Omit<Q, 'page' | 'pageSize'>,
		maxPages = 20
	): Promise<R[]> {
		const items: R[] = [];
		for (let page = 1; page <= maxPages; page++) {
			const result = await list({ ...query, page, pageSize: MAX_PAGE_SIZE } as Q);
			items.push(...result.items);
			if (page >= result.totalPages) break;
		}
		return items;
	}

	return {
		all,
		auth: {
			login: (body: T.LoginRequest) => post<T.LoginResponse>('/auth/login', body),
			register: (body: T.RegisterRequest) => post<T.UserResponse>('/auth/register', body)
		},
		serviceTypes: {
			list: (query: T.ListPublicServiceTypesQuery = {}) =>
				get<T.Paged<T.ServiceTypeResponse>>('/service-types', query),
			get: (id: T.Guid) => get<T.ServiceTypeResponse>(`/service-types/${id}`)
		},
		sessions: {
			list: (query: T.ListPublicSessionsQuery = {}) =>
				get<T.Paged<T.SessionResponse>>('/sessions', query),
			get: (id: T.Guid) => get<T.SessionResponse>(`/sessions/${id}`)
		},
		series: {
			list: (query: T.ListBookableSeriesQuery = {}) =>
				get<T.Paged<T.SeriesResponse>>('/series', query),
			get: (id: T.Guid) => get<T.SeriesResponse>(`/series/${id}`)
		},
		me: {
			get: () => get<T.UserResponse>('/me'),
			update: (body: T.UpdateMeRequest) => put<T.UserResponse>('/me', body),
			changePassword: (body: T.ChangePasswordRequest) => put<void>('/me/password', body),
			deactivate: (body: T.DeactivateMeRequest) => post<void>('/me/deactivate', body),
			bookings: {
				list: (query: T.ListMyBookingsQuery = {}) =>
					get<T.Paged<T.BookingResponse>>('/me/bookings', query),
				get: (id: T.Guid) => get<T.BookingResponse>(`/me/bookings/${id}`),
				create: (body: T.CreateBookingRequest) => post<T.BookingResponse>('/me/bookings', body),
				cancel: (id: T.Guid) => del(`/me/bookings/${id}`)
			},
			series: {
				book: (seriesId: T.Guid, body: T.CreateSeriesBookingRequest = {}) =>
					post<T.SeriesBookingResponse>(`/me/series/${seriesId}/bookings`, body),
				cancel: (seriesId: T.Guid) => del(`/me/series/${seriesId}/bookings`)
			}
		},
		admin: {
			serviceTypes: {
				list: (query: T.ListServiceTypesQuery = {}) =>
					get<T.Paged<T.AdminServiceTypeResponse>>('/admin/service-types', query),
				get: (id: T.Guid) => get<T.AdminServiceTypeResponse>(`/admin/service-types/${id}`),
				create: (body: T.ServiceTypeRequest) =>
					post<T.AdminServiceTypeResponse>('/admin/service-types', body),
				update: (id: T.Guid, body: T.ServiceTypeRequest) =>
					put<T.AdminServiceTypeResponse>(`/admin/service-types/${id}`, body),
				delete: (id: T.Guid) => del(`/admin/service-types/${id}`),
				activate: (id: T.Guid) => post<void>(`/admin/service-types/${id}/activate`),
				deactivate: (id: T.Guid) => post<void>(`/admin/service-types/${id}/deactivate`)
			},
			sessions: {
				list: (query: T.ListSessionsQuery = {}) =>
					get<T.Paged<T.AdminSessionResponse>>('/admin/sessions', query),
				get: (id: T.Guid) => get<T.AdminSessionResponse>(`/admin/sessions/${id}`),
				create: (body: T.CreateSessionRequest) =>
					post<T.AdminSessionResponse>('/admin/sessions', body),
				update: (id: T.Guid, body: T.UpdateSessionRequest) =>
					put<T.AdminSessionResponse>(`/admin/sessions/${id}`, body),
				delete: (id: T.Guid) => del(`/admin/sessions/${id}`),
				cancel: (id: T.Guid) => post<T.AdminSessionResponse>(`/admin/sessions/${id}/cancel`),
				bookings: (id: T.Guid, query: T.ListSessionBookingsQuery = {}) =>
					get<T.Paged<T.AdminBookingResponse>>(`/admin/sessions/${id}/bookings`, query)
			},
			series: {
				list: (query: T.ListSeriesQuery = {}) =>
					get<T.Paged<T.AdminSeriesListItemResponse>>('/admin/series', query),
				get: (id: T.Guid) => get<T.AdminSeriesResponse>(`/admin/series/${id}`),
				create: (body: T.CreateSeriesRequest) => post<T.AdminSeriesResponse>('/admin/series', body),
				update: (id: T.Guid, body: T.UpdateSeriesRequest) =>
					put<T.AdminSeriesResponse>(`/admin/series/${id}`, body),
				cancel: (id: T.Guid) => post<T.AdminSeriesResponse>(`/admin/series/${id}/cancel`),
				participants: (id: T.Guid, query: T.ListSeriesParticipantsQuery = {}) =>
					get<T.Paged<T.SeriesParticipantResponse>>(`/admin/series/${id}/participants`, query),
				bookUser: (id: T.Guid, body: T.AdminCreateSeriesBookingRequest) =>
					post<T.AdminSeriesBookingResponse>(`/admin/series/${id}/bookings`, body),
				cancelUser: (id: T.Guid, userId: T.Guid) => del(`/admin/series/${id}/bookings/${userId}`)
			},
			bookings: {
				list: (query: T.ListBookingsQuery = {}) =>
					get<T.Paged<T.AdminBookingResponse>>('/admin/bookings', query),
				get: (id: T.Guid) => get<T.AdminBookingResponse>(`/admin/bookings/${id}`),
				create: (body: T.AdminCreateBookingRequest) =>
					post<T.AdminBookingResponse>('/admin/bookings', body),
				cancel: (id: T.Guid) => del(`/admin/bookings/${id}`)
			},
			users: {
				list: (query: T.ListUsersQuery = {}) =>
					get<T.Paged<T.AdminUserResponse>>('/admin/users', query),
				get: (id: T.Guid) => get<T.AdminUserResponse>(`/admin/users/${id}`),
				update: (id: T.Guid, body: T.UpdateUserRequest) =>
					put<T.AdminUserResponse>(`/admin/users/${id}`, body),
				changeRole: (id: T.Guid, body: T.ChangeUserRoleRequest) =>
					put<T.AdminUserResponse>(`/admin/users/${id}/role`, body),
				activate: (id: T.Guid) => post<void>(`/admin/users/${id}/activate`),
				deactivate: (id: T.Guid) => post<void>(`/admin/users/${id}/deactivate`),
				resetPassword: (id: T.Guid, body: T.ResetUserPasswordRequest) =>
					put<void>(`/admin/users/${id}/password`, body),
				bookings: (id: T.Guid, query: T.ListMyBookingsQuery = {}) =>
					get<T.Paged<T.AdminBookingResponse>>(`/admin/users/${id}/bookings`, query)
			}
		}
	};
}

export type BookingApi = ReturnType<typeof createBookingApi>;
