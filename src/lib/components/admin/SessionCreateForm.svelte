<script lang="ts">
	import { enhance } from '$app/forms';
	import { feedback } from '$lib/booking/enhance';
	import { CATEGORY_LABEL } from '$lib/booking/categories';
	import { fieldError, type FormResult } from '$lib/booking/forms';
	import { addDays, formatDateTime, zonedDateTimeToIso } from '$lib/utils/date';
	import type { AdminSeriesListItemResponse, AdminServiceTypeResponse } from '$lib/types/booking';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import Field from '$lib/components/booking/Field.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';

	type Props = {
		serviceTypes: AdminServiceTypeResponse[];
		series: AdminSeriesListItemResponse[];
		result?: FormResult;
		onSuccess?: () => void;
	};

	let { serviceTypes, series, result, onSuccess }: Props = $props();

	const v = $derived(result?.values ?? {});
	let serviceTypeId = $state('');
	let duration = $state('');
	let capacity = $state('');
	let startsAt = $state('');
	let repeatEvery = $state('');
	let repeatCount = $state('4');
	let pending = $state(false);

	// Refill after a failed submit.
	$effect.pre(() => {
		if (!result?.values) return;
		serviceTypeId = v.serviceTypeId ?? '';
		duration = v.durationMinutes ?? '';
		capacity = v.capacity ?? '';
		startsAt = v.startsAt ?? '';
		repeatEvery = v.repeatEvery ?? '';
		repeatCount = v.repeatCount || '4';
	});

	const activeTypes = $derived(serviceTypes.filter((t) => t.isActive));
	const selectedType = $derived(serviceTypes.find((t) => t.id === serviceTypeId));
	const seriesForType = $derived(series.filter((s) => s.serviceTypeId === serviceTypeId));

	/** Prefill duration and capacity from the service type's defaults. */
	function onTypeChange() {
		if (!selectedType) return;
		duration = String(selectedType.defaultDurationMinutes);
		capacity = String(selectedType.defaultCapacity);
	}

	const preview = $derived.by(() => {
		const step = Number(repeatEvery);
		const [date, time = ''] = startsAt.split('T');
		if (!step || !date || !time) return [];
		const count = Math.min(52, Math.max(1, Number(repeatCount) || 1));
		return Array.from({ length: count }, (_, i) =>
			zonedDateTimeToIso(addDays(date, i * step), time.slice(0, 5))
		).filter((x): x is string => !!x);
	});
</script>

<form
	method="POST"
	action="?/create"
	class="flex flex-col gap-4"
	use:enhance={feedback({ pending: (p) => (pending = p), onSuccess })}
>
	{#if result?.message && !result.success}<Alert message={result.message} />{/if}

	<Field label="Ydelse" for="create-type" required error={fieldError(result, 'serviceTypeId')}>
		<select
			id="create-type"
			name="serviceTypeId"
			class="field-input"
			required
			bind:value={serviceTypeId}
			onchange={onTypeChange}
			data-autofocus
		>
			<option value="" disabled>Vælg ydelse</option>
			{#each activeTypes as t (t.id)}
				<option value={t.id}>{t.name} ({CATEGORY_LABEL[t.category]})</option>
			{/each}
		</select>
	</Field>

	<div class="grid gap-4 sm:grid-cols-3">
		<FormField
			label="Start"
			name="startsAt"
			id="create-start"
			type="datetime-local"
			required
			bind:value={startsAt}
			error={fieldError(result, 'startsAt')}
			class="sm:col-span-3"
			hint="Dansk tid"
		/>
		<FormField
			label="Varighed (min.)"
			name="durationMinutes"
			id="create-duration"
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
			id="create-capacity"
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
			id="create-location"
			maxlength={200}
			value={v.location ?? ''}
			error={fieldError(result, 'location')}
		/>
	</div>

	{#if seriesForType.length > 0}
		<Field label="Forløb (valgfrit)" for="create-series" error={fieldError(result, 'seriesId')}>
			<select id="create-series" name="seriesId" class="field-input">
				<option value="">Ikke en del af et forløb</option>
				{#each seriesForType as s (s.id)}
					<option value={s.id} selected={v.seriesId === s.id}>{s.title}</option>
				{/each}
			</select>
		</Field>
	{/if}

	<Field label="Noter (vises for brugerne)" for="create-notes" error={fieldError(result, 'notes')}>
		<textarea
			id="create-notes"
			name="notes"
			rows="2"
			maxlength="2000"
			class="field-input"
			value={v.notes ?? ''}></textarea>
	</Field>

	<fieldset class="rounded-2xl bg-mint-600/40 p-4">
		<legend class="px-1 text-sm font-semibold">Opret flere</legend>
		<div class="grid gap-4 sm:grid-cols-2">
			<Field label="Gentag" for="create-repeat">
				<select id="create-repeat" name="repeatEvery" class="field-input" bind:value={repeatEvery}>
					<option value="">Ingen gentagelse</option>
					<option value="1">Hver dag</option>
					<option value="7">Hver uge</option>
					<option value="14">Hver 2. uge</option>
				</select>
			</Field>
			<FormField
				label="Antal tider i alt"
				name="repeatCount"
				id="create-count"
				type="number"
				min={1}
				max={52}
				bind:value={repeatCount}
			/>
		</div>
		{#if preview.length > 1}
			<p class="mt-3 text-xs font-medium text-black/60">Der oprettes {preview.length} tider:</p>
			<ul class="mt-1 grid gap-x-4 text-xs text-black/70 sm:grid-cols-2">
				{#each preview as iso (iso)}<li class="tabular-nums">{formatDateTime(iso)}</li>{/each}
			</ul>
		{/if}
	</fieldset>

	<div class="flex justify-end">
		<Button type="submit" loading={pending}
			>{preview.length > 1 ? `Opret ${preview.length} tider` : 'Opret tid'}</Button
		>
	</div>
</form>
