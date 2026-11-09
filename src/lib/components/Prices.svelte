<script lang="ts">
	import SplitSection from '$lib/components/SplitSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import type { PricesPageProperties } from '$lib/types/pricesPage';

	let { prices }: { prices: PricesPageProperties } = $props();

	const items = $derived(prices.priceItems?.items ?? []);
</script>

<SplitSection image={prices.image?.[0]} imageAlt={prices.heading}>
	<div class="flex flex-col justify-center max-md:px-6 max-md:pt-8">
		<h1 class="sr-only">{prices.heading}</h1>

		<ul class="flex flex-col gap-4 lg:gap-6">
			{#each items as block, i (block.content.id)}
				{@const item = block.content.properties}
				<li
					use:reveal={{ delay: i * 120 }}
					class="flex items-center justify-between gap-6 rounded-3xl bg-mint-600/40 p-8 text-black ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:ring-black/20 lg:p-10"
				>
					<div>
						<h2 class="font-serif text-xl font-semibold lg:text-2xl">{item.title}</h2>
						<p class="mt-2 text-sm font-medium tracking-[0.2em] text-mint-700 uppercase">
							{item.duration}
						</p>
					</div>
					<p class="flex shrink-0 items-baseline gap-1 text-right">
						<span class="font-serif text-4xl font-semibold lg:text-5xl">{item.price}</span>
						<span class="text-black/60">{item.unit}</span>
					</p>
				</li>
			{/each}
		</ul>
	</div>
</SplitSection>
