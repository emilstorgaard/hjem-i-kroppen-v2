<script lang="ts">
	import { SITE_URL } from '$lib/site';
	import { mediaSrc } from '$lib/utils/media';
	import type { Address } from '$lib/types/address';
	import type { ContactProperties } from '$lib/types/contact';
	import type { SettingsProperties } from '$lib/types/settings';

	type Props = {
		settings: SettingsProperties;
		contact: ContactProperties;
		/** The business address. Left out when none is given. */
		address?: Address;
	};

	let { settings, contact, address }: Props = $props();

	const logo = $derived(settings.logo?.[0]);
	const logoUrl = $derived(logo ? mediaSrc(logo.url, 'og', 'jpg') : undefined);

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
		name: settings.siteName,
		url: SITE_URL,
		image: logoUrl,
		telephone: contact.phone,
		email: contact.email,
		address: address && {
			'@type': 'PostalAddress',
			streetAddress: address.streetAddress,
			postalCode: address.postalCode,
			addressLocality: address.city,
			addressCountry: 'DK'
		}
	});

	const structuredDataJson = $derived(JSON.stringify(structuredData).replace(/</g, '\u003c'));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${structuredDataJson}</scr` + `ipt>`}
</svelte:head>
