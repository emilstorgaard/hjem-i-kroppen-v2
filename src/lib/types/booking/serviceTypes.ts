import type { Guid, IsoDateTime, PageQuery, ServiceCategory } from './common';

/** An active service type as shown to users. */
export type ServiceTypeResponse = {
	id: Guid;
	category: ServiceCategory;
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

export type ListPublicServiceTypesQuery = PageQuery & { category?: ServiceCategory };
export type ListServiceTypesQuery = ListPublicServiceTypesQuery & { isActive?: boolean };

/** Used to create and to fully replace a service type. */
export type ServiceTypeRequest = {
	category: ServiceCategory;
	name: string;
	description: string | null;
	defaultDurationMinutes: number;
	defaultCapacity: number;
	sortOrder: number;
	isActive: boolean;
};
