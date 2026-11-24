import type { Guid, IsoDateTime, PageQuery } from './common';
import type { ServiceCategorySummary } from './serviceCategories';

/** An active service type as shown to users. */
export type ServiceTypeResponse = {
	id: Guid;
	category: ServiceCategorySummary;
	name: string;
	description: string | null;
	defaultDurationMinutes: number;
	defaultCapacity: number;
	sortOrder: number;
};

export type AdminServiceTypeResponse = ServiceTypeResponse & {
	isActive: boolean;
	createdAt: IsoDateTime;
	updatedAt: IsoDateTime;
};

export type ListPublicServiceTypesQuery = PageQuery & { categoryId?: Guid };
export type ListServiceTypesQuery = ListPublicServiceTypesQuery & { isActive?: boolean };

/** Used to create and to fully replace a service type. */
export type ServiceTypeRequest = {
	categoryId: Guid;
	name: string;
	description: string | null;
	defaultDurationMinutes: number;
	defaultCapacity: number;
	sortOrder: number;
	isActive: boolean;
};
