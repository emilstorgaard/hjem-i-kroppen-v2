// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { BookingApi } from '$lib/server/booking-api';
import type { UserResponse } from '$lib/types/booking';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** Access token from the httpOnly session cookie. Never sent to the browser. */
			token: string | null;
			/** The signed-in user for display and routing only; the API authorizes every call itself. */
			user: UserResponse | null;
			/** Booking API client bound to this request's token, client IP and correlation id. */
			api: BookingApi;
			correlationId: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
