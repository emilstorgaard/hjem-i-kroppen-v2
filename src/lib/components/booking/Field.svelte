<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Label + error wrapper for selects, textareas and other custom controls. */
	type Props = {
		label: string;
		for: string;
		error?: string;
		hint?: string;
		required?: boolean;
		class?: string;
		children: Snippet;
	};
	let {
		label,
		for: htmlFor,
		error,
		hint,
		required = false,
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
	<label for={htmlFor} class="text-sm font-medium text-black/80">
		{label}
		{#if required}<span class="text-rust-700" aria-hidden="true">*</span>{/if}
	</label>
	{@render children()}
	{#if hint && !error}<p class="text-xs text-black/55">{hint}</p>{/if}
	{#if error}<p class="text-xs font-medium text-rust-700">{error}</p>{/if}
</div>
