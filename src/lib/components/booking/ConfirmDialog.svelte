<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { feedback } from '$lib/booking/enhance';
	import type { FormResult } from '$lib/booking/forms';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';

	/**
	 * A button that posts to a form action after confirmation. Without JS the form submits directly
	 * (the action itself is the safeguard); with JS a dialog asks first.
	 */
	type Props = {
		action: string;
		/** Hidden fields posted with the form. */
		fields?: Record<string, string>;
		title: string;
		message: string;
		confirmLabel: string;
		label?: string;
		tone?: 'danger' | 'primary';
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		class?: string;
		onSuccess?: (result: FormResult) => void;
	};

	let {
		action,
		fields = {},
		title,
		message,
		confirmLabel,
		label,
		tone = 'danger',
		variant = 'secondary',
		size = 'sm',
		disabled = false,
		class: className = '',
		onSuccess
	}: Props = $props();

	let open = $state(false);
	let pending = $state(false);
	let confirmed = false;
	let error = $state<string | undefined>();
	let form: HTMLFormElement | undefined = $state();

	const submitWithFeedback = feedback({
		pending: (v) => (pending = v),
		onSuccess: (r) => {
			open = false;
			onSuccess?.(r);
		},
		onFailure: (r) => (error = r.message)
	});

	// The first submit only opens the dialog; "confirm" submits again for real. (`enhance` ignores preventDefault, so cancel() it.)
	const submit: SubmitFunction = (input) => {
		if (!confirmed) {
			input.cancel();
			error = undefined;
			open = true;
			return;
		}
		confirmed = false;
		return submitWithFeedback(input);
	};

	function confirm() {
		confirmed = true;
		form?.requestSubmit();
	}
</script>

<form method="POST" {action} bind:this={form} class="inline" use:enhance={submit}>
	{#each Object.entries(fields) as [name, value] (name)}
		<input type="hidden" {name} {value} />
	{/each}
	<Button type="submit" {variant} {size} {disabled} class={className}
		>{label ?? confirmLabel}</Button
	>
</form>

<Modal {open} {title} onclose={() => (open = false)}>
	<p class="leading-relaxed text-black/70">{message}</p>
	{#if error}<Alert class="mt-4" message={error} />{/if}
	<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
		<Button variant="ghost" onclick={() => (open = false)}>Fortryd</Button>
		<Button
			variant={tone === 'danger' ? 'danger' : 'primary'}
			loading={pending}
			onclick={confirm}
			data-autofocus
		>
			{confirmLabel}
		</Button>
	</div>
</Modal>
