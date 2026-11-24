import type { Guid, IsoDateTime, PageQuery } from './common';

/** The category embedded in service type, session, series and booking responses. */
export type ServiceCategorySummary = {
	id: Guid;
	name: string;
	/** Used in URLs, e.g. `/book?kategori=danseterapi`. */
	slug: string;
};

/** A category as shown to users. The public list only has categories with at least one active service type. */
export type ServiceCategoryResponse = ServiceCategorySummary;

export type AdminServiceCategoryResponse = ServiceCategoryResponse & {
	/** All service types in the category, active or not. A category with service types cannot be deleted. */
	serviceTypeCount: number;
	createdAt: IsoDateTime;
	updatedAt: IsoDateTime;
};

export type ListServiceCategoriesQuery = PageQuery;

/** Used to create and to rename a category. The slug is made from the name by the API. */
export type ServiceCategoryRequest = {
	name: string;
};
