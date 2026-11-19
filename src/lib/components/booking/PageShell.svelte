<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		eyebrow?: string;
		title: string;
		intro?: string;
		width?: 'sm' | 'md' | 'lg' | 'xl';
		/** Soft mint glows behind the content, like the error page. */
		decorated?: boolean;
		actions?: Snippet;
		children: Snippet;
	};

	let {
		eyebrow,
		title,
		intro,
		width = 'lg',
		decorated = false,
		actions,
		children
	}: Props = $props();

	const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-5xl', xl: 'max-w-7xl' };
</script>

<section
	class="relative overflow-hidden bg-white px-6 pt-10 pb-20 lg:px-8 lg:pt-[calc(var(--header-h,4.5rem)+3.5rem)] lg:pb-28"
>
	{#if decorated}
		<div
			class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-mint-600/60 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute top-1/3 -right-32 h-112 w-md rounded-full bg-mint-400/25 blur-3xl"
			aria-hidden="true"
		></div>
	{/if}
	<div class="relative mx-auto {widths[width]}">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class={width === 'sm' ? 'text-center sm:w-full' : ''}>
				{#if eyebrow}
					<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">{eyebrow}</p>
				{/if}
				<h1 class="mt-3 font-serif text-3xl font-semibold text-black sm:text-4xl lg:text-5xl">
					{title}
				</h1>
				{#if intro}<p class="mt-4 max-w-2xl leading-relaxed text-black/70 lg:text-lg">
						{intro}
					</p>{/if}
			</div>
			{#if actions}<div class="flex shrink-0 flex-wrap gap-3">{@render actions()}</div>{/if}
		</div>
		<div class="mt-8 lg:mt-12">
			{@render children()}
		</div>
	</div>
</section>
