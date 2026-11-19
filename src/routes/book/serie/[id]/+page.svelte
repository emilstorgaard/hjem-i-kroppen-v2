<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import LoginForm from '$lib/components/booking/LoginForm.svelte';
	import PageShell from '$lib/components/booking/PageShell.svelte';
	import { CATEGORY_LABEL, CATEGORY_STYLE } from '$lib/booking/categories';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { SPOTS_TONE_CLASS, spotsLabel } from '$lib/booking/spots';
	import {
		dateKeyOf,
		formatDate,
		formatDateTime,
		formatTimeRange,
		formatWeekdayDate,
		isoWeekString
	} from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const series = $derived(data.series);
	const upcoming = $derived(series.sessions.filter((s) => !s.hasStarted));
	const bookedUpcoming = $derived(upcoming.filter((s) => data.booked[s.id]).length);
	const allBooked = $derived(upcoming.length > 0 && bookedUpcoming === upcoming.length);
	const spots = $derived(spotsLabel(series.availableSpots));
	const bookResult = $derived(resultFor(form, 'book'));
	const cancelResult = $derived(resultFor(form, 'cancel'));
	const fullSession = $derived(
		bookResult && !bookResult.success && typeof bookResult.parameters?.sessionId === 'string'
			? bookResult.parameters.sessionId
			: null
	);
	let pending = $state(false);

	const dateRange = $derived(
		series.firstStartsAt && series.lastEndsAt
			? `${formatDate(series.firstStartsAt)} – ${formatDate(series.lastEndsAt)}`
			: undefined
	);
	const calendarHref = (sessionId: string, startsAt: string) =>
		`/book?uge=${isoWeekString(dateKeyOf(startsAt))}&session=${sessionId}`;
</script>

<SeoHead
	seo={{
		metaTitle: `${series.title} | Book forløb | Hjem i Kroppen`,
		metaDescription: `${series.serviceTypeName}: ${series.sessions.length} gange${dateRange ? `, ${dateRange}` : ''}.`
	}}
/>

<PageShell
	eyebrow="{CATEGORY_LABEL[series.category]} · Forløb"
	title={series.title}
	intro="{series.serviceTypeName}{dateRange ? ` · ${dateRange}` : ''}"
>
	<div class="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
		<section aria-labelledby="sessions-heading">
			<h2 id="sessions-heading" class="font-serif text-2xl font-semibold">
				Forløbets {series.sessions.length} tider
			</h2>
			<ol class="mt-5 flex flex-col gap-3">
				{#each series.sessions as session, i (session.id)}
					{@const s = spotsLabel(session.availableSpots)}
					{@const booked = !!data.booked[session.id]}
					<li
						class="flex flex-col gap-3 rounded-3xl p-5 ring-1 sm:flex-row sm:items-center sm:justify-between {session.hasStarted
							? 'bg-black/[0.03] text-black/45 ring-black/5'
							: booked
								? 'bg-mint-200/50 ring-mint-700/25'
								: CATEGORY_STYLE[series.category].card} {fullSession === session.id
							? 'ring-2 ring-rust-700'
							: ''}"
					>
						<div class="flex items-start gap-4">
							<span
								class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-sm font-semibold tabular-nums ring-1 ring-black/10"
								>{i + 1}</span
							>
							<div>
								<p class="font-semibold capitalize">{formatWeekdayDate(session.startsAt)}</p>
								<p class="text-sm tabular-nums {session.hasStarted ? '' : 'text-black/65'}">
									kl. {formatTimeRange(session.startsAt, session.endsAt)}{session.location
										? ` · ${session.location}`
										: ''}
								</p>
								{#if session.notes}<p class="mt-1 text-sm text-black/55">{session.notes}</p>{/if}
							</div>
						</div>
						<div class="flex items-center gap-3 pl-12 sm:pl-0">
							{#if session.hasStarted}
								<span class="text-sm">Afholdt / i gang</span>
							{:else if booked}
								<span class="text-sm font-semibold text-mint-700">✓ Du er booket</span>
							{:else}
								<span class="text-sm {SPOTS_TONE_CLASS[s.tone]}">{s.text}</span>
								{#if session.availableSpots > 0}
									<a
										href={calendarHref(session.id, session.startsAt)}
										class="text-sm font-semibold text-mint-700 underline-offset-4 hover:underline"
									>
										Book kun denne
									</a>
								{/if}
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		</section>

		<aside
			class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10 lg:sticky lg:top-[calc(var(--header-h,4.5rem)+1.5rem)]"
		>
			<p class="text-sm font-medium tracking-[0.3em] text-black/55 uppercase">Hele forløbet</p>
			<p class="mt-2 font-serif text-3xl font-semibold">
				{upcoming.length}
				{upcoming.length === 1 ? 'kommende tid' : 'kommende tider'}
			</p>
			{#if series.isBookable}
				<p class="mt-1 text-sm {SPOTS_TONE_CLASS[spots.tone]}">{spots.text}</p>
			{/if}

			<div class="mt-6 flex flex-col gap-4">
				{#if cancelResult?.message && !cancelResult.success}<Alert
						message={cancelResult.message}
					/>{/if}
				{#if !series.isBookable}
					<Alert tone="info" message="Forløbet har ingen kommende tider." />
				{:else if allBooked}
					<Alert tone="success" message="Du er booket på alle forløbets kommende tider." />
				{:else if !data.user}
					<p class="text-sm text-black/65">
						Log ind for at booke hele forløbet. Du kommer direkte tilbage hertil.
					</p>
					<LoginForm
						redirectTo={page.url.pathname}
						result={resultFor(form, 'login')}
						registerHref="/opret-bruger?redirectTo={encodeURIComponent(page.url.pathname)}"
					/>
				{:else if series.availableSpots <= 0}
					<Alert
						tone="info"
						message="Mindst én af forløbets kommende tider er fuldt booket, så hele forløbet kan ikke bookes lige nu."
					/>
				{:else}
					<form
						method="POST"
						action="?/bookSeries"
						class="flex flex-col gap-4"
						use:enhance={feedback({ pending: (v) => (pending = v) })}
					>
						<input type="hidden" name="seriesId" value={series.id} />
						{#if bookResult?.message && !bookResult.success}
							<Alert>
								{bookResult.message}
								{#if typeof bookResult.parameters?.startsAt === 'string'}
									<br /><span class="text-black/70"
										>Det gælder tiden {formatDateTime(bookResult.parameters.startsAt)}.</span
									>
								{/if}
							</Alert>
						{/if}
						{#if bookedUpcoming > 0}
							<p class="text-sm text-black/65">
								Du er allerede booket på {bookedUpcoming} af tiderne. De springes over.
							</p>
						{/if}
						<div class="flex flex-col gap-1.5">
							<label for="series-note" class="text-sm font-medium text-black/80"
								>Besked til terapeuten <span class="font-normal text-black/50">(valgfri)</span
								></label
							>
							<textarea
								id="series-note"
								name="note"
								rows="3"
								maxlength="1000"
								class="field-input resize-y"
								value={bookResult?.values?.note ?? ''}></textarea>
							{#if fieldError(bookResult, 'note')}<p class="text-xs font-medium text-rust-700">
									{fieldError(bookResult, 'note')}
								</p>{/if}
						</div>
						<Button type="submit" size="lg" full loading={pending}>Book hele forløbet</Button>
						<p class="text-xs leading-relaxed text-black/55">
							Alle kommende tider bookes på én gang. Er én af dem fuldt booket, bookes ingen af dem.
						</p>
					</form>
				{/if}

				{#if data.user && bookedUpcoming > 0}
					<ConfirmDialog
						action="?/cancelSeries"
						fields={{ seriesId: series.id }}
						title="Aflys hele forløbet?"
						message="Alle dine kommende tider i forløbet bliver aflyst. Tider, der allerede er startet, berøres ikke."
						confirmLabel="Aflys mine tider i forløbet"
						variant="ghost"
						size="md"
						class="w-full"
					/>
				{/if}
			</div>
		</aside>
	</div>

	<p class="mt-10">
		<a href="/book" class="text-sm font-semibold text-mint-700 underline-offset-4 hover:underline"
			>← Tilbage til kalenderen</a
		>
	</p>
</PageShell>
