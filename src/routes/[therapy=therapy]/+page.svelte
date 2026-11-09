<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import TherapyPage from '$lib/components/TherapyPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead seo={data.page.properties} />

<TherapyPage therapy={data.page.properties} contact={data.contact} addresses={data.addresses} />
