import type { BookingStatus, UserRole } from '$lib/types/booking';

export type CategoryStyle = { card: string; dot: string };

/** Categories have no colour of their own; every session card uses the same look. */
export const CATEGORY_STYLE: CategoryStyle = {
	card: 'bg-mint-200/45 ring-mint-400/50 hover:ring-mint-700/50',
	dot: 'bg-mint-700'
};

export const ROLE_LABEL: Record<UserRole, string> = { User: 'Bruger', Admin: 'Administrator' };

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
	Active: 'Aktiv',
	Cancelled: 'Aflyst'
};
