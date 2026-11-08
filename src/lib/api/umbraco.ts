import { PUBLIC_UMBRACO_URL } from '$env/static/public';

/** Resolves a (possibly relative) Umbraco media url to an absolute one, optionally resized via ImageSharp query params. */
export function getMediaUrl(
	relativeUrl: string,
	withParams = false,
	width = 1000,
	format: 'webp' | 'jpg' = 'webp'
): string {
	if (!relativeUrl) return '';

	const target = new URL(relativeUrl, PUBLIC_UMBRACO_URL);

	if (withParams) {
		target.searchParams.set('width', String(width));
		target.searchParams.set('format', format);
		target.searchParams.set('quality', '75');
	}

	return target.toString();
}
