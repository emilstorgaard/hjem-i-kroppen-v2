import type { Address } from '$lib/types/address';

/** The address as display lines: street, then postal code and city. */
export function addressLines(a: Address): string[] {
	return [a.streetAddress, [a.postalCode, a.city].filter(Boolean).join(' ')].filter(Boolean);
}

export function directionsHref(a: Address): string {
	const destination = addressLines(a).join(', ');
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
