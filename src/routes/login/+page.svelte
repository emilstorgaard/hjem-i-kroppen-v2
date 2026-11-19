<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import PageShell from '$lib/components/booking/PageShell.svelte';
	import LoginForm from '$lib/components/booking/LoginForm.svelte';
	import { resultFor } from '$lib/booking/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const registerHref = $derived(
		data.redirectTo
			? `/opret-bruger?redirectTo=${encodeURIComponent(data.redirectTo)}`
			: '/opret-bruger'
	);
</script>

<SeoHead
	seo={{
		metaTitle: 'Log ind | Hjem i Kroppen',
		metaDescription: 'Log ind for at booke og se dine tider hos Hjem i Kroppen.'
	}}
	noindex
/>

<PageShell eyebrow="Velkommen tilbage" title="Log ind" width="sm" decorated>
	<div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10 sm:p-8">
		<LoginForm redirectTo={data.redirectTo} result={resultFor(form, 'login')} {registerHref} />
	</div>
</PageShell>
