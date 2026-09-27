// Static placeholder content.
// TODO: Replace with data fetched from Umbraco once the CMS is connected.

export type DanceType = {
	title: string;
	description: string;
	icon: 'circle' | 'heart' | 'compass';
};

export const danceTypes: DanceType[] = [
	{
		title: 'Danserum',
		description:
			'Et frirum hvor krop og bevægelse får lov at tale. Danserum er for dig, der ønsker at mærke efter, slippe kontrollen og finde hjem i din egen krop gennem dans og bevægelse.',
		icon: 'circle'
	},
	{
		title: 'Kvinderum',
		description:
			'Et trygt fællesskab kun for kvinder, hvor vi gennem dans, åndedræt og nærvær udforsker det at være kvinde – i kroppen, i følelserne og i fællesskabet med andre.',
		icon: 'heart'
	},
	{
		title: 'Retreats',
		description:
			'Tag et pusterum fra hverdagen på et retreat med fordybelse, dans og bevægelsesterapi. Her er tid og ro til at komme helt hjem i dig selv, sammen med andre.',
		icon: 'compass'
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
