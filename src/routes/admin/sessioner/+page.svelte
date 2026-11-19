<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import FillBar from '$lib/components/admin/FillBar.svelte';
	import SessionCreateForm from '$lib/components/admin/SessionCreateForm.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Badge from '$lib/components/booking/Badge.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import Modal from '$lib/components/booking/Modal.svelte';
	import { CATEGORY_STYLE } from '$lib/booking/categories';
	import { resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import {
		dateKeyOf,
		dayOfMonth,
		formatDayLong,
		formatTimeRange,
		formatWeekLabel,
		formatWeekdayDate,
		formatWeekdayShort,
		isoWeekString,
		startOfWeek,
		weekDays
	} from '$lib/utils/date';
	import type { AdminSessionResponse } from '$lib/types/booking';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const days = $derived(weekDays(data.monday));
	const byDay = $derived.by(() => {
		const map: Record<string, AdminSessionResponse[]> = Object.fromEntries(
			days.map((d) => [d, []])
		);
		for (const s of data.sessions) map[dateKeyOf(s.startsAt)]?.push(s);
		return map;
	});

	const createResult = $derived(resultFor(form, 'create'));
	const createOpen = $derived(
		page.url.searchParams.get('ny') === '1' || (!!createResult && !createResult.success)
	);
	const closeCreateHref = $derived(withParams(page.url, { ny: null }));
	const href = (changes: Record<string, string | null>) => withParams(page.url, changes);
	const isCurrentWeek = $derived(data.monday === startOfWeek(data.today));
</script>

<SeoHead
	seo={{ metaTitle: 'Tider | Admin | Hjem i Kroppen', metaDescription: 'Administrer tider.' }}
	noindex
/>

<AdminHeader title="Tider" intro={formatWeekLabel(data.monday)}>
	{#snippet actions()}
		<Button href={href({ ny: '1' })} size="sm">Opret tid</Button>
	{/snippet}
</AdminHeader>

<div class="flex flex-wrap items-center justify-between gap-3">
	<div class="flex items-center gap-2">
		<a href={href({ uge: data.prevWeek })} class="week-arrow" aria-label="Forrige uge">‹</a>
		<a href={href({ uge: data.nextWeek })} class="week-arrow" aria-label="Næste uge">›</a>
		{#if !isCurrentWeek}<a href={href({ uge: null })} class="chip chip-sm">Denne uge</a>{/if}
		<form
			method="GET"
			class="flex items-center gap-2"
			data-sveltekit-keepfocus
			data-sveltekit-noscroll
		>
			{#each [...page.url.searchParams].filter(([k]) => !k.startsWith('/')) as [name, value] (name)}
				{#if name !== 'uge'}<input type="hidden" {name} {value} />{/if}
			{/each}
			<label for="week-pick" class="sr-only">Gå til uge</label>
			<input
				id="week-pick"
				type="week"
				name="uge"
				value={isoWeekString(data.monday)}
				class="field-input w-40 py-2"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
			/>
		</form>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<form
			method="GET"
			class="flex items-center gap-2"
			data-sveltekit-keepfocus
			data-sveltekit-noscroll
		>
			{#each [...page.url.searchParams].filter(([k]) => k !== 'ydelse' && !k.startsWith('/')) as [name, value] (name)}
				<input type="hidden" {name} {value} />
			{/each}
			<label for="type-filter" class="sr-only">Ydelse</label>
			<select
				id="type-filter"
				name="ydelse"
				class="field-input w-48 py-2"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
			>
				<option value="">Alle ydelser</option>
				{#each data.serviceTypes as t (t.id)}<option
						value={t.id}
						selected={data.filters.serviceTypeId === t.id}>{t.name}</option
					>{/each}
			</select>
			<noscript><Button type="submit" size="sm" variant="secondary">Filtrer</Button></noscript>
		</form>
		<a
			href={href({ aflyste: data.filters.includeCancelled ? null : '1' })}
			class="chip chip-sm {data.filters.includeCancelled ? 'chip-active' : ''}">Vis aflyste</a
		>
		<div class="flex rounded-full bg-black/5 p-1" role="group" aria-label="Visning">
			<a
				href={href({ visning: null })}
				aria-current={data.view === 'uge' ? 'true' : undefined}
				class="rounded-full px-3 py-1 text-xs font-medium {data.view === 'uge'
					? 'bg-white shadow-sm'
					: 'text-black/60'}">Uge</a
			>
			<a
				href={href({ visning: 'liste' })}
				aria-current={data.view === 'liste' ? 'true' : undefined}
				class="rounded-full px-3 py-1 text-xs font-medium {data.view === 'liste'
					? 'bg-white shadow-sm'
					: 'text-black/60'}">Liste</a
			>
		</div>
	</div>
</div>

{#if data.loadError}<Alert class="mt-6" message={data.loadError} />{/if}

{#if data.view === 'uge'}
	<div class="mt-6 grid gap-3 md:grid-cols-7">
		{#each days as day (day)}
			<section
				aria-label={formatDayLong(day)}
				class="flex flex-col gap-2 {day < data.today ? 'opacity-60' : ''}"
			>
				<h2
					class="flex items-baseline justify-between rounded-2xl px-3 py-2 md:flex-col md:items-center {day ===
					data.today
						? 'bg-mint-700 text-white'
						: 'bg-mint-600/50'}"
				>
					<span class="text-xs font-medium tracking-[0.2em] uppercase"
						>{formatWeekdayShort(day)}</span
					>
					<span class="font-serif text-xl font-semibold">{dayOfMonth(day)}</span>
				</h2>
				{#each byDay[day] as s (s.id)}
					<a
						href="/admin/sessioner/{s.id}"
						class="block rounded-2xl p-3 ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-mint-700 {s.isCancelled
							? 'bg-black/[0.03] text-black/45 line-through ring-black/5'
							: CATEGORY_STYLE[s.category].card}"
					>
						<p class="text-xs font-semibold tabular-nums">
							{formatTimeRange(s.startsAt, s.endsAt)}
						</p>
						<p class="mt-0.5 text-sm leading-snug font-semibold">{s.serviceTypeName}</p>
						{#if s.seriesTitle}<p class="truncate text-[11px] text-black/55">
								↻ {s.seriesTitle}
							</p>{/if}
						<div class="mt-2">
							<FillBar
								booked={s.activeBookingCount}
								capacity={s.capacity}
								cancelled={s.isCancelled}
							/>
						</div>
					</a>
				{:else}
					<p class="hidden py-4 text-center text-xs text-black/30 md:block">–</p>
				{/each}
			</section>
		{/each}
	</div>
{:else}
	<div class="mt-6">
		<DataTable
			caption="Tider i ugen"
			columns={[
				{ label: 'Dato' },
				{ label: 'Tid' },
				{ label: 'Ydelse' },
				{ label: 'Sted' },
				{ label: 'Booket' },
				{ label: 'Status' },
				{ label: 'Handling', srOnly: true }
			]}
			rows={data.sessions}
			key={(s) => s.id}
			empty="Ingen tider i denne uge."
		>
			{#snippet row(s)}
				<td class="px-4 py-3 whitespace-nowrap capitalize">{formatWeekdayDate(s.startsAt)}</td>
				<td class="px-4 py-3 whitespace-nowrap tabular-nums"
					>{formatTimeRange(s.startsAt, s.endsAt)}</td
				>
				<td class="px-4 py-3">
					<span class="font-medium">{s.serviceTypeName}</span>
					{#if s.seriesTitle}<span class="block text-xs text-black/55">↻ {s.seriesTitle}</span>{/if}
				</td>
				<td class="px-4 py-3 text-black/70">{s.location ?? '–'}</td>
				<td class="px-4 py-3"
					><FillBar
						booked={s.activeBookingCount}
						capacity={s.capacity}
						cancelled={s.isCancelled}
					/></td
				>
				<td class="px-4 py-3"
					>{#if s.isCancelled}<Badge tone="muted">Aflyst</Badge>{:else}<Badge tone="mint"
							>Aktiv</Badge
						>{/if}</td
				>
				<td class="px-4 py-3 text-right"
					><a href="/admin/sessioner/{s.id}" class="font-medium text-mint-700 hover:underline"
						>Åbn</a
					></td
				>
			{/snippet}
		</DataTable>
	</div>
{/if}

<Modal
	open={createOpen}
	title="Opret tid"
	onclose={() => goto(closeCreateHref, { noScroll: true, keepFocus: true })}
	closeHref={closeCreateHref}
	size="lg"
>
	<SessionCreateForm
		serviceTypes={data.serviceTypes}
		series={data.series}
		result={createResult}
		onSuccess={() =>
			goto(closeCreateHref, { noScroll: true, keepFocus: true, invalidateAll: true })}
	/>
</Modal>
