import type { IsoDateTime } from './common';
import type { UserResponse } from './users';

export type LoginRequest = { email: string; password: string };

export type RegisterRequest = { email: string; fullName: string; password: string };

export type LoginResponse = {
	accessToken: string;
	expiresAt: IsoDateTime;
	user: UserResponse;
};
