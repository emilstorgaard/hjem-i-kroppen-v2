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
</script>

<StructuredData settings={data.settings.properties} contact={data.page.properties} />

<SeoHead seo={data.page.properties} />

<Hero hero={data.page.properties} />
<DMT />
<Testimonials testimonials={data.testimonials} />
{#if data.danceTypes.length > 0}
	<DanceTypes danceTypes={data.danceTypes} />
{/if}
<About />
<Contact contact={data.page.properties} addresses={data.addresses} />
