/** Returns `pathname?search` with the given query parameters set (`null`/`undefined`/'' removes them). */
export function withParams(
	url: URL,
	changes: Record<string, string | number | boolean | null | undefined>
): string {
	const next = new URL(url);
	for (const [key, value] of Object.entries(changes)) {
		if (value === null || value === undefined || value === '' || value === false)
			next.searchParams.delete(key);
		else next.searchParams.set(key, String(value));
	}
	// Form action markers (`?/book`) never belong in a link.
	for (const key of [...next.searchParams.keys()])
		if (key.startsWith('/')) next.searchParams.delete(key);
	const search = next.searchParams.toString();
	return search ? `${next.pathname}?${search}` : next.pathname;
}

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isGuid(value: string | null | undefined): value is string {
	return !!value && GUID.test(value);
}

/** Form action URL that keeps the current query (`/book?uge=…&session=…&/book`), so a non-JS submit returns to the same view. */
export function actionUrl(url: URL, action: string): string {
	const base = withParams(url, {});
	return `${base}${base.includes('?') ? '&' : '?'}/${action}`;
}
