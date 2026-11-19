<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DataTable from '$lib/components/admin/DataTable.svelte';
	import FillBar from '$lib/components/admin/FillBar.svelte';
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import { CATEGORY_STYLE } from '$lib/booking/categories';
	import {
		dateKeyOf,
		formatDateTime,
		formatDayLong,
		formatTimeRange,
		formatWeekLabel
	} from '$lib/utils/date';
	import type { AdminSessionResponse } from '$lib/types/booking';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const weekFill = $derived.by(() => {
		const capacity = data.weekSessions.reduce((sum, s) => sum + s.capacity, 0);
		const booked = data.weekSessions.reduce((sum, s) => sum + s.activeBookingCount, 0);
		return capacity === 0 ? '–' : `${Math.round((booked / capacity) * 100)} %`;
	});

	const byDay = $derived.by(() => {
		const groups: { day: string; sessions: AdminSessionResponse[] }[] = [];
		for (const s of data.weekSessions.toSorted((a, b) => a.startsAt.localeCompare(b.startsAt))) {
			const day = dateKeyOf(s.startsAt);
			if (groups.at(-1)?.day !== day) groups.push({ day, sessions: [] });
			groups.at(-1)!.sessions.push(s);
		}
		return groups;
	});
</script>

<SeoHead
	seo={{ metaTitle: 'Admin | Hjem i Kroppen', metaDescription: 'Administration af bookinger.' }}
	noindex
/>

<AdminHeader title="Oversigt" intro={formatWeekLabel(data.monday)}>
	{#snippet actions()}
		<Button href="/admin/sessioner?ny=1" size="sm">Opret tid</Button>
		<Button href="/admin/forloeb?ny=1" size="sm" variant="secondary">Opret forløb</Button>
	{/snippet}
</AdminHeader>

{#if data.loadError}<Alert class="mb-6" message={data.loadError} />{/if}

<div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
	<StatCard label="Tider i dag" value={data.todaySessions.length} />
	<StatCard label="Tider denne uge" value={data.weekSessions.length} />
	<StatCard
		label="Belægning denne uge"
		value={weekFill}
		hint="Bookede pladser i forhold til kapacitet"
	/>
	<StatCard
		label="Aktive brugere"
		value={data.activeUserCount}
		hint="{data.upcomingSeriesCount} kommende forløb"
	/>
</div>

<div class="mt-10 grid gap-10 xl:grid-cols-2">
	<section aria-labelledby="today-heading">
		<h2 id="today-heading" class="font-serif text-2xl font-semibold">I dag</h2>
		{#if data.todaySessions.length === 0}
			<p class="mt-3 rounded-3xl bg-mint-600/40 p-6 text-sm text-black/60">Ingen tider i dag.</p>
		{:else}
			<ul class="mt-4 flex flex-col gap-2">
				{#each data.todaySessions as s (s.id)}
					<li>
						<a
							href="/admin/sessioner/{s.id}"
							class="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/10 transition-colors hover:ring-mint-700"
						>
							<span class="flex items-center gap-3">
								<span
									class="h-2.5 w-2.5 rounded-full {CATEGORY_STYLE[s.category].dot}"
									aria-hidden="true"
								></span>
								<span>
									<span class="block text-sm font-semibold tabular-nums"
										>{formatTimeRange(s.startsAt, s.endsAt)}</span
									>
									<span class="block text-sm text-black/65"
										>{s.serviceTypeName}{s.location ? ` · ${s.location}` : ''}</span
									>
								</span>
							</span>
							<FillBar booked={s.activeBookingCount} capacity={s.capacity} />
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<h2 class="mt-10 font-serif text-2xl font-semibold">Hele ugen</h2>
		{#if byDay.length === 0}
			<p class="mt-3 text-sm text-black/60">Ingen tider denne uge.</p>
		{:else}
			<div class="mt-4 flex flex-col gap-5">
				{#each byDay as group (group.day)}
					<div>
						<p
							class="text-xs font-medium tracking-[0.2em] uppercase {group.day === data.today
								? 'text-mint-700'
								: 'text-black/55'}"
						>
							{formatDayLong(group.day)}
						</p>
						<ul class="mt-2 divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/10">
							{#each group.sessions as s (s.id)}
								<li>
									<a
										href="/admin/sessioner/{s.id}"
										class="flex items-center justify-between gap-4 px-4 py-3 hover:bg-mint-600/20"
									>
										<span class="text-sm"
											><span class="font-semibold tabular-nums"
												>{formatTimeRange(s.startsAt, s.endsAt)}</span
											>
											· {s.serviceTypeName}</span
										>
										<FillBar booked={s.activeBookingCount} capacity={s.capacity} />
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section aria-labelledby="bookings-heading">
		<div class="flex items-end justify-between">
			<h2 id="bookings-heading" class="font-serif text-2xl font-semibold">Kommende bookinger</h2>
			<a href="/admin/bookinger" class="text-sm font-medium text-mint-700 hover:underline"
				>Se alle</a
			>
		</div>
		<div class="mt-4">
			<DataTable
				caption="Kommende bookinger"
				columns={[{ label: 'Tid' }, { label: 'Ydelse' }, { label: 'Bruger' }]}
				rows={data.upcomingBookings}
				key={(b) => b.id}
				empty="Ingen kommende bookinger."
			>
				{#snippet row(b)}
					<td class="px-4 py-3 whitespace-nowrap tabular-nums">{formatDateTime(b.startsAt)}</td>
					<td class="px-4 py-3">{b.serviceTypeName}</td>
					<td class="px-4 py-3"
						><a href="/admin/brugere/{b.userId}" class="font-medium hover:text-mint-700"
							>{b.userFullName}</a
						></td
					>
				{/snippet}
			</DataTable>
		</div>

		<h2 class="mt-10 font-serif text-2xl font-semibold">Genveje</h2>
		<div class="mt-4 grid gap-3 sm:grid-cols-2">
			{#each [{ href: '/admin/sessioner', title: 'Tider', text: 'Kalender, opret og aflys tider' }, { href: '/admin/forloeb', title: 'Forløb', text: 'Gruppeforløb og deltagere' }, { href: '/admin/ydelser', title: 'Ydelser', text: 'Typer, varighed og pladser' }, { href: '/admin/brugere', title: 'Brugere', text: 'Søg, roller og adgang' }] as link (link.href)}
				<a
					href={link.href}
					class="rounded-3xl bg-mint-600/50 p-5 transition-colors hover:bg-mint-600"
				>
					<p class="font-serif text-xl font-semibold">{link.title}</p>
					<p class="mt-1 text-sm text-black/65">{link.text}</p>
				</a>
			{/each}
		</div>
	</section>
</div>
