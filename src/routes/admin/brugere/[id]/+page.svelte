<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';
	import Pagination from '$lib/components/booking/Pagination.svelte';
	import { ROLE_LABEL } from '$lib/booking/categories';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import { formatDate, formatDateTime, formatTimeRange, formatWeekdayDate } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const u = $derived(data.account);
	const now = Date.now();
	const updateResult = $derived(resultFor(form, 'update'));
	const passwordResult = $derived(resultFor(form, 'password'));
	const roleResult = $derived(resultFor(form, 'role'));
	const statusResult = $derived(resultFor(form, 'status'));
	const cancelResult = $derived(resultFor(form, 'cancelBooking'));
	let updatePending = $state(false);
	let passwordPending = $state(false);
	let rolePending = $state(false);
	const times = [
		{ value: 'kommende', label: 'Kommende' },
		{ value: 'afsluttede', label: 'Afsluttede' },
		{ value: 'alle', label: 'Alle' }
	];
</script>

<SeoHead
	seo={{ metaTitle: `${u.fullName} | Brugere | Admin`, metaDescription: 'Bruger' }}
	noindex
/>

<AdminHeader
	title={u.fullName}
	intro="{u.email} · oprettet {formatDate(u.createdAt)}"
	back={{ href: '/admin/brugere', label: 'Brugere' }}
>
	{#snippet actions()}
		{#if u.role === 'Admin'}<Badge tone="dark">{ROLE_LABEL[u.role]}</Badge>{/if}
		{#if u.isActive}<Badge tone="mint">Aktiv</Badge>{:else}<Badge tone="rust">Deaktiveret</Badge
			>{/if}
	{/snippet}
</AdminHeader>

{#if data.isSelf}
	<Alert tone="info" class="mb-6"
		>Det er din egen konto. Rolle og status kan ikke ændres her, og dine egne oplysninger retter du
		på <a href="/min-side" class="font-semibold underline">Min side</a>.</Alert
	>
{/if}

<div class="grid gap-6 lg:grid-cols-3">
	<section class="rounded-3xl bg-mint-600/50 p-6" aria-labelledby="info-heading">
		<h2 id="info-heading" class="font-serif text-xl font-semibold">Oplysninger</h2>
		<form
			method="POST"
			action="?/update"
			class="mt-4 flex flex-col gap-4"
			use:enhance={feedback({ pending: (v) => (updatePending = v), resetOnSuccess: false })}
		>
			{#if updateResult?.message && !updateResult.success}<Alert
					message={updateResult.message}
				/>{/if}
			<FormField
				label="Fulde navn"
				name="fullName"
				id="u-name"
				required
				maxlength={200}
				value={updateResult?.values?.fullName ?? u.fullName}
				error={fieldError(updateResult, 'fullName')}
			/>
			<FormField
				label="E-mail"
				name="email"
				id="u-email"
				type="email"
				required
				maxlength={256}
				value={updateResult?.values?.email ?? u.email}
				error={fieldError(updateResult, 'email')}
			/>
			<Button type="submit" size="sm" loading={updatePending}>Gem</Button>
		</form>
	</section>

	<section
		class="flex flex-col gap-6 rounded-3xl bg-white p-6 ring-1 ring-black/10"
		aria-labelledby="access-heading"
	>
		<h2 id="access-heading" class="font-serif text-xl font-semibold">Adgang</h2>
		{#if !data.isSelf}
			<form
				method="POST"
				action="?/role"
				class="flex items-end gap-2"
				use:enhance={feedback({ pending: (v) => (rolePending = v), resetOnSuccess: false })}
			>
				<div class="flex flex-1 flex-col gap-1.5">
					<label for="u-role" class="text-sm font-medium text-black/80">Rolle</label>
					<select id="u-role" name="role" class="field-input">
						<option value="User" selected={u.role === 'User'}>{ROLE_LABEL.User}</option>
						<option value="Admin" selected={u.role === 'Admin'}>{ROLE_LABEL.Admin}</option>
					</select>
				</div>
				<Button type="submit" size="sm" variant="secondary" loading={rolePending}>Skift</Button>
			</form>
			{#if roleResult?.message && !roleResult.success}<Alert message={roleResult.message} />{/if}

			<div>
				{#if statusResult?.message && !statusResult.success}<Alert
						class="mb-3"
						message={statusResult.message}
					/>{/if}
				{#if u.isActive}
					<ConfirmDialog
						action="?/deactivate"
						title="Deaktiver bruger?"
						message="{u.fullName} kan ikke længere logge ind, og eksisterende log ind afvises med det samme. Bookinger bevares."
						confirmLabel="Deaktiver bruger"
						size="sm"
					/>
				{:else}
					<ConfirmDialog
						action="?/activate"
						title="Aktiver bruger?"
						message="{u.fullName} kan igen logge ind og booke."
						confirmLabel="Aktiver bruger"
						tone="primary"
						size="sm"
					/>
				{/if}
			</div>
		{/if}

		<form
			method="POST"
			action="?/password"
			class="flex flex-col gap-3"
			use:enhance={feedback({ pending: (v) => (passwordPending = v) })}
		>
			{#if passwordResult?.message && !passwordResult.success}<Alert
					message={passwordResult.message}
				/>{/if}
			<FormField
				label="Ny adgangskode"
				name="newPassword"
				id="u-password"
				type="password"
				autocomplete="new-password"
				required
				minlength={8}
				hint="Mindst 8 tegn. Brugeren bør skifte den på Min side."
				error={fieldError(passwordResult, 'newPassword')}
			/>
			<Button type="submit" size="sm" variant="secondary" loading={passwordPending}
				>Nulstil adgangskode</Button
			>
		</form>
	</section>

	<section class="rounded-3xl bg-white p-6 ring-1 ring-black/10">
		<h2 class="font-serif text-xl font-semibold">Overblik</h2>
		<dl class="mt-4 grid gap-3 text-sm">
			<div class="flex justify-between">
				<dt class="text-black/55">
					Bookinger ({times.find((t) => t.value === data.tid)?.label.toLowerCase()})
				</dt>
				<dd class="font-semibold tabular-nums">{data.bookings.totalCount}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-black/55">Senest ændret</dt>
				<dd>{formatDate(u.updatedAt)}</dd>
			</div>
		</dl>
		<Button href="/admin/bookinger?userId={u.id}" size="sm" variant="ghost" class="mt-4"
			>Se i bookingoversigten</Button
		>
	</section>
</div>

<section class="mt-10" aria-labelledby="bookings-heading">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h2 id="bookings-heading" class="font-serif text-2xl font-semibold">Bookinger</h2>
		<div class="flex gap-2" role="group" aria-label="Tidsfilter">
			{#each times as t (t.value)}
				<a
					href={withParams(page.url, { tid: t.value === 'kommende' ? null : t.value, side: null })}
					class="chip chip-sm {data.tid === t.value ? 'chip-active' : ''}">{t.label}</a
				>
			{/each}
		</div>
	</div>
	{#if cancelResult?.message && !cancelResult.success}<Alert
			class="mt-4"
			message={cancelResult.message}
		/>{/if}
	<div class="mt-4">
		<DataTable
			caption="Brugerens bookinger"
			columns={[
				{ label: 'Tid' },
				{ label: 'Ydelse' },
				{ label: 'Note' },
				{ label: 'Status' },
				{ label: 'Handling', srOnly: true }
			]}
			rows={data.bookings.items}
			key={(b) => b.id}
			empty="Ingen bookinger."
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
				<td class="px-4 py-3">{b.serviceTypeName}</td>
				<td class="max-w-xs px-4 py-3 text-black/70">{b.note ?? '–'}</td>
				<td class="px-4 py-3"
					>{#if b.status === 'Active'}<Badge tone="mint">Aktiv</Badge>{:else}<Badge tone="muted"
							>Aflyst</Badge
						>{/if}</td
				>
				<td class="px-4 py-3 text-right">
					{#if b.status === 'Active' && Date.parse(b.startsAt) > now}
						<ConfirmDialog
							action="?/cancelBooking"
							fields={{ bookingId: b.id }}
							title="Aflys booking?"
							message="Bookingen {formatDateTime(b.startsAt)} aflyses, og pladsen frigives."
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
</section>
