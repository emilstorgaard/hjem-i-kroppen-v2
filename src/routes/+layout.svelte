<script lang="ts">
	import '$lib/styles/app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toaster from '$lib/components/booking/Toaster.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col bg-white font-sans text-black">
	<Header settings={data.settings.properties} user={data.user} />
	<main id="main-content" class="flex-1">
		{@render children()}
	</main>
	<Footer settings={data.settings.properties} />
</div>

<Toaster />
