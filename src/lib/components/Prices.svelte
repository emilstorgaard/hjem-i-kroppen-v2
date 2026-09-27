<script lang="ts">
	import { priceItems } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="priser" aria-labelledby="priser-heading" class="bg-sand-50 px-6 py-24 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-sand-600 uppercase">Priser</p>
			<h2
				class="mt-4 font-serif text-4xl font-semibold text-sand-900 sm:text-5xl"
				id="priser-heading"
			>
				Investér i dig selv
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-sand-700">
				Herunder finder du et overblik over mine priser. Er du i tvivl om, hvad der passer bedst til
				dig, er du altid velkommen til at kontakte mig for en uforpligtende snak.
			</p>
		</div>

		<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each priceItems as item, i}
				<div
					use:reveal={{ delay: i * 120 }}
					class={[
						'flex flex-col rounded-3xl p-8 ring-1 transition-all duration-300 hover:-translate-y-1.5',
						item.featured
							? 'bg-sand-800 text-sand-50 shadow-lg shadow-sand-900/20 ring-sand-800 hover:shadow-xl hover:shadow-sand-900/30'
							: 'bg-sand-100 text-sand-900 ring-sand-200 hover:shadow-xl hover:shadow-sand-900/10 hover:ring-sand-300'
					]}
				>
					<h3 class="font-serif text-xl font-semibold">{item.title}</h3>
					<p class="mt-4 flex items-baseline gap-1">
						<span class="font-serif text-4xl font-semibold">{item.price}</span>
						<span class={item.featured ? 'text-sand-200' : 'text-sand-600'}>{item.unit}</span>
					</p>
					<p
						class={[
							'mt-4 flex-1 text-sm leading-relaxed',
							item.featured ? 'text-sand-100' : 'text-sand-700'
						]}
					>
						{item.description}
					</p>
					<a
						href="#kontakt"
						class={[
							'mt-6 rounded-full px-5 py-2.5 text-center text-sm font-medium transition-all duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
							item.featured
								? 'bg-sand-50 text-sand-900 hover:bg-sand-200 focus-visible:outline-sand-200'
								: 'bg-sand-800 text-sand-50 hover:bg-sand-900 focus-visible:outline-sand-600'
						]}
					>
						Book nu
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
