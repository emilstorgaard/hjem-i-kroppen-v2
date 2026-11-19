<script lang="ts">
	import {
		addDays,
		addMonths,
		dayOfMonth,
		formatDayLong,
		formatMonthYear,
		isoWeek,
		startOfMonth,
		startOfWeek,
		weekdayIndex
	} from '$lib/utils/date';

	type Props = {
		/** Monday of the week shown in the calendar. */
		monday: string;
		today: string;
		/** Link to the week containing a day. */
		weekHref: (day: string) => string;
	};

	let { monday, today, weekHref }: Props = $props();

	const WEEKDAYS = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];

	// Follows the shown week, but the arrows can browse other months without changing it.
	let month = $derived(startOfMonth(addDays(monday, 3)));

	const weeks = $derived.by(() => {
		const first = startOfWeek(month);
		const rows: { week: number; days: string[] }[] = [];
		for (let w = 0; w < 6; w++) {
			const start = addDays(first, w * 7);
			if (w > 0 && start.slice(0, 7) !== month.slice(0, 7)) break;
			rows.push({
				week: isoWeek(start).week,
				days: Array.from({ length: 7 }, (_, i) => addDays(start, i))
			});
		}
		return rows;
	});

	const currentMonday = $derived(monday);
</script>

<div class="rounded-3xl bg-white p-5 ring-1 ring-black/10">
	<div class="flex items-center justify-between">
		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-mint-700"
			aria-label="Forrige måned"
			onclick={() => (month = addMonths(month, -1))}>‹</button
		>
		<p class="font-serif text-lg font-semibold capitalize" aria-live="polite">
			{formatMonthYear(month)}
		</p>
		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-mint-700"
			aria-label="Næste måned"
			onclick={() => (month = addMonths(month, 1))}>›</button
		>
	</div>
	<table class="mt-3 w-full text-center text-xs">
		<caption class="sr-only">Vælg uge</caption>
		<thead>
			<tr class="text-black/45">
				<th scope="col" class="py-1 font-medium"><span class="sr-only">Uge</span></th>
				{#each WEEKDAYS as d (d)}<th scope="col" class="py-1 font-medium">{d}</th>{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as row (row.days[0])}
				{@const active = row.days[0] === currentMonday}
				<tr>
					<td class="pr-1 text-[10px] text-black/35 tabular-nums">{row.week}</td>
					{#each row.days as day (day)}
						{@const outside = day.slice(0, 7) !== month.slice(0, 7)}
						{@const past = day < today}
						<td class="p-0.5">
							<a
								href={weekHref(day)}
								aria-label={formatDayLong(day)}
								aria-current={day === today ? 'date' : undefined}
								class="flex h-8 w-full items-center justify-center tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-mint-700
									{active ? 'bg-mint-600' : 'hover:bg-black/5'}
									{active && weekdayIndex(day) === 0 ? 'rounded-l-full' : ''}
									{active && weekdayIndex(day) === 6 ? 'rounded-r-full' : ''}
									{!active ? 'rounded-full' : ''}
									{outside ? 'text-black/25' : past ? 'text-black/40' : 'text-black/80'}"
							>
								<span
									class={day === today
										? 'flex h-7 w-7 items-center justify-center rounded-full bg-mint-700 font-semibold text-white'
										: ''}
								>
									{dayOfMonth(day)}
								</span>
							</a>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
