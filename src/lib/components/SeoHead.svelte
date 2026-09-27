<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL } from '$lib/site';
	import { mediaSrc } from '$lib/utils/media';
	import type { SeoProperties } from '$lib/types/seo';

	type Props = {
		seo: SeoProperties;
		noindex?: boolean;
		canonicalUrl?: string;
	};

	let { seo, noindex = false, canonicalUrl }: Props = $props();

	let ogImage = $derived(seo.ogImage?.[0]);
	let ogImageUrl = $derived(ogImage ? mediaSrc(ogImage.url, 'og', 'jpg') : `${SITE_URL}/logo.jpg`);
	let ogImageAlt = $derived(ogImage?.name ?? 'Hjem i Kroppen – logo');

	let pageUrl = $derived(canonicalUrl ?? `${SITE_URL}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{seo.metaTitle}</title>
	<meta name="description" content={seo.metaDescription} />
	<link rel="canonical" href={pageUrl} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Hjem i Kroppen" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={seo.metaTitle} />
	<meta property="og:description" content={seo.metaDescription} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:image:alt" content={ogImageAlt} />
	{#if ogImage}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{:else}
		<meta property="og:image:width" content="1254" />
		<meta property="og:image:height" content="1254" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.metaTitle} />
	<meta name="twitter:description" content={seo.metaDescription} />
	<meta name="twitter:image" content={ogImageUrl} />
	<meta name="twitter:image:alt" content={ogImageAlt} />
</svelte:head>
