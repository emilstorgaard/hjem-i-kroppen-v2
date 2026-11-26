import type { UmbracoMedia } from './umbraco';
import type { SettingsLabels } from './labels';

/** The button and section texts (group "Tekster") are optional; empty ones fall back to `DEFAULT_LABELS`. */
export type SettingsProperties = Partial<Record<keyof SettingsLabels, string | null>> & {
	siteName: string;
	logo: UmbracoMedia[];
	ownerName: string;
	/** Shown in the footer as "Fotos …". Optional. */
	photographer?: string | null;
};

export type Settings = {
	id: string;
	name: string;
	contentType: string;
	properties: SettingsProperties;
};
