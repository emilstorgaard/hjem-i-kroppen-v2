<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { dismissToast, toasts } from '$lib/booking/toast.svelte';

	const tones = {
		success: 'bg-mint-700 text-white',
		error: 'bg-rust-700 text-white',
		info: 'bg-black text-white'
	};
</script>

<div
	class="pointer-events-none fixed inset-x-4 bottom-4 z-[200] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
	aria-live="polite"
	role="status"
>
	{#each toasts as t (t.id)}
		<div
			transition:fly={{
				y: prefersReducedMotion.current ? 0 : 16,
				duration: prefersReducedMotion.current ? 0 : 220
			}}
			class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium shadow-lg shadow-black/15 {tones[
				t.tone
			]}"
		>
			<p class="flex-1 leading-relaxed">{t.message}</p>
			<button
				type="button"
				class="-mr-1 rounded-full p-1 text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
				aria-label="Luk besked"
				onclick={() => dismissToast(t.id)}
			>
				<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"
					><path
						d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
					/></svg
				>
			</button>
		</div>
	{/each}
</div>
