<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	type Column = { label: string; class?: string; srOnly?: boolean };

	type Props = {
		columns: Column[];
		rows: T[];
		key: (row: T) => string;
		/** Renders the `<td>` cells of one row. */
		row: Snippet<[T]>;
		caption: string;
		empty?: string;
	};

	let { columns, rows, key, row, caption, empty = 'Ingen resultater.' }: Props = $props();
</script>

<div class="overflow-x-auto rounded-3xl bg-white ring-1 ring-black/10">
	<table class="min-w-full text-left text-sm">
		<caption class="sr-only">{caption}</caption>
		<thead class="bg-mint-600/50 text-xs tracking-wider text-black/60 uppercase">
			<tr>
				{#each columns as column (column.label)}
					<th scope="col" class="px-4 py-3 font-medium whitespace-nowrap {column.class ?? ''}">
						{#if column.srOnly}<span class="sr-only">{column.label}</span>{:else}{column.label}{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-black/5">
			{#each rows as item (key(item))}
				<tr class="align-top transition-colors hover:bg-mint-600/20">{@render row(item)}</tr>
			{:else}
				<tr
					><td colspan={columns.length} class="px-4 py-12 text-center text-black/50">{empty}</td
					></tr
				>
			{/each}
		</tbody>
	</table>
</div>
