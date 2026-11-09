<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Prices from '$lib/components/Prices.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead seo={data.page.properties} />

<Prices prices={data.page.properties} />
