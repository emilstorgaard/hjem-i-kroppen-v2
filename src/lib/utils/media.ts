import { getMediaUrl } from '$lib/api/umbraco';

// Add more contexts (e.g. headerLogo/footerLogo) once those images move into Umbraco media.
export const MEDIA_WIDTHS = {
	headerLogo: [96, 192],
	footerLogo: [64, 128],
	og: [1200]
} as const;

type MediaContext = keyof typeof MEDIA_WIDTHS;

export function mediaSrc(url: string, context: MediaContext, format?: 'webp' | 'jpg') {
	const widths = MEDIA_WIDTHS[context];
	const largest = widths[widths.length - 1];
	return getMediaUrl(url, true, largest, format);
}

export function mediaSrcset(url: string, context: MediaContext, format?: 'webp' | 'jpg') {
	return MEDIA_WIDTHS[context].map((w) => `${getMediaUrl(url, true, w, format)} ${w}w`).join(', ');
}
