<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import FillBar from '$lib/components/admin/FillBar.svelte';
	import UserPicker from '$lib/components/admin/UserPicker.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';
	import Pagination from '$lib/components/booking/Pagination.svelte';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { paramsFrom } from '$lib/booking/params';
	import { withParams } from '$lib/booking/url';
	import { formatDate, formatDateTime, formatTimeRange, formatWeekdayDate } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const s = $derived(data.series);
	const now = Date.now();
	const hasUpcoming = $derived(
		s.sessions.some((x) => !x.isCancelled && Date.parse(x.startsAt) > now)
	);
	const renameResult = $derived(resultFor(form, 'rename'));
	const actionError = $derived.by(() => {
		for (const id of ['cancel', 'removeUser']) {
			const r = resultFor(form, id);
			if (r && !r.success) return r.message;
		}
		return undefined;
	});
	let renamePending = $state(false);
</script>

<SeoHead seo={{ metaTitle: `${s.title} | Forløb | Admin`, metaDescription: 'Forløb' }} noindex />

<AdminHeader
	title={s.title}
	intro="{s.serviceTypeName}{s.firstStartsAt
		? ` · ${formatDate(s.firstStartsAt)}`
		: ''}{s.lastEndsAt ? ` – ${formatDate(s.lastEndsAt)}` : ''}"
	back={{ href: '/admin/forloeb', label: 'Forløb' }}
>
	{#snippet actions()}
		<Button href="/book/serie/{s.id}" size="sm" variant="ghost">Se offentlig side</Button>
		{#if !s.isCancelled}
			<ConfirmDialog
				action="?/cancel"
				title="Aflys forløbet?"
				message="Forløbet, dets kommende tider og alle bookinger på dem aflyses. Det kan ikke fortrydes."
				confirmLabel="Aflys forløb"
				size="sm"
			/>
		{/if}
	{/snippet}
</AdminHeader>

{#if s.isCancelled}<Alert
		tone="info"
		class="mb-6"
		message="Forløbet er aflyst{s.cancelledAt ? ` (${formatDateTime(s.cancelledAt)})` : ''}."
	/>{/if}
{#if actionError}<Alert class="mb-6" message={actionError} />{/if}

<div class="grid gap-6 lg:grid-cols-3">
	<section class="lg:col-span-2" aria-labelledby="sessions-heading">
		<h2 id="sessions-heading" class="font-serif text-2xl font-semibold">
			Tider ({s.sessions.length})
		</h2>
		<div class="mt-4">
			<DataTable
				caption="Forløbets tider"
				columns={[
					{ label: 'Dato' },
					{ label: 'Tid' },
					{ label: 'Sted' },
					{ label: 'Booket' },
					{ label: 'Status' }
				]}
				rows={s.sessions}
				key={(x) => x.id}
				empty="Forløbet har ingen tider."
			>
				{#snippet row(x)}
					<td class="px-4 py-3 whitespace-nowrap capitalize"
						><a href="/admin/sessioner/{x.id}" class="font-medium hover:text-mint-700"
							>{formatWeekdayDate(x.startsAt)}</a
						></td
					>
					<td class="px-4 py-3 whitespace-nowrap tabular-nums"
						>{formatTimeRange(x.startsAt, x.endsAt)}</td
					>
					<td class="px-4 py-3 text-black/70">{x.location ?? '–'}</td>
					<td class="px-4 py-3"
						><FillBar
							booked={x.activeBookingCount}
							capacity={x.capacity}
							cancelled={x.isCancelled}
						/></td
					>
					<td class="px-4 py-3">
						{#if x.isCancelled}<Badge tone="muted">Aflyst</Badge
							>{:else if Date.parse(x.startsAt) <= now}<Badge tone="neutral">Afholdt</Badge
							>{:else}<Badge tone="mint">Kommende</Badge>{/if}
					</td>
				{/snippet}
			</DataTable>
		</div>
	</section>

	<div class="flex flex-col gap-6">
		<section class="rounded-3xl bg-mint-600/50 p-6" aria-labelledby="rename-heading">
			<h2 id="rename-heading" class="font-serif text-xl font-semibold">Titel</h2>
			<form
				method="POST"
				action="?/rename"
				class="mt-3 flex flex-col gap-3"
				use:enhance={feedback({ pending: (v) => (renamePending = v), resetOnSuccess: false })}
			>
				{#if renameResult?.message && !renameResult.success}<Alert
						message={renameResult.message}
					/>{/if}
				<FormField
					label="Titel"
					name="title"
					id="rename-title"
					required
					maxlength={200}
					value={renameResult?.values?.title ?? s.title}
					error={fieldError(renameResult, 'title')}
				/>
				<Button type="submit" size="sm" variant="secondary" loading={renamePending}
					>Gem titel</Button
				>
			</form>
		</section>

		{#if !s.isCancelled && hasUpcoming}
			<section class="rounded-3xl bg-white p-6 ring-1 ring-black/10" aria-labelledby="add-heading">
				<h2 id="add-heading" class="font-serif text-xl font-semibold">Tilføj deltager</h2>
				<p class="mt-1 mb-4 text-xs text-black/55">
					Brugeren bookes på alle kommende tider. Er én fuldt booket, bookes ingen.
				</p>
				<UserPicker
					query={data.query}
					results={data.userResults}
					action="?/addUser"
					keep={paramsFrom(page.url)}
					submitLabel="Tilføj"
					result={resultFor(form, 'addUser')}
				/>
			</section>
		{/if}
	</div>
</div>

<section class="mt-10" aria-labelledby="participants-heading">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h2 id="participants-heading" class="font-serif text-2xl font-semibold">
			Deltagere ({s.participantCount})
		</h2>
		<a
			href={withParams(page.url, { alle: data.includeCancelled ? null : '1', side: null })}
			class="chip chip-sm {data.includeCancelled ? 'chip-active' : ''}">Vis også aflyste</a
		>
	</div>
	<div class="mt-4">
		<DataTable
			caption="Deltagere i forløbet"
			columns={[
				{ label: 'Navn' },
				{ label: 'E-mail' },
				{ label: 'Aktive tider' },
				{ label: 'Note' },
				{ label: 'Booket første gang' },
				{ label: 'Handling', srOnly: true }
			]}
			rows={data.participants.items}
			key={(p) => p.userId}
			empty="Ingen deltagere endnu."
		>
			{#snippet row(p)}
				<td class="px-4 py-3 font-medium"
					><a href="/admin/brugere/{p.userId}" class="hover:text-mint-700">{p.fullName}</a></td
				>
				<td class="px-4 py-3 text-black/70">{p.email}</td>
				<td class="px-4 py-3 tabular-nums">{p.activeBookingCount}</td>
				<td class="max-w-xs px-4 py-3 text-black/70">{p.note ?? '–'}</td>
				<td class="px-4 py-3 whitespace-nowrap text-black/60 tabular-nums"
					>{formatDateTime(p.firstBookedAt)}</td
				>
				<td class="px-4 py-3 text-right">
					{#if p.activeBookingCount > 0 && hasUpcoming}
						<ConfirmDialog
							action="?/removeUser"
							fields={{ userId: p.userId }}
							title="Fjern deltager?"
							message="{p.fullName}s kommende tider i forløbet aflyses. Tider, der er startet, berøres ikke."
							confirmLabel="Fjern"
						/>
					{/if}
				</td>
			{/snippet}
		</DataTable>
		<div class="mt-4">
			<Pagination
				page={data.participants.page}
				totalPages={data.participants.totalPages}
				href={(n) => withParams(page.url, { side: n === 1 ? null : n })}
			/>
		</div>
	</div>
</section>
