<script lang="ts">
	import { CATEGORY_STYLE } from '$lib/booking/categories';
	import { SPOTS_TONE_CLASS, spotsLabel } from '$lib/booking/spots';
	import { formatTimeRange, formatWeekdayDate } from '$lib/utils/date';
	import type { SessionResponse } from '$lib/types/booking';

	type Props = {
		session: SessionResponse;
		href: string;
		booked?: boolean;
		compact?: boolean;
		onopen?: (event: MouseEvent) => void;
		/** For keyboard navigation inside the week grid. */
		dayIndex?: number;
		cardIndex?: number;
	};

	let {
		session,
		href,
		booked = false,
		compact = false,
		onopen,
		dayIndex,
		cardIndex
	}: Props = $props();

	const style = CATEGORY_STYLE;
	const spots = $derived(spotsLabel(session.availableSpots));
	const full = $derived(session.availableSpots <= 0 && !booked);
</script>

<a
	{href}
	onclick={onopen}
	data-session-card
	data-day={dayIndex}
	data-card={cardIndex}
	aria-label="{session.serviceTypeName}, {formatWeekdayDate(session.startsAt)} kl. {formatTimeRange(
		session.startsAt,
		session.endsAt
	)}. {booked ? 'Du er booket' : spots.text}"
	class="group relative block rounded-2xl p-3 ring-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 motion-safe:hover:-translate-y-0.5 {booked
		? 'bg-mint-700 text-white ring-mint-700 hover:ring-black'
		: style.card} {full ? 'opacity-60' : ''} {compact ? '' : 'sm:p-4'}"
>
	<div class="flex items-center justify-between gap-2">
		<p class="text-sm font-semibold tabular-nums">
			{formatTimeRange(session.startsAt, session.endsAt)}
		</p>
		<span class="h-2 w-2 shrink-0 rounded-full {booked ? 'bg-white' : style.dot}" aria-hidden="true"
		></span>
	</div>
	<p class="mt-1 font-serif text-lg leading-snug font-semibold">{session.serviceTypeName}</p>
	{#if !compact}
		<p class="text-xs {booked ? 'text-white/75' : 'text-black/55'}">
			{session.category.name}
		</p>
	{/if}
	{#if session.location}
		<p class="mt-1 flex items-center gap-1 text-xs {booked ? 'text-white/80' : 'text-black/60'}">
			<svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5 shrink-0" aria-hidden="true"
				><path
					fill-rule="evenodd"
					d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="truncate">{session.location}</span>
		</p>
	{/if}
	{#if session.seriesId}
		<p
			class="mt-2 inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium {booked
				? 'bg-white/15 text-white'
				: 'bg-white/70 text-black/70'}"
		>
			<span aria-hidden="true">↻</span>
			<span class="truncate">{session.seriesTitle ?? 'Forløb'}</span>
		</p>
	{/if}
	<p class="mt-2 text-xs {booked ? 'font-semibold text-white' : SPOTS_TONE_CLASS[spots.tone]}">
		{#if booked}✓ Du er booket{:else}{spots.text}{/if}
	</p>
</a>
