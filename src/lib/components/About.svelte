<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="om-mig" aria-labelledby="om-mig-heading" class="bg-sand-50 px-6 py-24 lg:px-8">
	<div class="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
		<div class="relative mx-auto w-full max-w-md" use:reveal>
			<div
				class="absolute -top-8 -left-8 h-64 w-64 rounded-full bg-sand-200/70 blur-2xl"
				aria-hidden="true"
			></div>
			<div
				class="relative aspect-square overflow-hidden rounded-[3rem] bg-sand-100 shadow-2xl ring-1 shadow-sand-900/15 ring-sand-200"
			>
				<img
					src="/logo.jpg"
					alt="Mette, grundlægger af Hjem i Kroppen"
					class="h-full w-full object-cover"
				/>
			</div>
			<div
				class="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-sand-400/40 blur-2xl"
				aria-hidden="true"
			></div>
		</div>

		<div use:reveal={{ delay: 150 }}>
			<p class="text-sm font-medium tracking-[0.3em] text-sand-600 uppercase">Om mig</p>
			<h2
				class="mt-4 font-serif text-4xl font-semibold text-sand-900 sm:text-5xl"
				id="om-mig-heading"
			>
				Mette &mdash; danse- og bevægelsesterapeut
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-sand-700">
				Jeg er selvstændig og uddannet i Danse- og Bevægelsesterapi, og jeg brænder for at hjælpe
				mennesker med at finde tilbage til deres krop gennem dans, bevægelse og nærvær. Hos mig
				møder du et trygt rum, hvor der er plads til det, der er &mdash; uden krav om at kunne danse
				eller se ud på en bestemt måde.
			</p>
			<p class="mt-4 text-lg leading-relaxed text-sand-700">
				Gennem årene har jeg arbejdet med enkeltpersoner, kvindegrupper og retreats, hvor kroppens
				egen visdom er omdrejningspunktet. Min tilgang er varm, nærværende og båret af en dyb tro
				på, at bevægelse kan hele det, ord ikke altid kan nå.
			</p>

			<div class="mt-8 grid grid-cols-2 gap-6 border-t border-sand-200 pt-8 sm:grid-cols-3">
				<div>
					<p class="font-serif text-3xl font-semibold text-sand-900">10+</p>
					<p class="mt-1 text-sm text-sand-600">års erfaring</p>
				</div>
				<div>
					<p class="font-serif text-3xl font-semibold text-sand-900">500+</p>
					<p class="mt-1 text-sm text-sand-600">forløb og sessioner</p>
				</div>
				<div class="col-span-2 sm:col-span-1">
					<p class="font-serif text-3xl font-semibold text-sand-900">Uddannet</p>
					<p class="mt-1 text-sm text-sand-600">Danse- og bevægelsesterapeut</p>
				</div>
			</div>
		</div>
	</div>
</section>
