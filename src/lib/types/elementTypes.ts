export type BlockList<T> = {
	items: T[];
};

export type PriceItemBlock = {
	content: {
		contentType: string;
		id: string;
		properties: {
			title: string;
			duration: string;
			price: string;
			unit: string;
		};
	};
	settings: unknown | null;
};
