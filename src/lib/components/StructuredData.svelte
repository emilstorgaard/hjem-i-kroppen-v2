<script lang="ts">
	import { SITE_URL } from '$lib/site';
	import { mediaSrc } from '$lib/utils/media';
	import type { ContactProperties } from '$lib/types/contact';
	import type { SettingsProperties } from '$lib/types/settings';

	type Props = {
		settings: SettingsProperties;
		contact: ContactProperties;
	};

	let { settings, contact }: Props = $props();

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
		address: {
			'@type': 'PostalAddress',
			streetAddress: contact.streetAddress,
			postalCode: contact.postalCode,
			addressLocality: contact.city
		},
		sameAs: [contact.instagramUrl, contact.facebookUrl].filter(Boolean)
	});

	const structuredDataJson = $derived(JSON.stringify(structuredData).replace(/</g, '\u003c'));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${structuredDataJson}</scr` + `ipt>`}
</svelte:head>
