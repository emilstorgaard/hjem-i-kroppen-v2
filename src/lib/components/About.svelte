<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

{#snippet readMore()}
	<a
		href="/om-mig"
		class="group inline-flex items-center gap-2 rounded-full border border-black/20 px-8 py-3 text-sm font-medium tracking-[0.2em] text-black uppercase transition-colors hover:bg-mint-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
	>
		Læs mere om mig
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
	class="bg-white py-24 max-md:px-0 md:px-6 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-5xl">
		<h2 id="om-mig-heading" class="sr-only">Om mig &mdash; Rikke, danse- og bevægelsesterapeut</h2>

		<!-- Mobile: full-width image with the text overlaid -->
		<div class="md:hidden">
			<div class="relative aspect-square w-full overflow-hidden bg-black/5" use:reveal>
				<img
					src="/logo.jpg"
					alt="Rikke, grundlægger af Hjem i Kroppen"
					class="h-full w-full object-cover"
				/>
				<div
					class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"
					aria-hidden="true"
				></div>
				<div class="absolute inset-x-0 bottom-0 p-8">
					<p class="text-sm font-medium tracking-[0.3em] text-mint-200 uppercase">Om mig</p>
					<p class="mt-3 font-serif text-3xl font-semibold text-white">Rikke</p>
					<p class="mt-1 text-sm font-medium tracking-[0.2em] text-mint-200 uppercase">
						Danse- og bevægelsesterapeut
					</p>
					<p class="mt-3 leading-relaxed text-white/85">
						Jeg brænder for at hjælpe mennesker med at finde hjem i deres krop gennem dans,
						bevægelse og nærvær.
					</p>
				</div>
			</div>

			<!-- TODO: point to the dedicated About page once it exists -->
			<div class="mt-8 flex justify-center px-6" use:reveal={{ delay: 150 }}>
				{@render readMore()}
			</div>
		</div>

		<!-- Tablet/desktop: two boxes - image on the left, text on the right -->
		<div class="hidden gap-6 md:grid md:grid-cols-2 lg:gap-8">
			<div
				use:reveal
				class="relative min-h-[28rem] overflow-hidden bg-black/5 shadow-sm ring-1 ring-black/10"
			>
				<img
					src="/logo.jpg"
					alt="Rikke, grundlægger af Hjem i Kroppen"
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>

			<div
				use:reveal={{ delay: 150 }}
				class="flex flex-col justify-center bg-mint-600 p-10 shadow-sm ring-1 ring-black/10 lg:p-14"
			>
				<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Om mig</p>
				<p class="mt-4 font-serif text-4xl font-semibold text-black">Rikke</p>
				<p class="mt-2 text-sm font-medium tracking-[0.2em] text-mint-700 uppercase">
					Danse- og bevægelsesterapeut
				</p>
				<p class="mt-6 leading-relaxed text-black/70">
					Jeg brænder for at hjælpe mennesker med at finde hjem i deres krop gennem dans,
					bevægelse og nærvær.
				</p>
				<div class="mt-8">
					{@render readMore()}
				</div>
			</div>
		</div>
	</div>
</section>