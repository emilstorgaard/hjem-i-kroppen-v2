export type ContactProperties = {
	/** Heading of the contact section, shown on the home page and every therapy page. Empty means the default. */
	contactHeading: string;
	/** Intro text of the contact section, one entry per paragraph. Empty means the default. */
	contactText: string[];
	email?: string;
	phone?: string;
};
