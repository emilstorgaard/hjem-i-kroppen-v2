<script lang="ts">
	let { label, value, hint }: { label: string; value: string | number; hint?: string } = $props();
</script>

<div class="rounded-3xl bg-white p-5 ring-1 ring-black/10">
	<p class="text-xs font-medium tracking-[0.2em] text-black/55 uppercase">{label}</p>
	<p class="mt-2 font-serif text-4xl font-semibold text-black tabular-nums">{value}</p>
	{#if hint}<p class="mt-1 text-xs text-black/55">{hint}</p>{/if}
</div>
