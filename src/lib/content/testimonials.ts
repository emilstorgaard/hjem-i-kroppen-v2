import type { Testimonial } from '$lib/types/testimonial';

// Anmeldelser tilføjes manuelt af Rikke i Umbraco – kunderne kan ikke selv skrive anmeldelser.
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
