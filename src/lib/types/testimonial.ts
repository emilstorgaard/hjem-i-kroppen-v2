export type Testimonial = {
	quote: string;
	name: string;
	rating: number;
};

/** Element type Anmeldelse as the Delivery API returns it: `quote`, `author` ("name" is reserved in Umbraco) and `rating`. */
export type TestimonialElement = {
	quote?: string | null;
	author?: string | null;
	rating?: number | null;
};
