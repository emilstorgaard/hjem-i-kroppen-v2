<script lang="ts">
	import { enhance } from '$app/forms';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, type FormResult } from '$lib/booking/forms';
	import { addDays, formatDateTime, fromLocalInput, zonedDateTimeToIso } from '$lib/utils/date';
	import type { AdminServiceTypeResponse } from '$lib/types/booking';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import Field from '$lib/components/booking/Field.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';

	type Props = { serviceTypes: AdminServiceTypeResponse[]; result?: FormResult };
	let { serviceTypes, result }: Props = $props();

	const v = $derived(result?.values ?? {});
	let serviceTypeId = $state('');
	let duration = $state('');
	let capacity = $state('');
	let genDate = $state('');
	let genTime = $state('17:00');
	let genEvery = $state('7');
	let genCount = $state('6');
	/** Explicit start times (datetime-local values). Empty means the server generates them from the fields above. */
	let times = $state<string[]>([]);
	let pending = $state(false);

	$effect.pre(() => {
		if (!result?.values) return;
		serviceTypeId = v.serviceTypeId ?? '';
		duration = v.durationMinutes ?? '';
		capacity = v.capacity ?? '';
		genDate = v.genDate ?? '';
		genTime = v.genTime || '17:00';
	});

	const activeTypes = $derived(serviceTypes.filter((t) => t.isActive));
	const selectedType = $derived(serviceTypes.find((t) => t.id === serviceTypeId));

	function onTypeChange() {
		if (!selectedType) return;
		duration = String(selectedType.defaultDurationMinutes);
		capacity = String(selectedType.defaultCapacity);
	}

	function generate() {
		const count = Math.min(52, Math.max(1, Number(genCount) || 1));
		const every = Number(genEvery) || 7;
		if (!genDate || !genTime) return;
		times = Array.from({ length: count }, (_, i) => `${addDays(genDate, i * every)}T${genTime}`);
	}

	function addRow() {
		const last = times.at(-1);
		const iso = last ? fromLocalInput(last) : null;
		times.push(
			iso && last
				? `${addDays(last.slice(0, 10), Number(genEvery) || 7)}T${last.slice(11, 16)}`
				: ''
		);
	}

	const startTimeErrors = $derived(
		Object.entries(result?.fieldErrors ?? {})
			.filter(([key]) => key.startsWith('startTimes'))
			.map(([key, messages]) => {
				const index = key.match(/\[(\d+)\]/)?.[1];
				return index === undefined ? messages[0] : `Tid ${Number(index) + 1}: ${messages[0]}`;
			})
	);
</script>

<form
	method="POST"
	action="?/create"
	class="flex flex-col gap-4"
	use:enhance={feedback({ pending: (p) => (pending = p) })}
>
	{#if result?.message && !result.success}<Alert message={result.message} />{/if}

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Ydelse" for="series-type" required error={fieldError(result, 'serviceTypeId')}>
			<select
				id="series-type"
				name="serviceTypeId"
				class="field-input"
				required
				bind:value={serviceTypeId}
				onchange={onTypeChange}
				data-autofocus
			>
				<option value="" disabled>Vælg ydelse</option>
				{#each activeTypes as t (t.id)}<option value={t.id}>{t.name}</option>{/each}
			</select>
		</Field>
		<FormField
			label="Titel"
			name="title"
			id="series-title"
			maxlength={200}
			value={v.title ?? ''}
			hint="Tom: ydelsens navn bruges"
			error={fieldError(result, 'title')}
		/>
		<FormField
			label="Varighed (min.)"
			name="durationMinutes"
			id="series-duration"
			type="number"
			min={15}
			max={720}
			bind:value={duration}
			placeholder={selectedType ? String(selectedType.defaultDurationMinutes) : 'Standard'}
			error={fieldError(result, 'durationMinutes')}
		/>
		<FormField
			label="Pladser"
			name="capacity"
			id="series-capacity"
			type="number"
			min={1}
			max={500}
			bind:value={capacity}
			placeholder={selectedType ? String(selectedType.defaultCapacity) : 'Standard'}
			error={fieldError(result, 'capacity')}
		/>
		<FormField
			label="Sted"
			name="location"
			id="series-location"
			maxlength={200}
			value={v.location ?? ''}
			error={fieldError(result, 'location')}
			class="sm:col-span-2"
		/>
	</div>
	<Field label="Noter (vises for brugerne)" for="series-notes" error={fieldError(result, 'notes')}>
		<textarea
			id="series-notes"
			name="notes"
			rows="2"
			maxlength="2000"
			class="field-input"
			value={v.notes ?? ''}></textarea>
	</Field>

	<fieldset class="rounded-2xl bg-mint-600/40 p-4">
		<legend class="px-1 text-sm font-semibold">Datoer og tider</legend>
		<div class="grid gap-3 sm:grid-cols-4">
			<FormField
				label="Første dato"
				name="genDate"
				id="gen-date"
				type="date"
				bind:value={genDate}
			/>
			<FormField label="Kl." name="genTime" id="gen-time" type="time" bind:value={genTime} />
			<Field label="Interval" for="gen-every">
				<select id="gen-every" name="genEvery" class="field-input" bind:value={genEvery}>
					<option value="7">Hver uge</option>
					<option value="14">Hver 2. uge</option>
					<option value="1">Hver dag</option>
				</select>
			</Field>
			<FormField
				label="Antal gange"
				name="genCount"
				id="gen-count"
				type="number"
				min={1}
				max={52}
				bind:value={genCount}
			/>
		</div>
		<div class="mt-3 flex flex-wrap gap-2">
			<Button size="sm" variant="secondary" onclick={generate} disabled={!genDate || !genTime}
				>Generér datoer</Button
			>
			<Button size="sm" variant="ghost" onclick={addRow}>+ Tilføj tid</Button>
		</div>
		<noscript
			><p class="mt-2 text-xs text-black/60">
				Uden JavaScript oprettes tiderne ud fra felterne ovenfor.
			</p></noscript
		>

		{#if times.length > 0}
			<ol class="mt-4 flex flex-col gap-2">
				{#each times, i (i)}
					{@const iso = fromLocalInput(times[i])}
					<li class="flex items-center gap-2">
						<span class="w-6 text-right text-xs text-black/50 tabular-nums">{i + 1}.</span>
						<label class="sr-only" for="start-{i}">Tid {i + 1}</label>
						<input
							id="start-{i}"
							type="datetime-local"
							name="startTimes"
							bind:value={times[i]}
							class="field-input py-2"
							required
						/>
						<span class="hidden w-40 text-xs text-black/55 sm:block"
							>{iso ? formatDateTime(iso) : ''}</span
						>
						<button
							type="button"
							class="rounded-full px-2 py-1 text-sm text-rust-700 hover:bg-rust-100"
							aria-label="Fjern tid {i + 1}"
							onclick={() => times.splice(i, 1)}>✕</button
						>
					</li>
				{/each}
			</ol>
		{:else if genDate && genTime}
			{@const first = zonedDateTimeToIso(genDate, genTime)}
			{#if first}<p class="mt-3 text-xs text-black/60">
					Første tid: {formatDateTime(first)}. Tryk "Generér datoer" for at se og rette alle.
				</p>{/if}
		{/if}
		{#each startTimeErrors as message (message)}<p class="mt-2 text-xs font-medium text-rust-700">
				{message}
			</p>{/each}
	</fieldset>

	<div class="flex justify-end">
		<Button type="submit" loading={pending}
			>Opret forløb{times.length > 0 ? ` (${times.length} tider)` : ''}</Button
		>
	</div>
</form>
