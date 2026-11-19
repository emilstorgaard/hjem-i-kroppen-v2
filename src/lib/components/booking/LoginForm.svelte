<script lang="ts">
	import { enhance } from '$app/forms';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, type FormResult } from '$lib/booking/forms';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';
	import FormField from './FormField.svelte';

	type Props = {
		/** Where to continue after signing in (a same-site path). */
		redirectTo?: string;
		result?: FormResult;
		/** Link target for "Opret bruger"; omit to hide the link. */
		registerHref?: string;
		onRegister?: () => void;
	};

	let { redirectTo = '', result, registerHref, onRegister }: Props = $props();
	let pending = $state(false);
</script>

<form
	method="POST"
	action="/login"
	class="flex flex-col gap-4"
	use:enhance={feedback({ pending: (v) => (pending = v), resetOnSuccess: false })}
>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	{#if result?.message}<Alert message={result.message} />{/if}
	<FormField
		label="E-mail"
		name="email"
		id="login-email"
		type="email"
		autocomplete="email"
		required
		value={result?.values?.email ?? ''}
		error={fieldError(result, 'email')}
		data-autofocus
	/>
	<FormField
		label="Adgangskode"
		name="password"
		id="login-password"
		type="password"
		autocomplete="current-password"
		required
		error={fieldError(result, 'password')}
	/>
	<Button type="submit" size="lg" full loading={pending}>Log ind</Button>
	{#if registerHref}
		<p class="text-center text-sm text-black/65">
			Ny her?
			<a
				href={registerHref}
				onclick={(e) => {
					if (onRegister) {
						e.preventDefault();
						onRegister();
					}
				}}
				class="font-semibold text-mint-700 underline-offset-4 hover:underline">Opret en bruger</a
			>
		</p>
	{/if}
</form>
