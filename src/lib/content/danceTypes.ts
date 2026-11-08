import type { DanceType } from '$lib/types/danceType';

// Static placeholder content.
// TODO: Replace with data fetched from Umbraco once the CMS is connected.
export const danceTypes: DanceType[] = [
	{
		title: 'Danse- og bevægelsesterapi 1:1',
		description:
			'En individuel session, hvor vi bruger dans og bevægelse til at skabe kontakt mellem krop, følelser og tanker – i dit eget tempo.',
		icon: 'circle',
		audience: '1:1',
		participants: 'Individuel session'
	},
	{
		title: 'Danse- og bevægelsesterapi grupper',
		description:
			'Et forløb i mindre hold på op til 4 personer, hvor vi sammen udforsker dans og bevægelse som vej til større kropsbevidsthed og nærvær.',
		icon: 'heart',
		audience: 'Hold',
		participants: '4 personer pr. hold'
	},
	{
		title: 'Coaching – Samtaleterapi 1:1',
		description:
			'En individuel samtale, hvor coaching og terapi går hånd i hånd – med redskaber, du kan bruge i din hverdag.',
		icon: 'compass',
		audience: '1:1',
		participants: 'Individuel session'
	}
];
