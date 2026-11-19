import type { TherapySlug } from '$lib/therapies';
import type { BookingStatus, ServiceCategory, UserRole } from '$lib/types/booking';

export const CATEGORIES: readonly ServiceCategory[] = ['Dance', 'Conversation', 'Group'];

export const CATEGORY_LABEL: Record<ServiceCategory, string> = {
	Dance: 'Danseterapi',
	Conversation: 'Samtaleterapi',
	Group: 'Gruppeterapi'
};

/** Each API category maps to one of the therapy sub pages. */
export const CATEGORY_SLUG: Record<ServiceCategory, TherapySlug> = {
	Dance: 'danseterapi',
	Conversation: 'samtaleterapi',
	Group: 'gruppeterapi'
};

export function categoryFromSlug(slug: string | null | undefined): ServiceCategory | undefined {
	return CATEGORIES.find((c) => CATEGORY_SLUG[c] === slug);
}

export function isCategory(value: string | null | undefined): value is ServiceCategory {
	return (CATEGORIES as readonly string[]).includes(value ?? '');
}

/** Subtle per-category accents built from the site's mint/rust tokens. */
export const CATEGORY_STYLE: Record<ServiceCategory, { card: string; dot: string; chip: string }> =
	{
		Dance: {
			card: 'bg-mint-200/45 ring-mint-400/50 hover:ring-mint-700/50',
			dot: 'bg-mint-700',
			chip: 'bg-mint-200 text-mint-700'
		},
		Conversation: {
			card: 'bg-rust-100/50 ring-rust-700/15 hover:ring-rust-700/40',
			dot: 'bg-rust-700',
			chip: 'bg-rust-100 text-rust-700'
		},
		Group: {
			card: 'bg-mint-600/60 ring-black/10 hover:ring-black/30',
			dot: 'bg-mint-400',
			chip: 'bg-mint-600 text-black/70'
		}
	};

export const ROLE_LABEL: Record<UserRole, string> = { User: 'Bruger', Admin: 'Administrator' };

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
	Active: 'Aktiv',
	Cancelled: 'Aflyst'
};
