/** Query parameters as a plain object (without form action markers), for hidden inputs in GET forms. */
export function paramsFrom(url: URL): Record<string, string> {
	return Object.fromEntries([...url.searchParams].filter(([key]) => !key.startsWith('/')));
}
