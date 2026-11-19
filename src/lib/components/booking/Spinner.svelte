<script lang="ts">
	let { class: className = 'h-5 w-5' }: { class?: string } = $props();
</script>

<svg
	class="motion-safe:animate-spin {className}"
	viewBox="0 0 24 24"
	fill="none"
	aria-hidden="true"
>
	<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
	<path
		d="M22 12a10 10 0 0 0-10-10"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
	/>
</svg>
