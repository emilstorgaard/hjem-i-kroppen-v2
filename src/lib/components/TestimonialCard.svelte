<script lang="ts">
	import type { Testimonial } from '$lib/types/testimonial';

	let { testimonial }: { testimonial: Testimonial } = $props();
</script>

{#snippet stars(rating: number)}
	<div class="flex gap-1 text-rust-700" role="img" aria-label="{rating} ud af 5 stjerner">
		{#each { length: 5 } as _, i (i)}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill={i < rating ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="1"
				aria-hidden="true"
				class="h-5 w-5"
			>
				<path
					d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77-4.19-4.08 5.79-.84L10 1.5z"
				/>
			</svg>
		{/each}
	</div>
{/snippet}

<figure
	class="flex h-full flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
>
	{@render stars(testimonial.rating)}
	<blockquote class="mt-5 flex-1 text-lg leading-relaxed text-black/80 italic">
		&laquo;{testimonial.quote}&raquo;
	</blockquote>
	<figcaption class="mt-6 text-sm font-medium tracking-wide text-black/60 uppercase">
		{testimonial.name}
	</figcaption>
</figure>
