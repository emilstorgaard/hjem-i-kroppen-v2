<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
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
	import Field from '$lib/components/booking/Field.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';
	import Modal from '$lib/components/booking/Modal.svelte';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { paramsFrom } from '$lib/booking/params';
	import { withParams } from '$lib/booking/url';
	import {
		dateKeyOf,
		formatDateTime,
		formatTimeRange,
		formatWeekdayDate,
		isoWeekString,
		minutesBetween,
		toLocalInput
	} from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const s = $derived(data.session);
	const started = $derived(Date.parse(s.startsAt) <= Date.now());
	const updateResult = $derived(resultFor(form, 'update'));
	const editOpen = $derived(
		page.url.searchParams.get('rediger') === '1' || (!!updateResult && !updateResult.success)
	);
	const closeEditHref = $derived(withParams(page.url, { rediger: null }));
	const actionError = $derived.by(() => {
		for (const id of ['cancel', 'delete', 'cancelBooking']) {
			const r = resultFor(form, id);
			if (r && !r.success) return r.message;
		}
		return undefined;
	});
	let pending = $state(false);
</script>

<SeoHead
	seo={{
		metaTitle: `${s.serviceTypeName} ${formatDateTime(s.startsAt)} | Admin`,
		metaDescription: 'Tid'
	}}
	noindex
/>

<AdminHeader
	title={s.serviceTypeName}
	intro="{formatWeekdayDate(s.startsAt)} kl. {formatTimeRange(s.startsAt, s.endsAt)}"
	back={{ href: `/admin/sessioner?uge=${isoWeekString(dateKeyOf(s.startsAt))}`, label: 'Tider' }}
>
	{#snippet actions()}
		{#if !s.isCancelled}
			<Button href={withParams(page.url, { rediger: '1' })} size="sm" variant="secondary"
				>Rediger</Button
			>
			<ConfirmDialog
				action="?/cancel"
				title="Aflys tiden?"
				message="Tiden aflyses, og alle {s.activeBookingCount} aktive bookinger annulleres. Det kan ikke fortrydes."
				confirmLabel="Aflys tid"
				size="sm"
			/>
		{/if}
		<ConfirmDialog
			action="?/delete"
			title="Slet tiden?"
			message="Tiden slettes helt. Det er kun muligt, når den ikke har aktive bookinger."
			confirmLabel="Slet tid"
			variant="ghost"
			size="sm"
		/>
	{/snippet}
</AdminHeader>

{#if actionError}<Alert class="mb-6" message={actionError} />{/if}

<div class="grid gap-6 lg:grid-cols-3">
	<dl class="grid grid-cols-2 gap-4 rounded-3xl bg-mint-600/50 p-6 text-sm lg:col-span-2">
		<div>
			<dt class="text-black/55">Kategori</dt>
			<dd class="font-medium">{s.category.name}</dd>
		</div>
		<div>
			<dt class="text-black/55">Status</dt>
			<dd>
				{#if s.isCancelled}<Badge tone="rust">Aflyst</Badge>{:else if started}<Badge tone="muted"
						>Startet</Badge
					>{:else}<Badge tone="mint">Kommende</Badge>{/if}
			</dd>
		</div>
		<div>
			<dt class="text-black/55">Varighed</dt>
			<dd class="font-medium">{minutesBetween(s.startsAt, s.endsAt)} min.</dd>
		</div>
		<div>
			<dt class="text-black/55">Booket</dt>
			<dd>
				<FillBar booked={s.activeBookingCount} capacity={s.capacity} cancelled={s.isCancelled} />
			</dd>
		</div>
		<div>
			<dt class="text-black/55">Sted</dt>
			<dd class="font-medium">{s.location ?? '–'}</dd>
		</div>
		<div>
			<dt class="text-black/55">Forløb</dt>
			<dd class="font-medium">
				{#if s.seriesId}<a href="/admin/forloeb/{s.seriesId}" class="text-mint-700 hover:underline"
						>{s.seriesTitle ?? 'Forløb'}</a
					>{:else}–{/if}
			</dd>
		</div>
		{#if s.notes}<div class="col-span-2">
				<dt class="text-black/55">Noter</dt>
				<dd class="whitespace-pre-line">{s.notes}</dd>
			</div>{/if}
	</dl>

	{#if !s.isCancelled && !started}
		<section class="rounded-3xl bg-white p-6 ring-1 ring-black/10" aria-labelledby="add-heading">
			<h2 id="add-heading" class="font-serif text-xl font-semibold">Book en bruger</h2>
			<p class="mt-1 mb-4 text-xs text-black/55">{s.availableSpots} ledige pladser</p>
			<UserPicker
				query={data.query}
				results={data.userResults}
				action="?/addBooking"
				keep={paramsFrom(page.url)}
				submitLabel="Book"
				result={resultFor(form, 'addBooking')}
			/>
		</section>
	{/if}
</div>

<section class="mt-10" aria-labelledby="participants-heading">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h2 id="participants-heading" class="font-serif text-2xl font-semibold">
			Deltagere ({s.activeBookingCount})
		</h2>
		<a
			href={withParams(page.url, { alle: data.includeCancelled ? null : '1' })}
			class="chip chip-sm {data.includeCancelled ? 'chip-active' : ''}">Vis aflyste bookinger</a
		>
	</div>
	<div class="mt-4">
		<DataTable
			caption="Deltagere"
			columns={[
				{ label: 'Navn' },
				{ label: 'E-mail' },
				{ label: 'Note' },
				{ label: 'Booket' },
				{ label: 'Status' },
				{ label: 'Handling', srOnly: true }
			]}
			rows={data.bookings}
			key={(b) => b.id}
			empty="Ingen bookinger endnu."
		>
			{#snippet row(b)}
				<td class="px-4 py-3 font-medium"
					><a href="/admin/brugere/{b.userId}" class="hover:text-mint-700">{b.userFullName}</a></td
				>
				<td class="px-4 py-3 text-black/70">{b.userEmail}</td>
				<td class="max-w-xs px-4 py-3 text-black/70">{b.note ?? '–'}</td>
				<td class="px-4 py-3 whitespace-nowrap text-black/60 tabular-nums"
					>{formatDateTime(b.createdAt)}</td
				>
				<td class="px-4 py-3"
					>{#if b.status === 'Active'}<Badge tone="mint">Aktiv</Badge>{:else}<Badge tone="muted"
							>Aflyst</Badge
						>{/if}</td
				>
				<td class="px-4 py-3 text-right">
					{#if b.status === 'Active' && !started}
						<ConfirmDialog
							action="?/cancelBooking"
							fields={{ bookingId: b.id }}
							title="Aflys booking?"
							message="Bookingen for {b.userFullName} aflyses, og pladsen frigives."
							confirmLabel="Aflys"
						/>
					{/if}
				</td>
			{/snippet}
		</DataTable>
	</div>
</section>

<Modal
	open={editOpen}
	title="Rediger tid"
	onclose={() => goto(closeEditHref, { noScroll: true, keepFocus: true })}
	closeHref={closeEditHref}
	size="lg"
>
	<form
		method="POST"
		action="?/update"
		class="flex flex-col gap-4"
		use:enhance={feedback({
			pending: (v) => (pending = v),
			resetOnSuccess: false,
			onSuccess: () => goto(closeEditHref, { noScroll: true, keepFocus: true })
		})}
	>
		{#if updateResult?.message && !updateResult.success}<Alert
				message={updateResult.message}
			/>{/if}
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField
				label="Start"
				name="startsAt"
				id="edit-start"
				type="datetime-local"
				required
				value={updateResult?.values?.startsAt ?? toLocalInput(s.startsAt)}
				error={fieldError(updateResult, 'startsAt')}
				data-autofocus
			/>
			<FormField
				label="Slut"
				name="endsAt"
				id="edit-end"
				type="datetime-local"
				required
				value={updateResult?.values?.endsAt ?? toLocalInput(s.endsAt)}
				error={fieldError(updateResult, 'endsAt')}
			/>
			<FormField
				label="Pladser"
				name="capacity"
				id="edit-capacity"
				type="number"
				min={Math.max(1, s.activeBookingCount)}
				max={500}
				required
				value={updateResult?.values?.capacity ?? String(s.capacity)}
				hint="Mindst {Math.max(1, s.activeBookingCount)} (antal bookinger)"
				error={fieldError(updateResult, 'capacity')}
			/>
			<FormField
				label="Sted"
				name="location"
				id="edit-location"
				maxlength={200}
				value={updateResult?.values?.location ?? s.location ?? ''}
				error={fieldError(updateResult, 'location')}
			/>
		</div>
		<Field
			label="Noter (vises for brugerne)"
			for="edit-notes"
			error={fieldError(updateResult, 'notes')}
		>
			<textarea
				id="edit-notes"
				name="notes"
				rows="3"
				maxlength="2000"
				class="field-input"
				value={updateResult?.values?.notes ?? s.notes ?? ''}></textarea>
		</Field>
		<div class="flex justify-end gap-2">
			<Button href={closeEditHref} variant="ghost">Fortryd</Button>
			<Button type="submit" loading={pending}>Gem</Button>
		</div>
	</form>
</Modal>
