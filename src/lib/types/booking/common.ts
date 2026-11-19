// Shared shapes of the HjemIKroppenBooking API (base path /api/v1).
// Guids are strings, all timestamps are ISO 8601 UTC strings, enums are serialized as strings.

export type Guid = string;
/** ISO 8601 timestamp in UTC, e.g. `2027-03-01T17:00:00Z`. */
export type IsoDateTime = string;

export type ServiceCategory = 'Dance' | 'Conversation' | 'Group';
export type UserRole = 'User' | 'Admin';
export type BookingStatus = 'Active' | 'Cancelled';

/** `PagedResponse<T>`. `page` is 1-based. */
export type Paged<T> = {
	items: T[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
};

export type PageQuery = {
	page?: number;
	/** Default 20, max 100. */
	pageSize?: number;
};

/** `FieldError`: one validation error for a field. */
export type ApiFieldError = { code: string; message: string };

/** The `application/problem+json` body every error response has. `errors` is only present on 422. */
export type ApiProblem = {
	type?: string;
	title?: string;
	status: number;
	/** Danish, safe to show to the user. */
	detail: string;
	code: string;
	traceId?: string;
	correlationId?: string;
	parameters?: Record<string, unknown>;
	errors?: Record<string, ApiFieldError[]>;
};
