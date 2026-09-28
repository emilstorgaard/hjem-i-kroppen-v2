<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="om-mig" aria-labelledby="om-mig-heading" class="bg-white px-6 py-24 lg:px-8">
	<div class="mx-auto max-w-md">
		<h2 id="om-mig-heading" class="sr-only">Om mig &mdash; Mette, danse- og bevægelsesterapeut</h2>

		<div class="relative mx-auto w-full" use:reveal>
			<div
				class="absolute -top-8 -left-8 h-64 w-64 rounded-full bg-mint-600/60 blur-2xl"
				aria-hidden="true"
			></div>
			<div
				class="relative aspect-square overflow-hidden rounded-[3rem] bg-black/5 shadow-2xl ring-1 shadow-black/15 ring-black/10"
			>
				<img
					src="/logo.jpg"
					alt="Mette, grundlægger af Hjem i Kroppen"
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
			<div
				class="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-mint-400/40 blur-2xl"
				aria-hidden="true"
			></div>
		</div>

		<!-- TODO: point to the dedicated About page once it exists -->
		<div class="mt-8 flex justify-center" use:reveal={{ delay: 150 }}>
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
		</div>
	</div>
</section>
