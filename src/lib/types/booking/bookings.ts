import type { BookingStatus, Guid, IsoDateTime, PageQuery } from './common';
import type { ServiceCategorySummary } from './serviceCategories';

/** One of the signed-in user's bookings with the session details the user needs. */
export type BookingResponse = {
	id: Guid;
	sessionId: Guid;
	seriesId: Guid | null;
	serviceTypeName: string;
	category: ServiceCategorySummary;
	startsAt: IsoDateTime;
	endsAt: IsoDateTime;
	location: string | null;
	status: BookingStatus;
	note: string | null;
	createdAt: IsoDateTime;
	cancelledAt: IsoDateTime | null;
};

export type AdminBookingResponse = {
	id: Guid;
	sessionId: Guid;
	seriesId: Guid | null;
	userId: Guid;
	userFullName: string;
	userEmail: string;
	serviceTypeName: string;
	startsAt: IsoDateTime;
	endsAt: IsoDateTime;
	status: BookingStatus;
	note: string | null;
	createdAt: IsoDateTime;
	cancelledAt: IsoDateTime | null;
};

export type ListMyBookingsQuery = PageQuery & {
	status?: BookingStatus;
	/** true: the session has not ended. false: it has ended. */
	upcoming?: boolean;
	seriesId?: Guid;
};

export type ListBookingsQuery = ListMyBookingsQuery & {
	userId?: Guid;
	sessionId?: Guid;
	serviceTypeId?: Guid;
	from?: IsoDateTime;
	to?: IsoDateTime;
};

export type CreateBookingRequest = { sessionId: Guid; note?: string | null };
export type CreateSeriesBookingRequest = { note?: string | null };
export type AdminCreateBookingRequest = { userId: Guid; sessionId: Guid; note?: string | null };
export type AdminCreateSeriesBookingRequest = { userId: Guid; note?: string | null };
