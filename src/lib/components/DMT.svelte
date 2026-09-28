<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

<section
	id="dmt"
	aria-labelledby="dmt-heading"
	class="bg-mint-600 px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-4xl text-center" use:reveal>
		<p class="text-sm font-medium tracking-[0.3em] text-black/70 uppercase">Hvad er DMT?</p>
		<h2 id="dmt-heading" class="mt-4 font-serif text-4xl font-semibold text-black sm:text-5xl">
			Danse- og bevægelsesterapi (DMT)
		</h2>
		<p class="mt-6 text-lg leading-relaxed text-black/80">
			Danse- og bevægelsesterapi &mdash; på engelsk Dance Movement Therapy (DMT) &mdash; er en
			anerkendt terapiform, der bruger bevægelse og dans som redskab til at styrke den
			følelsesmæssige, kognitive, fysiske og sociale integration af den enkelte. Tilgangen bygger
			på, at krop og sind hænger uløseligt sammen, og at bevægelse derfor kan give adgang til
			følelser og oplevelser, som ord ikke altid kan rumme.
		</p>
		<p class="mt-4 text-lg leading-relaxed text-black/80">
			I DMT er der ikke fokus på at danse &quot;rigtigt&quot; eller se ud på en bestemt måde. I
			stedet er bevægelsen et sprog, hvor du gennem kropslig tilstedeværelse kan mærke efter,
			bearbejde og udtrykke det, der fylder &mdash; i dit eget tempo og på din egen måde.
		</p>
	</div>

	<div class="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3" use:reveal={{ delay: 150 }}>
		<div class="rounded-2xl bg-black/5 p-6 text-center">
			<p class="font-serif text-xl font-semibold text-black">Krop &amp; sind</p>
			<p class="mt-2 text-sm text-black/70">
				Bevægelse bruges til at skabe forbindelse mellem krop, følelser og tanker.
			</p>
		</div>
		<div class="rounded-2xl bg-black/5 p-6 text-center">
			<p class="font-serif text-xl font-semibold text-black">Bevægelse som sprog</p>
			<p class="mt-2 text-sm text-black/70">
				Der stilles ingen krav om danseerfaring &mdash; bevægelsen er dit personlige udtryk.
			</p>
		</div>
		<div class="rounded-2xl bg-black/5 p-6 text-center">
			<p class="font-serif text-xl font-semibold text-black">Terapeutisk relation</p>
			<p class="mt-2 text-sm text-black/70">
				Trygheden i rummet og relationen til terapeuten er grundlaget for processen.
			</p>
		</div>
	</div>
</section>
