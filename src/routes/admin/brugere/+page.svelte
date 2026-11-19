<script lang="ts">
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import Pagination from '$lib/components/booking/Pagination.svelte';
	import { ROLE_LABEL } from '$lib/booking/categories';
	import { withParams } from '$lib/booking/url';
	import { formatDate } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead
	seo={{ metaTitle: 'Brugere | Admin | Hjem i Kroppen', metaDescription: 'Brugere.' }}
	noindex
/>

<AdminHeader
	title="Brugere"
	intro="Nye administratorer oprettes ved at give en eksisterende bruger rollen Administrator."
/>

<form method="GET" class="flex flex-wrap items-end gap-3" data-sveltekit-keepfocus role="search">
	<div class="flex flex-col gap-1">
		<label for="q" class="text-xs font-medium text-black/60">Søg</label>
		<input
			id="q"
			name="q"
			value={data.filters.q}
			class="field-input w-64 py-2"
			placeholder="Navn eller e-mail"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="rolle" class="text-xs font-medium text-black/60">Rolle</label>
		<select id="rolle" name="rolle" class="field-input w-44 py-2">
			<option value="">Alle</option>
			<option value="User" selected={data.filters.rolle === 'User'}>Bruger</option>
			<option value="Admin" selected={data.filters.rolle === 'Admin'}>Administrator</option>
		</select>
	</div>
	<div class="flex flex-col gap-1">
		<label for="aktiv" class="text-xs font-medium text-black/60">Status</label>
		<select id="aktiv" name="aktiv" class="field-input w-40 py-2">
			<option value="">Alle</option>
			<option value="ja" selected={data.filters.aktiv === 'ja'}>Aktive</option>
			<option value="nej" selected={data.filters.aktiv === 'nej'}>Deaktiverede</option>
		</select>
	</div>
	<Button type="submit" variant="secondary" size="sm">Søg</Button>
</form>

{#if data.loadError}<Alert class="mt-6" message={data.loadError} />{/if}

<p class="mt-6 text-sm text-black/55">
	{data.users.totalCount}
	{data.users.totalCount === 1 ? 'bruger' : 'brugere'}
</p>
<div class="mt-2">
	<DataTable
		caption="Brugere"
		columns={[
			{ label: 'Navn' },
			{ label: 'E-mail' },
			{ label: 'Rolle' },
			{ label: 'Status' },
			{ label: 'Oprettet' }
		]}
		rows={data.users.items}
		key={(u) => u.id}
		empty="Ingen brugere matcher søgningen."
	>
		{#snippet row(u)}
			<td class="px-4 py-3"
				><a href="/admin/brugere/{u.id}" class="font-semibold hover:text-mint-700">{u.fullName}</a
				></td
			>
			<td class="px-4 py-3 text-black/70">{u.email}</td>
			<td class="px-4 py-3"
				>{#if u.role === 'Admin'}<Badge tone="dark">{ROLE_LABEL[u.role]}</Badge>{:else}{ROLE_LABEL[
						u.role
					]}{/if}</td
			>
			<td class="px-4 py-3"
				>{#if u.isActive}<Badge tone="mint">Aktiv</Badge>{:else}<Badge tone="rust"
						>Deaktiveret</Badge
					>{/if}</td
			>
			<td class="px-4 py-3 whitespace-nowrap text-black/60">{formatDate(u.createdAt)}</td>
		{/snippet}
	</DataTable>
	<div class="mt-4">
		<Pagination
			page={data.users.page}
			totalPages={data.users.totalPages}
			href={(n) => withParams(page.url, { side: n === 1 ? null : n })}
		/>
	</div>
</div>
