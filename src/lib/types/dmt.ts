export type DmtPoint = {
	title: string;
	text: string;
};

/** The "Hvad er DMT?" section on the home page. */
export type DmtProperties = {
	heading: string;
	paragraphs: string[];
	points: DmtPoint[];
};
