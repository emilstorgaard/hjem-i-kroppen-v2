import type { PriceItem } from '$lib/types/priceItem';

// Static placeholder content.
// TODO: Replace with data fetched from Umbraco once the CMS is connected.
export const priceItems: PriceItem[] = [
	{
		title: 'Enkelt session',
		price: '650',
		unit: 'kr.',
		description: 'En individuel session med danse- og bevægelsesterapi, tilpasset dig og dit behov.'
	},
	{
		title: 'Klippekort',
		price: '2.900',
		unit: 'kr. / 5 gange',
		description:
			'Fem sessioner samlet i et klippekort – en god måde at komme godt i gang med et forløb.',
		featured: true
	},
	{
		title: 'Kvinderum',
		price: '250',
		unit: 'kr. / gang',
		description:
			'Deltagelse i det faste kvinderumsfællesskab. Spørg gerne ind til de kommende datoer.'
	},
	{
		title: 'Retreat',
		price: 'Fra 1.800',
		unit: 'kr.',
		description:
			'Prisen afhænger af retreatets længde og indhold. Kontakt mig for det aktuelle program.'
	}
];
