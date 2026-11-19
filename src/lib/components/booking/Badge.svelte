<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'mint' | 'rust' | 'neutral' | 'dark' | 'muted';
	let {
		tone = 'neutral',
		class: className = '',
		children
	}: { tone?: Tone; class?: string; children: Snippet } = $props();

	const tones: Record<Tone, string> = {
		mint: 'bg-mint-200 text-mint-700',
		rust: 'bg-rust-100 text-rust-700',
		neutral: 'bg-mint-600 text-black/70',
		dark: 'bg-black text-white',
		muted: 'bg-black/5 text-black/50'
	};
</script>

<span
	class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium {tones[
		tone
	]} {className}"
>
	{@render children()}
</span>
