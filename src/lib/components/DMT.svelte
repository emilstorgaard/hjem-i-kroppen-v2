<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { getLabels } from '$lib/labels';
	import type { DmtProperties } from '$lib/types/dmt';

	let { dmt }: { dmt: DmtProperties } = $props();

	const labels = $derived(getLabels());
</script>

<section
	id="dmt"
	aria-labelledby={dmt.heading ? 'dmt-heading' : undefined}
	aria-label={dmt.heading ? undefined : labels.dmtLabel}
	class="bg-mint-600 px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-4xl text-center" use:reveal>
		<p class="text-sm font-medium tracking-[0.3em] text-black/70 uppercase">{labels.dmtLabel}</p>
		{#if dmt.heading}
			<h2 id="dmt-heading" class="mt-4 font-serif text-4xl font-semibold text-black sm:text-5xl">
				{dmt.heading}
			</h2>
		{/if}
		{#each dmt.paragraphs as paragraph, i (i)}
			<p class={['text-lg leading-relaxed text-black/80', i === 0 ? 'mt-6' : 'mt-4']}>
				{paragraph}
			</p>
		{/each}
	</div>

	{#if dmt.points.length > 0}
		<div class="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3" use:reveal={{ delay: 150 }}>
			{#each dmt.points as point, i (i)}
				<div class="rounded-2xl bg-black/5 p-6 text-center">
					<p class="font-serif text-xl font-semibold text-black">{point.title}</p>
					{#if point.text}
						<p class="mt-2 text-sm text-black/70">{point.text}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
