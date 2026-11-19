<script lang="ts">
	import { CATEGORY_LABEL, CATEGORY_STYLE } from '$lib/booking/categories';
	import { formatDateTime, formatTimeRange, formatWeekdayDate } from '$lib/utils/date';
	import type { BookingResponse } from '$lib/types/booking';
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';
	import ConfirmDialog from './ConfirmDialog.svelte';

	type Props = { booking: BookingResponse; cancellable?: boolean; now?: number };
	let { booking, cancellable = true, now = Date.now() }: Props = $props();

	const started = $derived(Date.parse(booking.startsAt) <= now);
</script>

<div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
	<div class="flex items-start gap-3">
		<span
			class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full {CATEGORY_STYLE[booking.category].dot}"
			aria-hidden="true"
		></span>
		<div>
			<p class="font-semibold capitalize">{formatWeekdayDate(booking.startsAt)}</p>
			<p class="text-sm text-black/65 tabular-nums">
				kl. {formatTimeRange(booking.startsAt, booking.endsAt)} · {booking.serviceTypeName}
				<span class="sr-only">({CATEGORY_LABEL[booking.category]})</span>
			</p>
			{#if booking.location}<p class="text-sm text-black/55">{booking.location}</p>{/if}
			{#if booking.note}<p class="mt-1 text-sm text-black/55 italic">"{booking.note}"</p>{/if}
		</div>
	</div>
	<div class="flex shrink-0 items-center gap-3 pl-5 sm:pl-0">
		{#if booking.status === 'Cancelled'}
			<Badge tone="muted">Aflyst</Badge>
		{:else if cancellable}
			{#if started}
				<span class="flex flex-col items-end gap-1 text-right">
					<Button size="sm" variant="secondary" disabled aria-describedby="started-{booking.id}"
						>Aflys</Button
					>
					<span id="started-{booking.id}" class="max-w-48 text-xs text-black/50"
						>Tiden er startet, så den kan ikke længere aflyses.</span
					>
				</span>
			{:else}
				<ConfirmDialog
					action="?/cancel"
					fields={{ bookingId: booking.id }}
					title="Aflys booking?"
					message="Vil du aflyse din booking {formatDateTime(
						booking.startsAt
					)}? Pladsen bliver frigivet til andre."
					confirmLabel="Aflys"
					label="Aflys"
				/>
			{/if}
		{:else}
			<Badge tone="mint">Gennemført</Badge>
		{/if}
	</div>
</div>
