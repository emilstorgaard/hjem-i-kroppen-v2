<script lang="ts">
	import { danceTypes } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

{#snippet icon(name: string)}
	{#if name === 'circle'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-7 w-7"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 12m0 0-4.5 4.5M21 12H7.5"
			/>
		</svg>
	{:else if name === 'heart'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-7 w-7"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
			/>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-7 w-7"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m9.75 9.75 4.06-1.353a.75.75 0 0 1 .943.943L13.4 13.4l-4.06 1.353a.75.75 0 0 1-.943-.943Z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	{/if}
{/snippet}

<section id="tilbud" aria-labelledby="tilbud-heading" class="bg-sand-100 px-6 py-24 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-sand-600 uppercase">Mine tilbud</p>
			<h2
				class="mt-4 font-serif text-4xl font-semibold text-sand-900 sm:text-5xl"
				id="tilbud-heading"
			>
				Dans som vej hjem til dig selv
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-sand-700">
				Dans og bevægelse er et sprog, kroppen altid har kendt. I mine forløb bruger vi dansen som
				redskab til at slippe kontrol, mærke følelser og genfinde kontakten til kroppen &mdash;
				uanset om du kommer alene, som en del af et fællesskab, eller ønsker en dybere fordybelse på
				et retreat.
			</p>
		</div>

		<div class="mt-16 grid gap-8 md:grid-cols-3">
			{#each danceTypes as type, i}
				<div
					use:reveal={{ delay: i * 120 }}
					class="flex flex-col rounded-3xl bg-sand-50 p-8 shadow-sm ring-1 ring-sand-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sand-900/10 hover:ring-sand-300"
				>
					<div
						class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-200/70 text-sand-800"
					>
						{@render icon(type.icon)}
					</div>
					<h3 class="mt-6 font-serif text-2xl font-semibold text-sand-900">{type.title}</h3>
					<p class="mt-3 flex-1 leading-relaxed text-sand-700">{type.description}</p>
					<a
						href="#kontakt"
						class="group mt-6 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-sand-700 hover:text-sand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-600"
					>
						Læs mere / book
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
				</div>
			{/each}
		</div>
	</div>
</section>
