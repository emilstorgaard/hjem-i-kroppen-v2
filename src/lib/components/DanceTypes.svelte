<script lang="ts">
	import type { DanceType } from '$lib/types/danceType';
	import { reveal } from '$lib/actions/reveal';
	import { getLabels } from '$lib/labels';
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	let { danceTypes }: { danceTypes: DanceType[] } = $props();

	const labels = $derived(getLabels());
</script>

<section
	id="terapi"
	aria-labelledby="terapi-heading"
	class="bg-mint-600 px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p id="terapi-heading" class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">
				{labels.therapyLabel}
			</p>
		</div>

		<div class="mt-16 flex flex-col gap-6 md:gap-8">
			{#each danceTypes as type, i (type.slug)}
				<div
					use:reveal={{ delay: i * 120 }}
					class="flex flex-col overflow-hidden bg-white shadow-sm ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:ring-black/20 md:flex-row md:items-stretch"
				>
					<div
						class="aspect-4/3 w-full shrink-0 overflow-hidden bg-linear-to-br from-black to-mint-700 md:aspect-auto md:w-80 lg:w-[26rem]"
						aria-hidden="true"
					>
						{#if type.image}
							<img
								src={mediaSrc(type.image.url, 'card')}
								srcset={mediaSrcset(type.image.url, 'card')}
								sizes="(min-width: 1024px) 416px, (min-width: 768px) 320px, 100vw"
								alt=""
								loading="lazy"
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>

					<div class="flex flex-1 flex-col p-8 md:justify-center md:p-10">
						<h3 class="font-serif text-2xl font-semibold text-black">
							<span class="tracking-[0.15em] uppercase md:tracking-normal md:normal-case"
								>{type.title}</span
							>
						</h3>

						<p class="mt-3 leading-relaxed text-black/70">{type.description}</p>

						<div
							class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-mint-700"
						>
							<span>{type.audience}</span>
							<span>{type.participants}</span>
						</div>

						<a
							href="/{type.slug}"
							class="group mt-6 hidden items-center gap-1 rounded-sm text-sm font-medium text-mint-700 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 md:inline-flex"
						>
							{labels.readMoreText}
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

						<a
							href="/{type.slug}"
							class="mt-6 inline-flex items-center justify-center bg-mint-700 px-8 py-3.5 text-sm font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 md:hidden"
						>
							{labels.readMoreText}
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
