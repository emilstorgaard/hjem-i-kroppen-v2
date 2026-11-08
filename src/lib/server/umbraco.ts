import { error } from '@sveltejs/kit';
import { PUBLIC_UMBRACO_URL } from '$env/static/public';

const BASE_URL = `${PUBLIC_UMBRACO_URL}/umbraco/delivery/api/v2`;
const TIMEOUT_MS = 5000;

async function getJson<T>(url: string, fetchFn: typeof fetch = fetch): Promise<T> {
	const res = await fetchFn(url, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});

	if (res.status === 404) error(404, 'Not found');
	if (!res.ok) throw new Error(`Umbraco responded ${res.status} for ${url}`);

	return (await res.json()) as T;
}

/** Fetches a single Umbraco content item by its route path, e.g. `forside`. Pass SvelteKit's `fetch` from `load`. */
export function getContentByPath<T>(path: string, fetchFn?: typeof fetch): Promise<T> {
	return getJson<T>(`${BASE_URL}/content/item/${path}`, fetchFn);
}
