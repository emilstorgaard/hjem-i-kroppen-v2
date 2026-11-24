<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { tick } from 'svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import MiniMonth from '$lib/components/booking/MiniMonth.svelte';
	import PageShell from '$lib/components/booking/PageShell.svelte';
	import SessionCard from '$lib/components/booking/SessionCard.svelte';
	import SessionSheet from '$lib/components/booking/SessionSheet.svelte';
	import { resultFor } from '$lib/booking/forms';
	import { actionUrl, withParams } from '$lib/booking/url';
	import {
		addDays,
		dateKeyOf,
		dayOfMonth,
		formatDayLong,
		formatWeekLabel,
		formatWeekdayShort,
		isoWeekString,
		startOfWeek,
		weekDays
	} from '$lib/utils/date';
	import type { SessionResponse } from '$lib/types/booking';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const days = $derived(weekDays(data.monday));
	const sessionsByDay = $derived.by(() => {
		const map: Record<string, SessionResponse[]> = Object.fromEntries(days.map((d) => [d, []]));
		for (const s of data.sessions) map[dateKeyOf(s.startsAt)]?.push(s);
		return map;
	});

	const isCurrentWeek = $derived(data.monday === startOfWeek(data.today));
	const prevWeek = $derived(isoWeekString(addDays(data.monday, -7)));
	const nextWeek = $derived(isoWeekString(addDays(data.monday, 7)));
	const prevDisabled = $derived(addDays(data.monday, 6) < data.today);

	const weekHref = (week: string | null) =>
		withParams(page.url, { uge: week, session: null, dag: null });
	const dayWeekHref = (day: string) => weekHref(isoWeekString(day));
	const filterHref = (changes: Record<string, string | null>) =>
		withParams(page.url, { ...changes, session: null, dag: null });

	const categoryServiceTypes = $derived(
		data.filters.kategori
			? data.serviceTypes
					.filter((t) => t.category.slug === data.filters.kategori)
					.sort((a, b) => a.sortOrder - b.sortOrder)
			: []
	);

	// The open session lives in `?session=` so the sheet works without JS, can be shared and survives login.
	const selectedId = $derived(page.url.searchParams.get('session'));
	const selected = $derived(
		selectedId
			? (data.sessions.find((s) => s.id === selectedId) ??
					(data.selected?.id === selectedId ? data.selected : null))
			: null
	);
	const sessionHref = (id: string) => withParams(page.url, { session: id });
	const resumeHref = $derived(
		selectedId ? withParams(page.url, { session: selectedId }) : withParams(page.url, {})
	);

	function isPlainClick(event: MouseEvent) {
		return (
			event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
		);
	}

	function openSession(event: MouseEvent, id: string) {
		if (!isPlainClick(event)) return;
		event.preventDefault();
		goto(sessionHref(id), { noScroll: true, keepFocus: true });
	}

	function closeSheet() {
		goto(withParams(page.url, { session: null }), {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}

	// Mobile: one day at a time, chosen with `?dag=` (not read by the load, so switching days is instant).
	const selectedDay = $derived.by(() => {
		const dag = page.url.searchParams.get('dag');
		if (dag && days.includes(dag)) return dag;
		if (days.includes(data.today)) return data.today;
		return days.find((d) => sessionsByDay[d].length > 0) ?? days[0];
	});
	const dayHref = (day: string) => withParams(page.url, { dag: day, session: null });
	let dayTabs: HTMLElement | undefined = $state();

	async function selectDay(day: string, focus = false) {
		await goto(dayHref(day), { noScroll: true, keepFocus: true, replaceState: true });
		if (focus) {
			await tick();
			dayTabs?.querySelector<HTMLElement>(`[data-day-tab="${day}"]`)?.focus();
		}
	}

	function onDayTabKeydown(event: KeyboardEvent) {
		const index = days.indexOf(selectedDay);
		const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: 6 }[event.key];
		if (target === undefined) return;
		event.preventDefault();
		selectDay(days[Math.max(0, Math.min(6, target))], true);
	}

	// Desktop: arrow keys move between session cards, left/right across days.
	function onGridKeydown(event: KeyboardEvent) {
		const card = (event.target as HTMLElement).closest<HTMLElement>('[data-session-card]');
		if (!card || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
		const grid = event.currentTarget as HTMLElement;
		const day = Number(card.dataset.day);
		const index = Number(card.dataset.card);
		const at = (d: number, i: number) =>
			grid.querySelector<HTMLElement>(`[data-session-card][data-day="${d}"][data-card="${i}"]`);
		let next: HTMLElement | null = null;
		if (event.key === 'ArrowDown') next = at(day, index + 1);
		if (event.key === 'ArrowUp') next = at(day, index - 1);
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		for (let d = day + step; step !== 0 && d >= 0 && d <= 6 && !next; d += step) {
			const count = sessionsByDay[days[d]].length;
			if (count > 0) next = at(d, Math.min(index, count - 1));
		}
		if (next) {
			event.preventDefault();
			next.focus();
		}
	}

	// Skeletons only while the week or filters change, not when the sheet opens.
	const loadKey = (url: URL) =>
		['uge', 'kategori', 'ydelse', 'ledige'].map((k) => url.searchParams.get(k) ?? '').join('|');
	const loading = $derived(
		!!navigating.to &&
			navigating.to.route.id === '/book' &&
			loadKey(navigating.to.url) !== loadKey(page.url)
	);

	// Prefetch the next week so paging forward feels instant.
	$effect(() => {
		preloadData(weekHref(nextWeek)).catch(() => {});
	});

	const bookingResult = $derived(resultFor(form, 'book') ?? resultFor(form, 'cancel'));
</script>

<SeoHead
	seo={{
		metaTitle: 'Book tid | Hjem i Kroppen',
		metaDescription:
			'Find en ledig tid til danseterapi, samtaleterapi eller gruppeterapi og book direkte.'
	}}
/>

<PageShell
	eyebrow="Book tid"
	title="Find en tid, der passer dig"
	intro="Vælg en tid i kalenderen. Du kan booke en enkelt gang eller et helt forløb, og du kan altid aflyse frem til tiden starter."
	width="xl"
>
	<!-- Filters -->
	<div class="flex flex-col gap-4">
		<div
			class="no-scrollbar -mx-6 -my-1.5 flex gap-2 overflow-x-auto px-6 py-1.5 lg:-mx-1 lg:flex-wrap lg:px-1"
			role="group"
			aria-label="Filtrer efter terapiform"
		>
			<a
				href={filterHref({ kategori: null, ydelse: null })}
				aria-current={!data.filters.kategori ? 'true' : undefined}
				class="chip {!data.filters.kategori ? 'chip-active' : ''}">Alle</a
			>
			{#each data.categories as category (category.id)}
				{@const active = data.filters.kategori === category.slug}
				<a
					href={filterHref({ kategori: category.slug, ydelse: null })}
					aria-current={active ? 'true' : undefined}
					class="chip {active ? 'chip-active' : ''}"
				>
					{category.name}
				</a>
			{/each}
			<a
				href={filterHref({ ledige: data.filters.onlyAvailable ? null : '1' })}
				class="chip ml-auto shrink-0 {data.filters.onlyAvailable ? 'chip-active' : ''}"
				aria-label="Kun ledige tider: {data.filters.onlyAvailable ? 'til' : 'fra'}"
			>
				<span
					class="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors {data
						.filters.onlyAvailable
						? 'bg-white/40'
						: 'bg-black/15'}"
					aria-hidden="true"
				>
					<span
						class="absolute h-3 w-3 rounded-full bg-white shadow transition-all {data.filters
							.onlyAvailable
							? 'left-3.5'
							: 'left-0.5'}"
					></span>
				</span>
				Kun ledige tider
			</a>
		</div>

		{#if categoryServiceTypes.length > 1}
			<div
				class="no-scrollbar -mx-6 -my-1.5 flex gap-2 overflow-x-auto px-6 py-1.5 lg:-mx-1 lg:flex-wrap lg:px-1"
				role="group"
				aria-label="Filtrer efter ydelse"
			>
				<a
					href={filterHref({ ydelse: null })}
					class="chip chip-sm {!data.filters.ydelse ? 'chip-active' : ''}">Alle ydelser</a
				>
				{#each categoryServiceTypes as type (type.id)}
					<a
						href={filterHref({ ydelse: type.id })}
						aria-current={data.filters.ydelse === type.id ? 'true' : undefined}
						class="chip chip-sm {data.filters.ydelse === type.id ? 'chip-active' : ''}"
						>{type.name}</a
					>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-8 grid gap-8 xl:grid-cols-[17rem_1fr]">
		<aside class="hidden flex-col gap-4 xl:flex" aria-label="Vælg uge">
			<MiniMonth monday={data.monday} today={data.today} weekHref={dayWeekHref} />
			<div class="rounded-3xl bg-mint-600/50 p-5 text-sm text-black/70">
				<p class="font-serif text-lg font-semibold text-black">Godt at vide</p>
				<p class="mt-2 leading-relaxed">Du kan aflyse din booking, indtil tiden starter.</p>
			</div>
		</aside>

		<div class="min-w-0">
			<!-- Week navigation -->
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="font-serif text-2xl font-semibold text-black" aria-live="polite">
					{formatWeekLabel(data.monday)}
				</h2>
				<nav class="flex items-center gap-2" aria-label="Skift uge">
					{#if !isCurrentWeek}
						<a href={weekHref(null)} class="chip chip-sm">I dag</a>
					{/if}
					{#if prevDisabled}
						<span class="week-arrow opacity-30" aria-hidden="true">‹</span>
					{:else}
						<a href={weekHref(prevWeek)} class="week-arrow" aria-label="Forrige uge">‹</a>
					{/if}
					<a href={weekHref(nextWeek)} class="week-arrow" aria-label="Næste uge">›</a>
				</nav>
			</div>

			{#if data.loadError}
				<div class="mt-6 rounded-3xl bg-rust-100/50 p-8 text-center ring-1 ring-rust-700/15">
					<p class="font-serif text-2xl font-semibold">Kalenderen kunne ikke hentes</p>
					<p class="mt-2 text-black/70">{data.loadError}</p>
					<Button href={withParams(page.url, {})} variant="secondary" class="mt-5">Prøv igen</Button
					>
				</div>
			{:else}
				<!-- Desktop: week grid -->
				<div
					class="mt-6 hidden grid-cols-7 gap-3 lg:grid"
					role="presentation"
					onkeydown={onGridKeydown}
				>
					{#each days as day, dayIndex (day)}
						{@const past = day < data.today}
						{@const isToday = day === data.today}
						<section
							aria-labelledby="day-{day}"
							class="flex min-w-0 flex-col gap-2 {past ? 'opacity-45' : ''}"
						>
							<h3
								id="day-{day}"
								class="flex flex-col items-center rounded-2xl py-2 {isToday
									? 'bg-mint-700 text-white'
									: 'bg-mint-600/50 text-black'}"
							>
								<span
									class="text-xs font-medium tracking-[0.2em] uppercase {isToday
										? 'text-white/80'
										: 'text-black/55'}">{formatWeekdayShort(day)}</span
								>
								<span class="font-serif text-2xl leading-tight font-semibold"
									>{dayOfMonth(day)}</span
								>
								<span class="sr-only">{formatDayLong(day)}{isToday ? ', i dag' : ''}</span>
							</h3>
							{#if loading}
								{#each [0, 1] as i (i)}<div
										class="skeleton h-28 rounded-2xl bg-black/5"
									></div>{/each}
							{:else}
								{#each sessionsByDay[day] as session, cardIndex (session.id)}
									<SessionCard
										{session}
										href={sessionHref(session.id)}
										booked={!!data.booked[session.id]}
										compact
										{dayIndex}
										{cardIndex}
										onopen={(e) => openSession(e, session.id)}
									/>
								{:else}
									<p class="py-6 text-center text-xs text-black/30">{past ? '' : '–'}</p>
								{/each}
							{/if}
						</section>
					{/each}
				</div>

				<!-- Mobile: day strip + list -->
				<div class="mt-5 lg:hidden">
					<div
						bind:this={dayTabs}
						class="grid grid-cols-7 gap-1.5"
						role="tablist"
						aria-label="Vælg dag"
						tabindex="-1"
						onkeydown={onDayTabKeydown}
					>
						{#each days as day (day)}
							{@const active = day === selectedDay}
							{@const count = sessionsByDay[day].length}
							<a
								href={dayHref(day)}
								role="tab"
								data-day-tab={day}
								aria-selected={active}
								aria-controls="day-panel"
								tabindex={active ? 0 : -1}
								aria-label="{formatDayLong(day)}{day === data.today
									? ', i dag'
									: ''}, {count} {count === 1 ? 'tid' : 'tider'}"
								onclick={(e) => {
									if (!isPlainClick(e)) return;
									e.preventDefault();
									selectDay(day);
								}}
								class="flex flex-col items-center rounded-2xl py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700
									{active
									? 'bg-mint-700 text-white shadow-sm'
									: day === data.today
										? 'bg-mint-200 text-mint-700'
										: 'bg-mint-600/50 text-black'}
									{day < data.today && !active ? 'opacity-45' : ''}"
							>
								<span
									class="text-[10px] font-medium tracking-widest uppercase {active
										? 'text-white/80'
										: 'text-black/55'}">{formatWeekdayShort(day).slice(0, 2)}</span
								>
								<span class="font-serif text-xl leading-tight font-semibold">{dayOfMonth(day)}</span
								>
								<span
									class="mt-0.5 h-1.5 w-1.5 rounded-full {count > 0
										? active
											? 'bg-white'
											: 'bg-mint-700'
										: 'bg-transparent'}"
									aria-hidden="true"
								></span>
							</a>
						{/each}
					</div>

					<div
						id="day-panel"
						role="tabpanel"
						aria-label={formatDayLong(selectedDay)}
						class="mt-5 flex flex-col gap-3"
					>
						<p class="text-sm font-medium text-black/60 capitalize">{formatDayLong(selectedDay)}</p>
						{#if loading}
							{#each [0, 1, 2] as i (i)}<div
									class="skeleton h-28 rounded-2xl bg-black/5"
								></div>{/each}
						{:else}
							{#each sessionsByDay[selectedDay] as session (session.id)}
								<SessionCard
									{session}
									href={sessionHref(session.id)}
									booked={!!data.booked[session.id]}
									onopen={(e) => openSession(e, session.id)}
								/>
							{:else}
								{#if data.sessions.length > 0}
									<p class="rounded-2xl bg-mint-600/40 px-4 py-6 text-center text-sm text-black/60">
										Ingen tider denne dag.
									</p>
								{/if}
							{/each}
						{/if}
					</div>
				</div>

				{#if !loading && data.sessions.length === 0}
					<div class="mt-6 rounded-3xl bg-mint-600/50 px-6 py-12 text-center ring-1 ring-black/5">
						<p class="font-serif text-2xl font-semibold text-black sm:text-3xl">
							Ingen ledige tider i denne uge
						</p>
						{#if data.nextAvailableWeek}
							<p class="mt-2 text-black/65">Men der er ledige tider senere.</p>
							<Button href={weekHref(data.nextAvailableWeek)} size="lg" class="mt-6"
								>Gå til næste ledige tid</Button
							>
						{:else}
							<p class="mx-auto mt-2 max-w-md text-black/65">
								Der er ingen kommende tider lige nu. Skriv eller ring gerne, så finder vi en tid
								sammen.
							</p>
							<Button href="/#kontakt" variant="secondary" class="mt-6">Kontakt mig</Button>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</PageShell>

<SessionSheet
	session={selected}
	user={data.user}
	bookingId={selected ? data.booked[selected.id] : undefined}
	seriesBooked={!!selected?.seriesId && data.bookedSeries.includes(selected.seriesId)}
	result={bookingResult}
	loginResult={resultFor(form, 'login')}
	registerResult={resultFor(form, 'register')}
	{resumeHref}
	closeHref={withParams(page.url, { session: null })}
	onclose={closeSheet}
	actionHref={(name) => actionUrl(page.url, name)}
/>
