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

<section
	id="tilbud"
	aria-labelledby="tilbud-heading"
	class="bg-mint-600 px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Terapi</p>
		</div>

		<div class="mt-16 flex flex-col gap-6 md:gap-8">
			{#each danceTypes as type, i (type.title)}
				<div
					use:reveal={{ delay: i * 120 }}
					class="flex flex-col overflow-hidden bg-white shadow-sm ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:ring-black/20 md:flex-row md:items-stretch"
				>
					<!-- Mobile-only cover photo (placeholder gradient until real photos are supplied) -->
					<div
						class="flex aspect-4/3 w-full items-center justify-center bg-linear-to-br from-black to-mint-700 text-white md:hidden"
						aria-hidden="true"
					>
						{@render icon(type.icon)}
					</div>

					<!-- Desktop-only accent panel, replacing the cramped 3-column grid with a wide row so the longer text has room to breathe -->
					<div
						class="hidden shrink-0 items-center justify-center bg-linear-to-br from-black to-mint-700 text-white md:flex md:w-80 lg:w-[26rem]"
						aria-hidden="true"
					>
						{@render icon(type.icon)}
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
							href="dancetype{i + 1}"
							class="group mt-6 hidden items-center gap-1 rounded-sm text-sm font-medium text-mint-700 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 md:inline-flex"
						>
							Læs mere
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
							href="dancetype{i + 1}"
							class="mt-6 inline-flex items-center justify-center bg-mint-700 px-8 py-3.5 text-sm font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 md:hidden"
						>
							Læs mere
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>