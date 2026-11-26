<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import DMT from '$lib/components/DMT.svelte';
	import About from '$lib/components/About.svelte';
	import DanceTypes from '$lib/components/DanceTypes.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const home = $derived(data.page.properties);
	const showDmt = $derived(home.dmt.heading !== '' || home.dmt.paragraphs.length > 0);
</script>

<StructuredData settings={data.settings.properties} contact={home} address={home.addresses[0]} />

<SeoHead seo={home} />

<Hero hero={home} />
{#if showDmt}
	<DMT dmt={home.dmt} />
{/if}
{#if home.testimonials.length > 0}
	<Testimonials testimonials={home.testimonials} />
{/if}
{#if data.danceTypes.length > 0}
	<DanceTypes danceTypes={data.danceTypes} />
{/if}
{#if data.about}
	<About about={data.about} />
{/if}
<Contact contact={home} addresses={home.addresses} />
