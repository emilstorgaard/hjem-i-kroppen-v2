import type { AboutPage } from '$lib/types/aboutPage';

// Static placeholder shaped exactly like the Umbraco page, so only the loader changes later.
// TODO: Remove once the "om-mig" page exists in Umbraco.
export const aboutPage: AboutPage = {
	id: 'placeholder-om-mig',
	name: 'Om mig',
	contentType: 'aboutPage',
	properties: {
		metaTitle: 'Om mig | Hjem i Kroppen',
		metaDescription: 'Mød Rikke, danse- og bevægelsesterapeut og grundlægger af Hjem i Kroppen.',
		label: 'Om mig',
		heading: 'Rikke',
		subtitle: 'Danse- og bevægelsesterapeut',
		text: 'Jeg brænder for at hjælpe mennesker med at finde hjem i deres krop gennem dans, bevægelse og nærvær.'
	}
};
