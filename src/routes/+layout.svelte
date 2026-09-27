<script lang="ts">
	import '$lib/styles/app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col bg-sand-50 font-sans text-sand-900">
	<Header settings={data.settings.properties} />
	<main id="main-content" class="flex-1">
		{@render children()}
	</main>
	<Footer settings={data.settings.properties} />
</div>
