<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import Field from '$lib/components/booking/Field.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';
	import Modal from '$lib/components/booking/Modal.svelte';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const saveResult = $derived(resultFor(form, 'save'));
	const rowError = $derived(
		resultFor(form, 'row')?.success === false ? resultFor(form, 'row')?.message : undefined
	);
	const editId = $derived(page.url.searchParams.get('rediger'));
	const editing = $derived(editId ? data.serviceTypes.find((t) => t.id === editId) : undefined);
	const modalOpen = $derived(
		page.url.searchParams.get('ny') === '1' || !!editing || (!!saveResult && !saveResult.success)
	);
	const closeHref = $derived(withParams(page.url, { ny: null, rediger: null }));
	const v = $derived(saveResult?.values);

	// Follows the edited item / refilled values, but the select can change it.
	let categoryId = $derived<string>(
		v?.categoryId ?? editing?.category.id ?? data.categories[0]?.id ?? ''
	);
	let pending = $state(false);

	const close = () => goto(closeHref, { noScroll: true, keepFocus: true });
</script>

<SeoHead
	seo={{ metaTitle: 'Ydelser | Admin | Hjem i Kroppen', metaDescription: 'Administrer ydelser.' }}
	noindex
/>

<AdminHeader
	title="Ydelser"
	intro="Ydelserne bestemmer kategori, standardvarighed og antal pladser for nye tider."
>
	{#snippet actions()}
		<Button href="/admin/kategorier" size="sm" variant="ghost">Kategorier</Button>
		{#if data.categories.length > 0}
			<Button href={withParams(page.url, { ny: '1', rediger: null })} size="sm">Opret ydelse</Button
			>
		{/if}
	{/snippet}
</AdminHeader>

<div class="flex flex-wrap gap-2" role="group" aria-label="Filtre">
	<a
		href={withParams(page.url, { kategori: null })}
		class="chip chip-sm {!data.filters.kategori ? 'chip-active' : ''}">Alle kategorier</a
	>
	{#each data.categories as c (c.id)}
		<a
			href={withParams(page.url, { kategori: c.slug })}
			class="chip chip-sm {data.filters.kategori === c.slug ? 'chip-active' : ''}"
		>
			{c.name}
		</a>
	{/each}
	<span class="mx-1 w-px bg-black/10" aria-hidden="true"></span>
	<a
		href={withParams(page.url, { aktiv: data.filters.aktiv === 'ja' ? null : 'ja' })}
		class="chip chip-sm {data.filters.aktiv === 'ja' ? 'chip-active' : ''}">Kun aktive</a
	>
	<a
		href={withParams(page.url, { aktiv: data.filters.aktiv === 'nej' ? null : 'nej' })}
		class="chip chip-sm {data.filters.aktiv === 'nej' ? 'chip-active' : ''}">Kun inaktive</a
	>
</div>

{#if data.loadError}<Alert class="mt-6" message={data.loadError} />{/if}
{#if !data.loadError && data.categories.length === 0}
	<Alert
		class="mt-6"
		tone="info"
		message="Der er ingen kategorier endnu. Opret en kategori, før du opretter ydelser."
	/>
{/if}
{#if rowError}<Alert class="mt-6" message={rowError} />{/if}

<div class="mt-6">
	<DataTable
		caption="Ydelser"
		columns={[
			{ label: 'Navn' },
			{ label: 'Kategori' },
			{ label: 'Varighed' },
			{ label: 'Pladser' },
			{ label: 'Status' },
			{ label: 'Handlinger', srOnly: true }
		]}
		rows={data.serviceTypes}
		key={(t) => t.id}
		empty="Ingen ydelser endnu."
	>
		{#snippet row(t)}
			<td class="px-4 py-3">
				<span class="font-semibold">{t.name}</span>
				{#if t.description}<span class="block max-w-sm truncate text-xs text-black/55"
						>{t.description}</span
					>{/if}
			</td>
			<td class="px-4 py-3">{t.category.name}</td>
			<td class="px-4 py-3 tabular-nums">{t.defaultDurationMinutes} min.</td>
			<td class="px-4 py-3 tabular-nums">{t.defaultCapacity}</td>
			<td class="px-4 py-3"
				>{#if t.isActive}<Badge tone="mint">Aktiv</Badge>{:else}<Badge tone="muted">Inaktiv</Badge
					>{/if}</td
			>
			<td class="px-4 py-3">
				<div class="flex justify-end gap-1">
					<Button href={withParams(page.url, { rediger: t.id, ny: null })} size="sm" variant="ghost"
						>Rediger</Button
					>
					<form method="POST" action="?/toggle" use:enhance={feedback()}>
						<input type="hidden" name="id" value={t.id} />
						<input type="hidden" name="activate" value={t.isActive ? '0' : '1'} />
						<Button type="submit" size="sm" variant="ghost"
							>{t.isActive ? 'Deaktivér' : 'Aktivér'}</Button
						>
					</form>
					<ConfirmDialog
						action="?/delete"
						fields={{ id: t.id }}
						title="Slet ydelse?"
						message={`Ydelsen "${t.name}" slettes. Det er kun muligt, hvis ingen tider eller forløb bruger den – ellers kan du deaktivere den.`}
						confirmLabel="Slet"
						variant="ghost"
					/>
				</div>
			</td>
		{/snippet}
	</DataTable>
	{#if data.filters.aktiv}<p class="mt-2 text-xs text-black/50">
			Rækkefølgen kan kun ændres, når alle ydelser vises.
		</p>{/if}
</div>

<Modal
	open={modalOpen}
	title={editing ? 'Rediger ydelse' : 'Opret ydelse'}
	onclose={close}
	{closeHref}
	size="lg"
>
	<form
		method="POST"
		action={editing ? '?/update' : '?/create'}
		class="flex flex-col gap-4"
		use:enhance={feedback({ pending: (p) => (pending = p), onSuccess: close })}
	>
		{#if editing}<input type="hidden" name="id" value={editing.id} />{/if}
		{#if saveResult?.message && !saveResult.success}<Alert message={saveResult.message} />{/if}
		<div class="grid gap-4 sm:grid-cols-2">
			<Field
				label="Kategori"
				for="st-category"
				required
				error={fieldError(saveResult, 'categoryId')}
			>
				<select
					id="st-category"
					name="categoryId"
					class="field-input"
					bind:value={categoryId}
					data-autofocus
				>
					{#each data.categories as c (c.id)}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
			</Field>
			<FormField
				label="Navn"
				name="name"
				id="st-name"
				required
				maxlength={150}
				value={v?.name ?? editing?.name ?? ''}
				error={fieldError(saveResult, 'name')}
			/>
			<FormField
				label="Standardvarighed (min.)"
				name="defaultDurationMinutes"
				id="st-duration"
				type="number"
				min={15}
				max={720}
				required
				value={v?.defaultDurationMinutes ?? String(editing?.defaultDurationMinutes ?? 60)}
				error={fieldError(saveResult, 'defaultDurationMinutes')}
			/>
			<FormField
				label="Standardpladser"
				name="defaultCapacity"
				id="st-capacity"
				type="number"
				min={1}
				max={500}
				required
				value={v?.defaultCapacity ?? String(editing?.defaultCapacity ?? 1)}
				error={fieldError(saveResult, 'defaultCapacity')}
			/>
			<label class="flex items-center gap-3 self-end pb-2 text-sm font-medium">
				<input
					type="checkbox"
					name="isActive"
					class="h-5 w-5 rounded border-black/20 text-mint-700 focus:ring-mint-700"
					checked={v ? v.isActive === 'on' : (editing?.isActive ?? true)}
				/>
				Aktiv (kan bookes)
			</label>
		</div>
		<Field label="Beskrivelse" for="st-description" error={fieldError(saveResult, 'description')}>
			<textarea
				id="st-description"
				name="description"
				rows="3"
				maxlength="2000"
				class="field-input"
				value={v?.description ?? editing?.description ?? ''}></textarea>
		</Field>
		<div class="flex justify-end gap-2">
			<Button href={closeHref} variant="ghost">Fortryd</Button>
			<Button type="submit" loading={pending}>{editing ? 'Gem' : 'Opret ydelse'}</Button>
		</div>
	</form>
</Modal>
