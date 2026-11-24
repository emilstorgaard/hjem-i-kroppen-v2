/** A booking option as stored on a therapy page in Umbraco: an optional title and the chosen service type. */
export type BookingOptionRef = {
	title: string;
	serviceTypeId: string | null;
};

/** A booking option ready for rendering. `href` is e.g. `/book?kategori=gruppeterapi&ydelse=<id>`. */
export type BookingOption = {
	title: string;
	href: string;
};
