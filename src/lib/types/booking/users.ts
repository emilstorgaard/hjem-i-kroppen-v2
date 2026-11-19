import type { Guid, IsoDateTime, PageQuery, UserRole } from './common';

/** The signed-in user's own profile. */
export type UserResponse = { id: Guid; email: string; fullName: string; role: UserRole };

export type AdminUserResponse = UserResponse & {
	isActive: boolean;
	createdAt: IsoDateTime;
	updatedAt: IsoDateTime;
};

export type UpdateMeRequest = { fullName: string; email: string };
export type ChangePasswordRequest = { currentPassword: string; newPassword: string };
export type DeactivateMeRequest = { password: string };

export type ListUsersQuery = PageQuery & { search?: string; role?: UserRole; isActive?: boolean };
export type UpdateUserRequest = { fullName: string; email: string };
export type ChangeUserRoleRequest = { role: UserRole };
export type ResetUserPasswordRequest = { newPassword: string };
