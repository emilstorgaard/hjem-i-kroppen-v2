export const THERAPY_SLUGS = ['danseterapi', 'gruppeterapi', 'samtaleterapi'] as const;

export type TherapySlug = (typeof THERAPY_SLUGS)[number];

export function isTherapySlug(value: string): value is TherapySlug {
	return (THERAPY_SLUGS as readonly string[]).includes(value);
}
