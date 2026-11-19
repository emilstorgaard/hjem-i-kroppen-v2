import type { Guid, IsoDateTime, PageQuery, ServiceCategory } from './common';
import type { AdminBookingResponse, BookingResponse } from './bookings';

/** A non-cancelled session in a series as shown to users. */
export type SeriesSessionResponse = {
	id: Guid;
	startsAt: IsoDateTime;
	endsAt: IsoDateTime;
	location: string | null;
	notes: string | null;
	capacity: number;
	availableSpots: number;
	hasStarted: boolean;
};

/**
 * A series as shown to users. `isBookable` is true while at least one session has not started.
 * `availableSpots` is the lowest number of free spots among the sessions that have not started.
 */
export type SeriesResponse = {
	id: Guid;
	title: string;
	serviceTypeId: Guid;
	serviceTypeName: string;
	category: ServiceCategory;
	isBookable: boolean;
	availableSpots: number;
	firstStartsAt: IsoDateTime | null;
	lastEndsAt: IsoDateTime | null;
	sessions: SeriesSessionResponse[];
};

export type ListBookableSeriesQuery = PageQuery & { serviceTypeId?: Guid; onlyAvailable?: boolean };

export type SeriesBookingResponse = { seriesId: Guid; bookings: BookingResponse[] };

export type AdminSeriesListItemResponse = {
	id: Guid;
	title: string;
	serviceTypeId: Guid;
	serviceTypeName: string;
	category: ServiceCategory;
	isCancelled: boolean;
	sessionCount: number;
	participantCount: number;
	firstStartsAt: IsoDateTime | null;
	lastEndsAt: IsoDateTime | null;
	createdAt: IsoDateTime;
	updatedAt: IsoDateTime;
};

export type AdminSeriesSessionResponse = {
	id: Guid;
	startsAt: IsoDateTime;
	endsAt: IsoDateTime;
	location: string | null;
	capacity: number;
	activeBookingCount: number;
	isCancelled: boolean;
};

/** `participantCount` counts distinct users with an active booking. */
export type AdminSeriesResponse = Omit<AdminSeriesListItemResponse, 'sessionCount'> & {
	cancelledAt: IsoDateTime | null;
	sessions: AdminSeriesSessionResponse[];
};

/** One row per user with bookings in the series. */
export type SeriesParticipantResponse = {
	userId: Guid;
	fullName: string;
	email: string;
	activeBookingCount: number;
	note: string | null;
	firstBookedAt: IsoDateTime;
};

export type AdminSeriesBookingResponse = {
	seriesId: Guid;
	userId: Guid;
	bookings: AdminBookingResponse[];
};

export type ListSeriesQuery = PageQuery & {
	/** Matches the title or the service type name. */
	search?: string;
	serviceTypeId?: Guid;
	upcoming?: boolean;
	isCancelled?: boolean;
};

/** One session per start time. Duration and capacity default to the service type's values when omitted. */
export type CreateSeriesRequest = {
	serviceTypeId: Guid;
	title?: string | null;
	startTimes: IsoDateTime[];
	durationMinutes?: number | null;
	capacity?: number | null;
	location?: string | null;
	notes?: string | null;
};

export type UpdateSeriesRequest = { title: string };
export type ListSeriesParticipantsQuery = PageQuery & { includeCancelled?: boolean };
