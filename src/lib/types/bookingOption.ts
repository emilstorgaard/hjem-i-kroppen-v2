export type BookingOption = {
	title: string;
	/** Booking API series id. When set, "Book" opens that series; otherwise the calendar filtered to the therapy. */
	seriesId?: string;
};
