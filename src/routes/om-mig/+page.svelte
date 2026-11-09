<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AboutMe from '$lib/components/AboutMe.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead seo={data.page.properties} />

<AboutMe about={data.page.properties} />
