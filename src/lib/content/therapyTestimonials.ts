import { testimonials } from '$lib/content/testimonials';
import type { TherapySlug } from '$lib/therapies';
import type { Testimonial } from '$lib/types/testimonial';

const byName = (name: string) => testimonials.find((t) => t.name === name)!;

// Static placeholders: recommendations about each specific therapy.
// TODO: PLACEHOLDER TEXTS AND NAMES - replace with real recommendations (from Umbraco) before launch.
export const therapyTestimonials: Record<TherapySlug, Testimonial[]> = {
	danseterapi: [
		byName('Anne, 42 år'),
		{
			quote:
				'I de individuelle sessioner fik jeg plads til at mærke efter i mit eget tempo. Det har gjort en stor forskel for mig.',
			name: 'Mette, 47 år',
			rating: 5
		},
		{
			quote:
				'Jeg havde aldrig prøvet dansterapi før, men følte mig tryg fra første minut. Jeg kan klart anbefale det.',
			name: 'Julie, 33 år',
			rating: 5
		}
	],
	gruppeterapi: [
		byName('Camilla, 35 år'),
		byName('Sofie, 51 år'),
		{
			quote:
				'Det lille hold gjorde det trygt at åbne op, og det betød meget at dele oplevelsen med de andre.',
			name: 'Trine, 44 år',
			rating: 5
		}
	],
	samtaleterapi: [
		byName('Louise, 38 år'),
		{
			quote:
				'Samtalerne gav mig konkrete redskaber, som jeg bruger i min hverdag. Jeg føler mig set og hørt.',
			name: 'Maria, 40 år',
			rating: 5
		},
		{
			quote:
				'Coachingen hjalp mig med at få styr på mine tanker og tage de første skridt. Varmt anbefalet.',
			name: 'Pernille, 36 år',
			rating: 5
		}
	]
};
