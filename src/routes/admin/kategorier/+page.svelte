<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';
	import Modal from '$lib/components/booking/Modal.svelte';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import { formatDate } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const saveResult = $derived(resultFor(form, 'save'));
	const rowError = $derived(
		resultFor(form, 'row')?.success === false ? resultFor(form, 'row')?.message : undefined
	);
	const editId = $derived(page.url.searchParams.get('rediger'));
	const editing = $derived(editId ? data.categories.find((c) => c.id === editId) : undefined);
	const modalOpen = $derived(
		page.url.searchParams.get('ny') === '1' || !!editing || (!!saveResult && !saveResult.success)
	);
	const closeHref = $derived(withParams(page.url, { ny: null, rediger: null }));
	const v = $derived(saveResult?.values);
	let pending = $state(false);

	const close = () => goto(closeHref, { noScroll: true, keepFocus: true });
</script>

<SeoHead
	seo={{
		metaTitle: 'Kategorier | Admin | Hjem i Kroppen',
		metaDescription: 'Administrer kategorier.'
	}}
	noindex
/>

<AdminHeader
	title="Kategorier"
	intro="Kategorierne grupperer ydelserne og vises som filtre på bookingsiden i den rækkefølge, de er oprettet."
	back={{ href: '/admin/ydelser', label: 'Ydelser' }}
>
	{#snippet actions()}
		<Button href={withParams(page.url, { ny: '1', rediger: null })} size="sm">Opret kategori</Button
		>
	{/snippet}
</AdminHeader>

{#if data.loadError}<Alert class="mb-6" message={data.loadError} />{/if}
{#if rowError}<Alert class="mb-6" message={rowError} />{/if}

<DataTable
	caption="Kategorier"
	columns={[
		{ label: 'Navn' },
		{ label: 'Ydelser' },
		{ label: 'Oprettet' },
		{ label: 'Handlinger', srOnly: true }
	]}
	rows={data.categories}
	key={(c) => c.id}
	empty="Ingen kategorier endnu."
>
	{#snippet row(c)}
		<td class="px-4 py-3 font-semibold">{c.name}</td>
		<td class="px-4 py-3 tabular-nums">
			{#if c.serviceTypeCount > 0}
				<a
					href="/admin/ydelser?kategori={c.slug}"
					class="text-mint-700 underline-offset-4 hover:underline">{c.serviceTypeCount}</a
				>
			{:else}
				<span class="text-black/50">0</span>
			{/if}
		</td>
		<td class="px-4 py-3 text-black/60 tabular-nums">{formatDate(c.createdAt)}</td>
		<td class="px-4 py-3">
			<div class="flex justify-end gap-1">
				<Button href={withParams(page.url, { rediger: c.id, ny: null })} size="sm" variant="ghost"
					>Rediger</Button
				>
				<ConfirmDialog
					action="?/delete"
					fields={{ id: c.id }}
					title="Slet kategori?"
					message={`Kategorien "${c.name}" slettes.`}
					confirmLabel="Slet"
					variant="ghost"
					disabled={c.serviceTypeCount > 0}
				/>
			</div>
		</td>
	{/snippet}
</DataTable>
<p class="mt-2 text-xs text-black/50">
	En kategori kan kun slettes, når den ikke har nogen ydelser. Flyt eller slet ydelserne først.
</p>

<Modal
	open={modalOpen}
	title={editing ? 'Rediger kategori' : 'Opret kategori'}
	onclose={close}
	{closeHref}
>
	<form
		method="POST"
		action={editing ? '?/update' : '?/create'}
		class="flex flex-col gap-4"
		use:enhance={feedback({ pending: (p) => (pending = p), onSuccess: close })}
	>
		{#if editing}<input type="hidden" name="id" value={editing.id} />{/if}
		{#if saveResult?.message && !saveResult.success}<Alert message={saveResult.message} />{/if}
		<FormField
			label="Navn"
			name="name"
			id="cat-name"
			required
			maxlength={100}
			value={v?.name ?? editing?.name ?? ''}
			hint="Fx Danseterapi, Samtaleterapi eller Gruppeterapi."
			error={fieldError(saveResult, 'name')}
			data-autofocus
		/>
		<div class="flex justify-end gap-2">
			<Button href={closeHref} variant="ghost">Fortryd</Button>
			<Button type="submit" loading={pending}>{editing ? 'Gem' : 'Opret kategori'}</Button>
		</div>
	</form>
</Modal>
