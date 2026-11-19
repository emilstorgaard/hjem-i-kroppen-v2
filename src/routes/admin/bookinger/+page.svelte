<script lang="ts">
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import Pagination from '$lib/components/booking/Pagination.svelte';
	import { resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import { formatDateTime, formatTimeRange, formatWeekdayDate } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const cancelResult = $derived(resultFor(form, 'cancel'));
	const now = Date.now();
	const times = [
		{ value: 'kommende', label: 'Kommende' },
		{ value: 'afsluttede', label: 'Afsluttede' },
		{ value: 'alle', label: 'Alle' }
	];
</script>

<SeoHead
	seo={{ metaTitle: 'Bookinger | Admin | Hjem i Kroppen', metaDescription: 'Alle bookinger.' }}
	noindex
/>

<AdminHeader title="Bookinger" intro="Søg og filtrer på tværs af alle bookinger." />

<form
	method="GET"
	class="grid gap-3 rounded-3xl bg-mint-600/40 p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
	data-sveltekit-keepfocus
	role="search"
>
	<div class="flex flex-col gap-1 lg:col-span-2">
		<label for="f-user" class="text-xs font-medium text-black/60">Bruger</label>
		{#if data.filterUser}
			<input type="hidden" name="userId" value={data.filterUser.id} />
			<span
				class="flex items-center justify-between rounded-2xl bg-white px-4 py-2 text-sm ring-1 ring-black/15"
			>
				<span class="truncate"
					><strong>{data.filterUser.fullName}</strong> · {data.filterUser.email}</span
				>
				<a
					href={withParams(page.url, { userId: null, bruger: null, side: null })}
					class="ml-2 text-black/50 hover:text-black"
					aria-label="Fjern brugerfilter">✕</a
				>
			</span>
		{:else}
			<input
				id="f-user"
				name="bruger"
				value={data.filters.bruger}
				class="field-input py-2"
				placeholder="Navn eller e-mail"
			/>
		{/if}
	</div>
	<div class="flex flex-col gap-1">
		<label for="f-type" class="text-xs font-medium text-black/60">Ydelse</label>
		<select id="f-type" name="ydelse" class="field-input py-2">
			<option value="">Alle</option>
			{#each data.serviceTypes as t (t.id)}<option
					value={t.id}
					selected={data.filters.ydelse === t.id}>{t.name}</option
				>{/each}
		</select>
	</div>
	<div class="flex flex-col gap-1">
		<label for="f-status" class="text-xs font-medium text-black/60">Status</label>
		<select id="f-status" name="status" class="field-input py-2">
			<option value="">Alle</option>
			<option value="Active" selected={data.filters.status === 'Active'}>Aktive</option>
			<option value="Cancelled" selected={data.filters.status === 'Cancelled'}>Aflyste</option>
		</select>
	</div>
	<div class="flex flex-col gap-1">
		<label for="f-time" class="text-xs font-medium text-black/60">Tid</label>
		<select id="f-time" name="tid" class="field-input py-2">
			{#each times as t (t.value)}<option value={t.value} selected={data.filters.tid === t.value}
					>{t.label}</option
				>{/each}
		</select>
	</div>
	<div class="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1 lg:grid-cols-1">
		<div class="flex flex-col gap-1">
			<label for="f-from" class="text-xs font-medium text-black/60">Fra</label>
			<input id="f-from" type="date" name="fra" value={data.filters.fra} class="field-input py-2" />
		</div>
		<div class="flex flex-col gap-1">
			<label for="f-to" class="text-xs font-medium text-black/60">Til</label>
			<input id="f-to" type="date" name="til" value={data.filters.til} class="field-input py-2" />
		</div>
	</div>
	<div class="flex gap-2 sm:col-span-2 lg:col-span-6 lg:justify-end">
		<Button href="/admin/bookinger" variant="ghost" size="sm">Nulstil</Button>
		<Button type="submit" size="sm">Filtrer</Button>
	</div>
</form>

{#if data.loadError}<Alert class="mt-6" message={data.loadError} />{/if}
{#if cancelResult?.message && !cancelResult.success}<Alert
		class="mt-6"
		message={cancelResult.message}
	/>{/if}

{#if data.userCandidates.length > 1}
	<div class="mt-6 rounded-3xl bg-white p-5 ring-1 ring-black/10">
		<p class="text-sm font-medium">Flere brugere matcher "{data.filters.bruger}". Vælg én:</p>
		<ul class="mt-3 flex flex-wrap gap-2">
			{#each data.userCandidates as u (u.id)}
				<li>
					<a
						href={withParams(page.url, { userId: u.id, bruger: null, side: null })}
						class="chip chip-sm">{u.fullName} · {u.email}</a
					>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<p class="mt-6 text-sm text-black/55">
		{data.bookings.totalCount}
		{data.bookings.totalCount === 1 ? 'booking' : 'bookinger'}
	</p>
	<div class="mt-2">
		<DataTable
			caption="Bookinger"
			columns={[
				{ label: 'Tid' },
				{ label: 'Ydelse' },
				{ label: 'Bruger' },
				{ label: 'Note' },
				{ label: 'Status' },
				{ label: 'Handling', srOnly: true }
			]}
			rows={data.bookings.items}
			key={(b) => b.id}
			empty="Ingen bookinger matcher filtrene."
		>
			{#snippet row(b)}
				<td class="px-4 py-3 whitespace-nowrap">
					<a
						href="/admin/sessioner/{b.sessionId}"
						class="font-medium capitalize hover:text-mint-700">{formatWeekdayDate(b.startsAt)}</a
					>
					<span class="block text-xs text-black/55 tabular-nums"
						>kl. {formatTimeRange(b.startsAt, b.endsAt)}</span
					>
				</td>
				<td class="px-4 py-3">
					{b.serviceTypeName}
					{#if b.seriesId}<a
							href="/admin/forloeb/{b.seriesId}"
							class="block text-xs text-mint-700 hover:underline">↻ Forløb</a
						>{/if}
				</td>
				<td class="px-4 py-3">
					<a href="/admin/brugere/{b.userId}" class="font-medium hover:text-mint-700"
						>{b.userFullName}</a
					>
					<span class="block text-xs text-black/55">{b.userEmail}</span>
				</td>
				<td class="max-w-xs px-4 py-3 text-black/70">{b.note ?? '–'}</td>
				<td class="px-4 py-3">
					{#if b.status === 'Active'}<Badge tone="mint">Aktiv</Badge>{:else}<Badge tone="muted"
							>Aflyst</Badge
						>
						{#if b.cancelledAt}<span class="block text-[11px] text-black/45"
								>{formatDateTime(b.cancelledAt)}</span
							>{/if}{/if}
				</td>
				<td class="px-4 py-3 text-right">
					{#if b.status === 'Active' && Date.parse(b.startsAt) > now}
						<ConfirmDialog
							action="?/cancel"
							fields={{ bookingId: b.id }}
							title="Aflys booking?"
							message="Bookingen for {b.userFullName} {formatDateTime(
								b.startsAt
							)} aflyses, og pladsen frigives."
							confirmLabel="Aflys"
						/>
					{/if}
				</td>
			{/snippet}
		</DataTable>
		<div class="mt-4">
			<Pagination
				page={data.bookings.page}
				totalPages={data.bookings.totalPages}
				href={(n) => withParams(page.url, { side: n === 1 ? null : n })}
			/>
		</div>
	</div>
{/if}
