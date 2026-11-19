<script lang="ts">
	type Props = {
		page: number;
		totalPages: number;
		/** Builds the link for a page, keeping the other query parameters. */
		href: (page: number) => string;
		label?: string;
	};

	let { page, totalPages, href, label = 'Sider' }: Props = $props();

	const pages = $derived.by(() => {
		const set = new Set(
			[1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages)
		);
		const sorted = [...set].sort((a, b) => a - b);
		const out: (number | 'gap')[] = [];
		for (const p of sorted) {
			const last = out.at(-1);
			if (typeof last === 'number' && p - last > 1) out.push('gap');
			out.push(p);
		}
		return out;
	});

	const linkClass =
		'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700';
</script>

{#if totalPages > 1}
	<nav aria-label={label} class="flex flex-wrap items-center justify-center gap-1">
		{#if page > 1}
			<a href={href(page - 1)} class="{linkClass} text-black/70 hover:bg-black/5" rel="prev"
				>Forrige</a
			>
		{/if}
		{#each pages as p, i (typeof p === 'number' ? p : `gap-${i}`)}
			{#if p === 'gap'}
				<span class="px-1 text-black/40" aria-hidden="true">…</span>
			{:else if p === page}
				<span class="{linkClass} bg-mint-700 font-semibold text-white" aria-current="page">{p}</span
				>
			{:else}
				<a href={href(p)} class="{linkClass} text-black/70 hover:bg-black/5" aria-label="Side {p}"
					>{p}</a
				>
			{/if}
		{/each}
		{#if page < totalPages}
			<a href={href(page + 1)} class="{linkClass} text-black/70 hover:bg-black/5" rel="next"
				>Næste</a
			>
		{/if}
	</nav>
{/if}
