<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import PageShell from '$lib/components/booking/PageShell.svelte';
	import RegisterForm from '$lib/components/booking/RegisterForm.svelte';
	import { resultFor } from '$lib/booking/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const loginHref = $derived(
		data.redirectTo ? `/login?redirectTo=${encodeURIComponent(data.redirectTo)}` : '/login'
	);
</script>

<SeoHead
	seo={{
		metaTitle: 'Opret bruger | Hjem i Kroppen',
		metaDescription: 'Opret en bruger for at booke tider hos Hjem i Kroppen.'
	}}
	noindex
/>

<PageShell
	eyebrow="Book tid"
	title="Opret bruger"
	intro="Med en bruger kan du booke tider, se dine bookinger og aflyse, hvis planerne ændrer sig."
	width="sm"
	decorated
>
	<div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10 sm:p-8">
		<RegisterForm redirectTo={data.redirectTo} result={resultFor(form, 'register')} {loginHref} />
	</div>
</PageShell>
