<script lang="ts">
	import type { Testimonial } from '$lib/types/testimonial';
	import TestimonialCard from '$lib/components/TestimonialCard.svelte';
	import { reveal } from '$lib/actions/reveal';
	let { testimonials }: { testimonials: Testimonial[] } = $props();

	const N = $derived(testimonials.length);
	const isCarousel = $derived(N > 1);
	const gridOnDesktop = $derived(N <= 3);
	const autoplayDelay = 3000;

	let activeIndex = $state(0);
	let regionEl: HTMLDivElement | undefined = $state();
	let isPaused = $state(false);
	let isInView = $state(false);
	let autoplayTimeout: ReturnType<typeof setTimeout> | undefined;

	let cardsPerView = $state(1);

	$effect(() => {
		if (!isCarousel || typeof window === 'undefined') return;
		const mqSm = window.matchMedia('(min-width: 640px)');
		const mqLg = window.matchMedia('(min-width: 1024px)');
		const update = () => {
			cardsPerView = mqLg.matches ? 3 : mqSm.matches ? 2 : 1;
		};
		update();
		mqSm.addEventListener('change', update);
		mqLg.addEventListener('change', update);
		return () => {
			mqSm.removeEventListener('change', update);
			mqLg.removeEventListener('change', update);
		};
	});

	const maxIndex = $derived(Math.max(0, N - cardsPerView));

	$effect(() => {
		if (activeIndex > maxIndex) activeIndex = maxIndex;
	});

	function goTo(index: number) {
		const count = maxIndex + 1;
		activeIndex = ((index % count) + count) % count;
		resetAutoplayTimer();
	}

	function next() {
		goTo(activeIndex + 1);
	}

	function prev() {
		goTo(activeIndex - 1);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prev();
		}
	}

	function resetAutoplayTimer() {
		clearTimeout(autoplayTimeout);
		if (!isCarousel || typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		autoplayTimeout = setTimeout(() => {
			if (!isPaused && isInView) {
				next();
			} else {
				resetAutoplayTimer();
			}
		}, autoplayDelay);
	}

	$effect(() => {
		if (!regionEl || typeof window === 'undefined') return;
		const observer = new IntersectionObserver(([entry]) => (isInView = entry.isIntersecting), {
			threshold: 0.4
		});
		observer.observe(regionEl);
		return () => observer.disconnect();
	});

	$effect(() => {
		resetAutoplayTimer();
		return () => clearTimeout(autoplayTimeout);
	});
</script>

<section
	id="anmeldelser"
	aria-labelledby="anmeldelser-heading"
	class="bg-rust-100 px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Anmeldelser</p>
			<h2
				class="mt-4 font-serif text-4xl font-semibold text-black sm:text-5xl"
				id="anmeldelser-heading"
			>
				Hvad kunderne siger
			</h2>
		</div>

		{#if isCarousel}
			<div
				bind:this={regionEl}
				class={['mt-16', gridOnDesktop && 'lg:hidden']}
				role="region"
				aria-roledescription="karrusel"
				aria-label="Anmeldelser"
				onmouseenter={() => (isPaused = true)}
				onmouseleave={() => (isPaused = false)}
				onfocusin={() => (isPaused = true)}
				onfocusout={() => (isPaused = false)}
			>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div
					onkeydown={handleKeydown}
					tabindex="0"
					role="group"
					aria-label="Brug piletasterne for at bladre i anmeldelser"
					class="-my-4 overflow-hidden focus:outline-none"
				>
					<div
						class="flex py-4 transition-transform duration-500 ease-out"
						style="transform: translateX(-{activeIndex * (100 / cardsPerView)}%)"
					>
						{#each testimonials as testimonial, i (testimonial.name)}
							<div
								class="shrink-0 px-3"
								style="flex: 0 0 {100 / cardsPerView}%"
								role="group"
								aria-roledescription="slide"
								aria-label="{i + 1} af {N}"
							>
								<TestimonialCard {testimonial} />
							</div>
						{/each}
					</div>
				</div>

				<div class="mt-8 flex items-center justify-center gap-6">
					<button
						type="button"
						onclick={prev}
						aria-label="Forrige anmeldelse"
						class="flex h-10 w-10 items-center justify-center rounded-full text-black/70 ring-1 ring-black/15 transition-colors hover:bg-rust-700/10 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 19.5 8.25 12l7.5-7.5"
							/>
						</svg>
					</button>

					<div class="flex items-center gap-2">
						{#each { length: maxIndex + 1 } as _, i (i)}
							<button
								type="button"
								onclick={() => goTo(i)}
								aria-label="Gå til anmeldelse {i + 1}"
								aria-current={i === activeIndex}
								class={[
									'h-2.5 rounded-full transition-all',
									i === activeIndex ? 'w-6 bg-rust-700' : 'w-2.5 bg-black/15 hover:bg-black/30'
								]}
							></button>
						{/each}
					</div>

					<button
						type="button"
						onclick={next}
						aria-label="Næste anmeldelse"
						class="flex h-10 w-10 items-center justify-center rounded-full text-black/70 ring-1 ring-black/15 transition-colors hover:bg-rust-700/10 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							class="h-5 w-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
						</svg>
					</button>
				</div>
			</div>
		{/if}

		{#if !isCarousel || gridOnDesktop}
			<div
				class={[
					'mt-16 gap-8',
					isCarousel ? 'hidden lg:grid lg:grid-cols-3' : 'grid md:grid-cols-3'
				]}
			>
				{#each testimonials as testimonial, i (testimonial.name)}
					<div use:reveal={{ delay: i * 120 }}>
						<TestimonialCard {testimonial} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
