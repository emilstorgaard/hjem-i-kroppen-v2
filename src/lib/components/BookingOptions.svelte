<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { BookingOption } from '$lib/types/bookingOption';

	let { options }: { options: BookingOption[] } = $props();
</script>

<section aria-labelledby="booking-options-heading" class="bg-white px-6 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-4xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Hold</p>
			<h2
				id="booking-options-heading"
				class="mt-4 font-serif text-3xl font-semibold text-black sm:text-4xl lg:text-5xl"
			>
				Vælg hold og book
			</h2>
		</div>

		<ul class="mt-10 flex flex-col gap-4 lg:mt-14 lg:gap-6">
			{#each options as option, i (option.title)}
				<li
					use:reveal={{ delay: i * 120 }}
					class="flex flex-col gap-5 rounded-3xl bg-mint-600/40 p-6 text-black ring-1 ring-black/10 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8"
				>
					<h3 class="font-serif text-xl font-semibold lg:text-2xl">{option.title}</h3>
					<!-- TODO: Connect to the booking system. Intentionally inactive for now. -->
					<button
						type="button"
						aria-label="Book {option.title}"
						class="inline-flex shrink-0 items-center justify-center rounded-full bg-mint-700 px-8 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 active:scale-95"
					>
						Book
					</button>
				</li>
			{/each}
		</ul>
	</div>
</section>
