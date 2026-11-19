/** Danish label and tone for the number of free spots on a session or series. */
export function spotsLabel(availableSpots: number): {
	text: string;
	tone: 'full' | 'last' | 'few' | 'open';
} {
	if (availableSpots <= 0) return { text: 'Fuldt booket', tone: 'full' };
	if (availableSpots === 1) return { text: 'Sidste plads!', tone: 'last' };
	return { text: `${availableSpots} ledige pladser`, tone: availableSpots <= 3 ? 'few' : 'open' };
}

export const SPOTS_TONE_CLASS = {
	full: 'text-black/45',
	last: 'text-rust-700 font-semibold',
	few: 'text-rust-700',
	open: 'text-mint-700'
} as const;
