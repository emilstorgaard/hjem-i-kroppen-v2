<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		tone?: 'error' | 'success' | 'info';
		message?: string;
		children?: Snippet;
		class?: string;
	};
	let { tone = 'error', message, children, class: className = '' }: Props = $props();

	const tones = {
		error: 'bg-rust-100/70 text-rust-700 ring-rust-700/20',
		success: 'bg-mint-200/70 text-mint-700 ring-mint-700/20',
		info: 'bg-mint-600/60 text-black/70 ring-black/10'
	};
</script>

<div
	class="rounded-2xl px-4 py-3 text-sm leading-relaxed ring-1 {tones[tone]} {className}"
	role={tone === 'error' ? 'alert' : 'status'}
>
	{#if message}{message}{/if}
	{#if children}{@render children()}{/if}
</div>
