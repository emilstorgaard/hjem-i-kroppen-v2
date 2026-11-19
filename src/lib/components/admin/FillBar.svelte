<script lang="ts">
	/** Bookings vs capacity as a small bar with "3/8". */
	let {
		booked,
		capacity,
		cancelled = false
	}: { booked: number; capacity: number; cancelled?: boolean } = $props();

	const ratio = $derived(capacity > 0 ? Math.min(1, booked / capacity) : 0);
	const color = $derived(
		cancelled
			? 'bg-black/20'
			: ratio >= 1
				? 'bg-rust-700'
				: ratio >= 0.75
					? 'bg-mint-700'
					: 'bg-mint-400'
	);
</script>

<div class="flex items-center gap-2" title="{booked} af {capacity} pladser booket">
	<div class="h-1.5 w-16 overflow-hidden rounded-full bg-black/10" aria-hidden="true">
		<div class="h-full rounded-full {color}" style="width: {ratio * 100}%"></div>
	</div>
	<span class="text-xs text-black/70 tabular-nums"
		>{booked}/{capacity}<span class="sr-only"> pladser booket</span></span
	>
</div>
