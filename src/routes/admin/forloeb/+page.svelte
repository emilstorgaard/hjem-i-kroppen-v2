<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import SeriesCreateForm from '$lib/components/admin/SeriesCreateForm.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import Modal from '$lib/components/booking/Modal.svelte';
	import Pagination from '$lib/components/booking/Pagination.svelte';
	import { resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import { formatDate } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const createResult = $derived(resultFor(form, 'create'));
	const createOpen = $derived(
		page.url.searchParams.get('ny') === '1' || (!!createResult && !createResult.success)
	);
	const closeCreateHref = $derived(withParams(page.url, { ny: null }));
	const statuses = [
		{ value: 'kommende', label: 'Kommende' },
		{ value: 'afsluttede', label: 'Afsluttede' },
		{ value: 'aflyste', label: 'Aflyste' },
		{ value: 'alle', label: 'Alle' }
	];
</script>

<SeoHead
	seo={{ metaTitle: 'Forløb | Admin | Hjem i Kroppen', metaDescription: 'Administrer forløb.' }}
	noindex
/>

<AdminHeader title="Forløb" intro="Forløb, hvor deltagerne booker alle tider på én gang.">
	{#snippet actions()}
		<Button href={withParams(page.url, { ny: '1' })} size="sm">Opret forløb</Button>
	{/snippet}
</AdminHeader>

<form method="GET" class="flex flex-wrap items-end gap-3" data-sveltekit-keepfocus role="search">
	<div class="flex flex-col gap-1">
		<label for="q" class="text-xs font-medium text-black/60">Søg</label>
		<input
			id="q"
			name="q"
			value={data.filters.q}
			class="field-input w-56 py-2"
			placeholder="Titel eller ydelse"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="ydelse" class="text-xs font-medium text-black/60">Ydelse</label>
		<select id="ydelse" name="ydelse" class="field-input w-48 py-2">
			<option value="">Alle</option>
			{#each data.serviceTypes as t (t.id)}<option
					value={t.id}
					selected={data.filters.ydelse === t.id}>{t.name}</option
				>{/each}
		</select>
	</div>
	<div class="flex flex-col gap-1">
		<label for="status" class="text-xs font-medium text-black/60">Status</label>
		<select id="status" name="status" class="field-input w-40 py-2">
			{#each statuses as s (s.value)}<option
					value={s.value}
					selected={data.filters.status === s.value}>{s.label}</option
				>{/each}
		</select>
	</div>
	<Button type="submit" variant="secondary" size="sm">Filtrer</Button>
</form>

{#if data.loadError}<Alert class="mt-6" message={data.loadError} />{/if}

<div class="mt-6">
	<DataTable
		caption="Forløb"
		columns={[
			{ label: 'Titel' },
			{ label: 'Periode' },
			{ label: 'Tider' },
			{ label: 'Deltagere' },
			{ label: 'Status' }
		]}
		rows={data.series.items}
		key={(s) => s.id}
		empty="Ingen forløb matcher filtrene."
	>
		{#snippet row(s)}
			<td class="px-4 py-3">
				<a href="/admin/forloeb/{s.id}" class="font-semibold hover:text-mint-700">{s.title}</a>
				<span class="block text-xs text-black/55">{s.serviceTypeName}</span>
			</td>
			<td class="px-4 py-3 whitespace-nowrap text-black/70">
				{s.firstStartsAt ? formatDate(s.firstStartsAt) : '–'}{s.lastEndsAt
					? ` – ${formatDate(s.lastEndsAt)}`
					: ''}
			</td>
			<td class="px-4 py-3 tabular-nums">{s.sessionCount}</td>
			<td class="px-4 py-3 tabular-nums">{s.participantCount}</td>
			<td class="px-4 py-3"
				>{#if s.isCancelled}<Badge tone="muted">Aflyst</Badge>{:else}<Badge tone="mint"
						>Aktivt</Badge
					>{/if}</td
			>
		{/snippet}
	</DataTable>
	<div class="mt-4">
		<Pagination
			page={data.series.page}
			totalPages={data.series.totalPages}
			href={(p) => withParams(page.url, { side: p === 1 ? null : p })}
		/>
	</div>
</div>

<Modal
	open={createOpen}
	title="Opret forløb"
	onclose={() => goto(closeCreateHref, { noScroll: true, keepFocus: true })}
	closeHref={closeCreateHref}
	size="xl"
>
	{#if data.serviceTypes.length === 0}
		<Alert tone="info"
			>Der er ingen ydelser endnu. <a href="/admin/ydelser?ny=1" class="font-semibold underline"
				>Opret en ydelse</a
			> først.</Alert
		>
	{:else}
		<SeriesCreateForm serviceTypes={data.serviceTypes} result={createResult} />
	{/if}
</Modal>
