export type BlockList<T> = {
	items: T[];
};

/** One item in a Block List, as returned by the Delivery API. */
export type ElementBlock<T> = {
	content: {
		contentType: string;
		id: string;
		properties: T;
	};
	settings: unknown | null;
};

export type PriceItemBlock = ElementBlock<{
	title: string;
	duration: string;
	price: string;
	unit: string;
}>;
