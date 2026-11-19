<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'children'> & {
		label: string;
		name: string;
		error?: string;
		hint?: string;
		/** Custom control (select, textarea …). Receives the ids to wire up for accessibility. */
		control?: Snippet<[{ id: string; describedBy: string | undefined; invalid: boolean }]>;
		class?: string;
	};

	let {
		label,
		name,
		error,
		hint,
		control,
		id,
		class: className = '',
		value = $bindable(),
		...rest
	}: Props = $props();

	const fieldId = $derived(id ?? `field-${name}`);
	const hintId = $derived(hint ? `${fieldId}-hint` : undefined);
	const errorId = $derived(error ? `${fieldId}-error` : undefined);
	const describedBy = $derived([errorId, hintId].filter(Boolean).join(' ') || undefined);
</script>

<div class="flex flex-col gap-1.5 {className}">
	<label for={fieldId} class="text-sm font-medium text-black/80">
		{label}
		{#if rest.required}<span class="text-rust-700" aria-hidden="true">*</span>{/if}
	</label>
	{#if control}
		{@render control({ id: fieldId, describedBy, invalid: !!error })}
	{:else}
		<input
			id={fieldId}
			{name}
			bind:value
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={describedBy}
			class="field-input {error ? 'field-input-error' : ''}"
			{...rest}
		/>
	{/if}
	{#if hint && !error}<p id={hintId} class="text-xs text-black/55">{hint}</p>{/if}
	{#if error}<p id={errorId} class="text-xs font-medium text-rust-700">{error}</p>{/if}
</div>
