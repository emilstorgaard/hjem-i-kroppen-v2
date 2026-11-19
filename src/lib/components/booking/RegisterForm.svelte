<script lang="ts">
	import { enhance } from '$app/forms';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, type FormResult } from '$lib/booking/forms';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';
	import FormField from './FormField.svelte';

	type Props = {
		redirectTo?: string;
		result?: FormResult;
		loginHref?: string;
		onLogin?: () => void;
	};

	let { redirectTo = '', result, loginHref, onLogin }: Props = $props();
	let pending = $state(false);
</script>

<form
	method="POST"
	action="/opret-bruger"
	class="flex flex-col gap-4"
	use:enhance={feedback({ pending: (v) => (pending = v), resetOnSuccess: false })}
>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	{#if result?.message}<Alert message={result.message} />{/if}
	<FormField
		label="Fulde navn"
		name="fullName"
		id="register-name"
		autocomplete="name"
		required
		maxlength={200}
		value={result?.values?.fullName ?? ''}
		error={fieldError(result, 'fullName')}
		data-autofocus
	/>
	<FormField
		label="E-mail"
		name="email"
		id="register-email"
		type="email"
		autocomplete="email"
		required
		maxlength={256}
		value={result?.values?.email ?? ''}
		error={fieldError(result, 'email')}
	/>
	<FormField
		label="Adgangskode"
		name="password"
		id="register-password"
		type="password"
		autocomplete="new-password"
		required
		minlength={8}
		hint="Mindst 8 tegn."
		error={fieldError(result, 'password')}
	/>
	<FormField
		label="Gentag adgangskode"
		name="passwordRepeat"
		id="register-password-repeat"
		type="password"
		autocomplete="new-password"
		required
		error={fieldError(result, 'passwordRepeat')}
	/>
	<Button type="submit" size="lg" full loading={pending}>Opret bruger</Button>
	{#if loginHref}
		<p class="text-center text-sm text-black/65">
			Har du allerede en bruger?
			<a
				href={loginHref}
				onclick={(e) => {
					if (onLogin) {
						e.preventDefault();
						onLogin();
					}
				}}
				class="font-semibold text-mint-700 underline-offset-4 hover:underline">Log ind</a
			>
		</p>
	{/if}
</form>
