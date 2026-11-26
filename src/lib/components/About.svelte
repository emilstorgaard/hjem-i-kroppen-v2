<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { getLabels } from '$lib/labels';
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	import type { AboutPageProperties } from '$lib/types/aboutPage';

	/** The section is a teaser for the about page: label, name, subtitle, first paragraph and image. */
	let { about }: { about: AboutPageProperties } = $props();

	const image = $derived(about.image?.[0]);
	const imageAlt = $derived(`${about.heading}, grundlægger af Hjem i Kroppen`);
	const teaser = $derived(about.paragraphs[0] ?? '');

	const labels = $derived(getLabels());
</script>

{#snippet photo(extraClass: string)}
	{#if image}
		<img
			src={mediaSrc(image.url, 'splitImage')}
			srcset={mediaSrcset(image.url, 'splitImage')}
			sizes="(min-width: 1024px) 496px, (min-width: 768px) 50vw, 100vw"
			alt={imageAlt}
			loading="lazy"
			class={['h-full w-full object-cover', extraClass]}
		/>
	{:else}
		<img
			src="/logo.jpg"
			alt={imageAlt}
			loading="lazy"
			class={['h-full w-full object-cover', extraClass]}
		/>
	{/if}
{/snippet}

{#snippet readMore()}
	<a
		href="/om-mig"
		class="group inline-flex items-center gap-2 rounded-full border border-black/20 px-8 py-3 text-sm font-medium tracking-[0.2em] text-black uppercase transition-colors hover:bg-mint-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
	>
		{labels.readMoreAboutText}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
			/>
		</svg>
	</a>
{/snippet}

<section
	id="om-mig"
	aria-labelledby="om-mig-heading"
	class="bg-white pb-24 max-md:px-0 max-md:pt-0 md:px-6 md:py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-5xl">
		<h2 id="om-mig-heading" class="sr-only">
			{about.label} &mdash; {about.heading}{about.subtitle ? `, ${about.subtitle}` : ''}
		</h2>

		<div class="md:hidden">
			<div class="relative aspect-square w-full overflow-hidden bg-black/5" use:reveal>
				{@render photo('')}
				<div
					class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"
					aria-hidden="true"
				></div>
				<div class="absolute inset-x-0 bottom-0 p-8">
					<p class="text-sm font-medium tracking-[0.3em] text-mint-200 uppercase">{about.label}</p>
					<p class="mt-3 font-serif text-3xl font-semibold text-white">{about.heading}</p>
					{#if about.subtitle}
						<p class="mt-1 text-sm font-medium tracking-[0.2em] text-mint-200 uppercase">
							{about.subtitle}
						</p>
					{/if}
					{#if teaser}
						<p class="mt-3 leading-relaxed text-white/85">{teaser}</p>
					{/if}
				</div>
			</div>

			<div class="mt-8 flex justify-center px-6" use:reveal={{ delay: 150 }}>
				{@render readMore()}
			</div>
		</div>

		<div class="hidden gap-6 md:grid md:grid-cols-2 lg:gap-8">
			<div
				use:reveal
				class="relative min-h-[28rem] overflow-hidden bg-black/5 shadow-sm ring-1 ring-black/10"
			>
				{@render photo('absolute inset-0')}
			</div>

			<div
				use:reveal={{ delay: 150 }}
				class="flex flex-col justify-center bg-mint-600 p-10 shadow-sm ring-1 ring-black/10 lg:p-14"
			>
				<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">{about.label}</p>
				<p class="mt-4 font-serif text-4xl font-semibold text-black">{about.heading}</p>
				{#if about.subtitle}
					<p class="mt-2 text-sm font-medium tracking-[0.2em] text-mint-700 uppercase">
						{about.subtitle}
					</p>
				{/if}
				{#if teaser}
					<p class="mt-6 leading-relaxed text-black/70">{teaser}</p>
				{/if}
				<div class="mt-8">
					{@render readMore()}
				</div>
			</div>
		</div>
	</div>
</section>
