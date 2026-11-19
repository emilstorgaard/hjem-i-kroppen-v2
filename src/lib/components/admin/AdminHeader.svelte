<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		intro?: string;
		back?: { href: string; label: string };
		actions?: Snippet;
	};
	let { title, intro, back, actions }: Props = $props();
</script>

<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
	<div>
		{#if back}
			<a
				href={back.href}
				class="text-sm font-medium text-mint-700 underline-offset-4 hover:underline"
				>← {back.label}</a
			>
		{/if}
		<h1 class="mt-1 font-serif text-3xl font-semibold text-black sm:text-4xl">{title}</h1>
		{#if intro}<p class="mt-2 max-w-2xl text-sm leading-relaxed text-black/65">{intro}</p>{/if}
	</div>
	{#if actions}<div class="flex flex-wrap gap-2">{@render actions()}</div>{/if}
</div>
