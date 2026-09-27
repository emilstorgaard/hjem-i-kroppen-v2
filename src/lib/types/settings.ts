import type { UmbracoMedia } from './umbraco';

export type SettingsProperties = {
	siteName: string;
	logo: UmbracoMedia[];
	ownerName: string;
};

export type Settings = {
	id: string;
	name: string;
	contentType: string;
	properties: SettingsProperties;
};
