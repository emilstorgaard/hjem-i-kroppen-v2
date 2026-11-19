<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Spinner from './Spinner.svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
	type Size = 'sm' | 'md' | 'lg';

	type Props = HTMLButtonAttributes & {
		variant?: Variant;
		size?: Size;
		/** Renders a link styled as a button. */
		href?: string;
		loading?: boolean;
		full?: boolean;
		class?: string;
		children: Snippet;
	};

	let {
		variant = 'primary',
		size = 'md',
		href,
		loading = false,
		full = false,
		type = 'button',
		disabled,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		primary: 'bg-mint-700 text-white shadow-sm hover:bg-black',
		dark: 'bg-black text-white shadow-sm hover:bg-mint-700',
		secondary: 'bg-white text-black ring-1 ring-black/15 hover:ring-mint-700 hover:text-mint-700',
		ghost: 'text-black/70 hover:bg-black/5 hover:text-black',
		danger: 'bg-rust-700 text-white shadow-sm hover:bg-black'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-4 py-2 text-xs font-semibold tracking-wide',
		md: 'px-6 py-2.5 text-sm font-semibold tracking-wide',
		lg: 'px-8 py-3 text-sm font-semibold tracking-[0.2em] uppercase'
	};

	const classes = $derived(
		[
			'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:scale-95',
			variants[variant],
			sizes[size],
			full ? 'w-full' : '',
			className
		].join(' ')
	);
</script>

{#if href && !disabled}
	<a {href} class={classes}>{@render children()}</a>
{:else}
	<button
		{type}
		class={classes}
		disabled={disabled || loading}
		aria-busy={loading || undefined}
		{...rest}
	>
		{#if loading}<Spinner class="h-4 w-4" />{/if}
		{@render children()}
	</button>
{/if}
