import type { Guid, IsoDateTime, PageQuery } from './common';
import type { ServiceCategorySummary } from './serviceCategories';

/** A bookable session as shown to users. Contains no participant data. */
export type SessionResponse = {
	id: Guid;
	serviceTypeId: Guid;
	serviceTypeName: string;
	category: ServiceCategorySummary;
	seriesId: Guid | null;
	seriesTitle: string | null;
	startsAt: IsoDateTime;
	endsAt: IsoDateTime;
	location: string | null;
	notes: string | null;
	capacity: number;
	availableSpots: number;
};

export type AdminSessionResponse = SessionResponse & {
	activeBookingCount: number;
	isCancelled: boolean;
	cancelledAt: IsoDateTime | null;
	createdByUserId: Guid;
	createdAt: IsoDateTime;
	updatedAt: IsoDateTime;
};

/** Public list: only sessions that have not started, are not cancelled and whose service type is active. */
export type ListPublicSessionsQuery = PageQuery & {
	serviceTypeId?: Guid;
	categoryId?: Guid;
	/** Starts at or after (inclusive). */
	from?: IsoDateTime;
	/** Starts before (exclusive). */
	to?: IsoDateTime;
	onlyAvailable?: boolean;
};

export type ListSessionsQuery = ListPublicSessionsQuery & {
	seriesId?: Guid;
	isCancelled?: boolean;
	/** true: not ended. false: ended. */
	upcoming?: boolean;
};

/** Duration and capacity default to the service type's values when omitted. */
export type CreateSessionRequest = {
	serviceTypeId: Guid;
	seriesId?: Guid | null;
	startsAt: IsoDateTime;
	durationMinutes?: number | null;
	capacity?: number | null;
	location?: string | null;
	notes?: string | null;
};

export type UpdateSessionRequest = {
	startsAt: IsoDateTime;
	endsAt: IsoDateTime;
	capacity: number;
	location: string | null;
	notes: string | null;
};

export type ListSessionBookingsQuery = PageQuery & { includeCancelled?: boolean };
