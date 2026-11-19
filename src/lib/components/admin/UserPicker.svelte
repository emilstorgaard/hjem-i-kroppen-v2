<script lang="ts">
	import { enhance } from '$app/forms';
	import { feedback } from '$lib/booking/enhance';
	import type { FormResult } from '$lib/booking/forms';
	import type { AdminUserResponse } from '$lib/types/booking';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Button from '$lib/components/booking/Button.svelte';

	/**
	 * Search users (GET `?bruger=`) and post the chosen user to a form action.
	 * The search is a plain GET form, so it works without JS and keeps the other query parameters.
	 */
	type Props = {
		query: string;
		results: AdminUserResponse[] | null;
		action: string;
		/** Extra hidden fields for the action, e.g. the session id. */
		fields?: Record<string, string>;
		/** Current query parameters to keep when searching. */
		keep?: Record<string, string>;
		submitLabel: string;
		withNote?: boolean;
		result?: FormResult;
		param?: string;
	};

	let {
		query,
		results,
		action,
		fields = {},
		keep = {},
		submitLabel,
		withNote = true,
		result,
		param = 'bruger'
	}: Props = $props();
	let pendingId = $state<string | null>(null);
</script>

<div class="flex flex-col gap-4">
	<form
		method="GET"
		class="flex gap-2"
		data-sveltekit-keepfocus
		data-sveltekit-noscroll
		role="search"
	>
		{#each Object.entries(keep) as [name, value] (name)}
			{#if name !== param}<input type="hidden" {name} {value} />{/if}
		{/each}
		<label class="sr-only" for="user-search">Søg efter bruger</label>
		<input
			id="user-search"
			name={param}
			value={query}
			class="field-input"
			placeholder="Søg på navn eller e-mail"
			minlength="2"
		/>
		<Button type="submit" variant="secondary">Søg</Button>
	</form>

	{#if result?.message && !result.success}<Alert message={result.message} />{/if}

	{#if results}
		{#if results.length === 0}
			<p class="text-sm text-black/55">Ingen aktive brugere matcher "{query}".</p>
		{:else}
			<ul class="divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/10">
				{#each results as user (user.id)}
					<li>
						<form
							method="POST"
							{action}
							class="flex flex-col gap-2 p-3 sm:flex-row sm:items-center"
							use:enhance={feedback({ pending: (v) => (pendingId = v ? user.id : null) })}
						>
							<input type="hidden" name="userId" value={user.id} />
							{#each Object.entries(fields) as [name, value] (name)}<input
									type="hidden"
									{name}
									{value}
								/>{/each}
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-semibold">{user.fullName}</p>
								<p class="truncate text-xs text-black/55">{user.email}</p>
							</div>
							{#if withNote}
								<label class="sr-only" for="note-{user.id}">Note til {user.fullName}</label>
								<input
									id="note-{user.id}"
									name="note"
									maxlength="1000"
									class="field-input sm:max-w-48"
									placeholder="Note (valgfri)"
								/>
							{/if}
							<Button type="submit" size="sm" loading={pendingId === user.id}>{submitLabel}</Button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>
