<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import DMT from '$lib/components/DMT.svelte';
	import About from '$lib/components/About.svelte';
	import DanceTypes from '$lib/components/DanceTypes.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import ContactV2 from '$lib/components/ContactV2.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<StructuredData settings={data.settings.properties} contact={data.page.properties} />

<SeoHead seo={data.page.properties} />

<Hero hero={data.page.properties} />
<DMT />
<Testimonials testimonials={data.testimonials} />
<DanceTypes danceTypes={data.danceTypes} />
<About />
<ContactV2 contact={data.page.properties} />
