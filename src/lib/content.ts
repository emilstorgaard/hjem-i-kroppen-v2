// Static placeholder content.
// TODO: Replace with data fetched from Umbraco once the CMS is connected.

export type DanceType = {
	title: string;
	description: string;
	icon: 'circle' | 'heart' | 'compass';
	audience: string;
	participants: string;
};

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

export type PriceItem = {
	title: string;
	price: string;
	unit: string;
	description: string;
	featured?: boolean;
};

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

export type Testimonial = {
	quote: string;
	name: string;
	rating: number;
};

// Anmeldelser tilføjes manuelt af Mette i Umbraco – kunderne kan ikke selv skrive anmeldelser.
export const testimonials: Testimonial[] = [
	{
		quote:
			'Jeg har fundet en helt ny ro i min krop efter forløbet i Danserum. Det har givet mig redskaber, jeg bruger hver dag.',
		name: 'Anne, 42 år',
		rating: 5
	},
	{
		quote:
			'Kvinderum er blevet et fast holdepunkt i min måned. Et smukt rum med plads til at være present og ærlig.',
		name: 'Camilla, 35 år',
		rating: 5
	},
	{
		quote:
			'Retreatet var en gave til mig selv. Jeg kom hjem med en helt anden ro og forbindelse til min krop.',
		name: 'Sofie, 51 år',
		rating: 5
	},
	{
		quote:
			'Jeg var meget nervøs for at deltage, men blev mødt med så meget varme og tryghed. Kan varmt anbefales.',
		name: 'Louise, 38 år',
		rating: 5
	}
];
