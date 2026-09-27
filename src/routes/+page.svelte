<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import DanceTypes from '$lib/components/DanceTypes.svelte';
	import Prices from '$lib/components/Prices.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import { SITE_URL } from '$lib/site';
	import { mediaSrc } from '$lib/utils/media';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const c = $derived(data.page.properties);
	const logo = $derived(data.settings.properties.logo?.[0]);
	const logoUrl = $derived(logo ? mediaSrc(logo.url, 'og', 'jpg') : undefined);

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
		name: data.settings.properties.siteName,
		url: SITE_URL,
		image: logoUrl,
		telephone: c.phone,
		email: c.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: c.streetAddress,
			postalCode: c.postalCode,
			addressLocality: c.city
		},
		sameAs: [c.instagramUrl, c.facebookUrl].filter(Boolean)
	});

	const structuredDataJson = $derived(JSON.stringify(structuredData).replace(/</g, '\\u003c'));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${structuredDataJson}</scr` + `ipt>`}
</svelte:head>

<SeoHead seo={data.page.properties} />

<Hero hero={data.page.properties} />
<About />
<DanceTypes />
<Prices />
<Testimonials />
<Contact contact={data.page.properties} />
