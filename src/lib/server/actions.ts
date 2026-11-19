import { fail } from '@sveltejs/kit';
import type { FormResult } from '$lib/booking/forms';
import { ApiError } from './booking-api';

/**
 * Turns an `ApiError` into a `fail()` with the API's Danish `detail` and field errors.
 * Anything else (including SvelteKit redirects thrown on 401) is re-thrown.
 */
export function apiFail(err: unknown, formId: string, values?: Record<string, string>) {
	if (!(err instanceof ApiError)) throw err;
	const status = err.status >= 400 && err.status < 600 ? err.status : 503;
	return fail(status, {
		formId,
		message: err.detail,
		fieldErrors: err.fieldErrors,
		parameters: err.parameters,
		values
	} satisfies FormResult);
}

/** A client-side validation failure (e.g. an unparseable date) before anything is sent to the API. */
export function inputFail(
	formId: string,
	fieldErrors: Record<string, string[]>,
	values?: Record<string, string>
) {
	return fail(422, {
		formId,
		message: 'Et eller flere felter er ugyldige.',
		fieldErrors,
		values
	} satisfies FormResult);
}

export function ok(formId: string, message: string, extra: Partial<FormResult> = {}): FormResult {
	return { formId, success: true, message, ...extra };
}

/** Reads string fields from form data. Missing fields become ''. */
export async function readForm<K extends string>(
	request: Request,
	...keys: K[]
): Promise<Record<K, string> & { data: FormData }> {
	const data = await request.formData();
	const out = { data } as Record<K, string> & { data: FormData };
	for (const key of keys) {
		const value = data.get(key);
		(out as Record<string, unknown>)[key] = typeof value === 'string' ? value.trim() : '';
	}
	return out;
}

/** '' → null, otherwise the trimmed string. */
export function optional(value: string): string | null {
	return value === '' ? null : value;
}

/** '' → undefined so the API applies its default; otherwise a number (NaN reaches the API's validator as invalid). */
export function optionalInt(value: string): number | undefined {
	return value === '' ? undefined : Number(value);
}

export function requireId(value: string): string {
	if (!/^[0-9a-f-]{36}$/i.test(value))
		throw new ApiError({
			status: 400,
			code: 'request.invalid',
			detail: 'Forespørgslen er ugyldig.'
		});
	return value;
}
