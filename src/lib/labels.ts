import { page } from '$app/state';
import type { HomeLabels, SettingsLabels, SiteLabels } from '$lib/types/labels';

export const DEFAULT_LABELS: SiteLabels = {
	bookButtonText: 'Book tid',
	loginButtonText: 'Log ind',
	heroButtonText: 'FIND DIN DANS',
	testimonialsHeading: 'Hvad kunderne siger',
	contactButtonText: 'Skriv til mig for at høre mere',
	readMoreText: 'Læs mere',
	readMoreAboutText: 'Læs mere om mig',
	bookText: 'Book',
	dmtLabel: 'Hvad er DMT?',
	therapyLabel: 'Terapi',
	testimonialsLabel: 'Anmeldelser',
	contactLabel: 'Kontakt'
};

export const SETTINGS_LABEL_KEYS: (keyof SettingsLabels)[] = ['bookButtonText', 'loginButtonText'];

export const HOME_LABEL_KEYS: (keyof HomeLabels)[] = ['heroButtonText', 'testimonialsHeading', 'contactButtonText', 'readMoreText', 'readMoreAboutText', 'bookText', 'dmtLabel', 'therapyLabel', 'testimonialsLabel', 'contactLabel'];

/** The given texts from an Umbraco item. Empty fields are left out, so the defaults apply. */
export function pickLabels<K extends keyof SiteLabels>(source: object | null | undefined, keys: K[]): Partial<Pick<SiteLabels, K>> {
	const values = (source ?? {}) as Record<string, unknown>;
	const labels: Partial<Pick<SiteLabels, K>> = {};
	for (const key of keys) {
		const value = values[key];
		if (typeof value === 'string' && value.trim()) labels[key] = value.trim();
	}
	return labels;
}

/**
 * The current texts: the defaults, then the texts from "Indstillinger" (`labels`, set by the root layout), then the
 * texts from the home page (`homeLabels`, set by the pages that load it). Call it inside `$derived` in a component, e.g.
 * `const labels = $derived(getLabels());`.
 */
export function getLabels(): SiteLabels {
	return { ...DEFAULT_LABELS, ...page.data.labels, ...page.data.homeLabels };
}
