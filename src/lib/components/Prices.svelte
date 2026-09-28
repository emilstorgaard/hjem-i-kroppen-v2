<script lang="ts">
	import { priceItems } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section
	id="priser"
	aria-labelledby="priser-heading"
	class="bg-white px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Priser</p>
			<h2 class="mt-4 font-serif text-4xl font-semibold text-black sm:text-5xl" id="priser-heading">
				Investér i dig selv
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-black/70">
				Herunder finder du et overblik over mine priser. Er du i tvivl om, hvad der passer bedst til
				dig, er du altid velkommen til at kontakte mig for en uforpligtende snak.
			</p>
		</div>

		<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each priceItems as item, i (item.title)}
				<div
					use:reveal={{ delay: i * 120 }}
					class={[
						'flex flex-col rounded-3xl p-8 ring-1 transition-all duration-300 hover:-translate-y-1.5',
						item.featured
							? 'bg-black text-white shadow-lg shadow-black/20 ring-black hover:shadow-xl hover:shadow-black/30'
							: 'bg-mint-600/40 text-black ring-black/10 hover:shadow-xl hover:shadow-black/10 hover:ring-black/20'
					]}
				>
					<h3 class="font-serif text-xl font-semibold">{item.title}</h3>
					<p class="mt-4 flex items-baseline gap-1">
						<span class="font-serif text-4xl font-semibold">{item.price}</span>
						<span class={item.featured ? 'text-white/70' : 'text-black/60'}>{item.unit}</span>
					</p>
					<p
						class={[
							'mt-4 flex-1 text-sm leading-relaxed',
							item.featured ? 'text-white/80' : 'text-black/70'
						]}
					>
						{item.description}
					</p>
					<a
						href="#kontakt"
						class={[
							'mt-6 rounded-full px-5 py-2.5 text-center text-sm font-medium transition-all duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
							item.featured
								? 'bg-white text-black hover:bg-mint-400 focus-visible:outline-mint-400'
								: 'bg-black text-white hover:bg-mint-700 focus-visible:outline-mint-700'
						]}
					>
						Book nu
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
