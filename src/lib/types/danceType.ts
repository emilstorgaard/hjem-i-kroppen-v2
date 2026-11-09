import type { TherapySlug } from '$lib/therapies';

export type DanceType = {
	slug: TherapySlug;
	title: string;
	description: string;
	icon: 'circle' | 'heart' | 'compass';
	audience: string;
	participants: string;
};
