<script lang="ts">
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import type { ErrorPage } from '$lib/types/errorPage';

	type StatusCopy = {
		heading: string;
		bodyText: string;
		buttonText: string;
		metaTitle: string;
		metaDescription: string;
	};

	const defaultCopy: Record<number, StatusCopy> = {
		404: {
			heading: 'Siden blev ikke fundet',
			bodyText: 'Siden du leder efter findes desværre ikke, eller er blevet flyttet.',
			buttonText: 'Tilbage til forsiden',
			metaTitle: 'Error 404',
			metaDescription: 'Error 404'
		},
		500: {
			heading: 'Der gik noget galt',
			bodyText: 'Vi har problemer med at vise siden lige nu. Prøv igen om lidt.',
			buttonText: 'Gå til forsiden',
			metaTitle: 'Der opstod en fejl',
			metaDescription: 'Der opstod en uventet fejl på serveren.'
		}
	};

	const fallback: StatusCopy = {
		heading: 'Der opstod en fejl',
		bodyText: 'Noget gik ikke som forventet. Prøv at gå tilbage til forsiden.',
		buttonText: 'Gå til forsiden',
		metaTitle: 'Der opstod en fejl',
		metaDescription: 'Der opstod en uventet fejl.'
	};

	const status = $derived(page.status);
	const isNotFound = $derived(status === 404);

	const errorPage = $derived(isNotFound ? (page.data.errorPage as ErrorPage | null) : null);
	const p = $derived(errorPage?.properties);

	const copy = $derived(defaultCopy[status] ?? fallback);

	const heading = $derived(p?.heading ?? copy.heading);
	const bodyText = $derived(p?.bodyText ?? copy.bodyText);
	const buttonText = $derived(p?.buttonText ?? copy.buttonText);
	const metaTitle = $derived(p?.metaTitle ?? copy.metaTitle);
	const metaDescription = $derived(p?.metaDescription ?? copy.metaDescription);
</script>

<SeoHead
	seo={{
		metaTitle,
		metaDescription
	}}
	noindex={true}
/>

<main
	class="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-6 py-24 text-center lg:px-8"
	style="padding-top: var(--header-h, 4.5rem)"
>
	<div
		class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-mint-600/60 blur-3xl"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute top-1/3 -right-32 h-112 w-md rounded-full bg-mint-400/30 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative flex w-full max-w-xl flex-col items-center">
		<img
			src="/logo.jpg"
			alt="Hjem i Kroppen logo"
			width="128"
			height="128"
			loading="lazy"
			fetchpriority="low"
			decoding="async"
			class="mb-4 h-32 w-32 rounded-full object-cover shadow-lg"
		/>

		<p class="font-serif text-6xl font-semibold text-black/80 sm:text-7xl" role="alert">
			{status}
		</p>

		<h1 class="mt-4 font-serif text-2xl font-semibold text-black sm:text-3xl">
			{heading}
		</h1>

		<p class="mt-4 text-base leading-relaxed text-black/70 sm:text-lg">
			{bodyText}
		</p>

		<a
			href="/"
			class="mt-8 rounded-full bg-mint-700 px-8 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
		>
			{buttonText}
		</a>
	</div>
</main>
