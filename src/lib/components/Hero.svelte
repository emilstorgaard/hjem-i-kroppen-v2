<script lang="ts">
	import type { HeroProperties } from '$lib/types/hero';

	let { hero }: { hero: HeroProperties } = $props();

	const h = $derived(hero);
</script>

<section
	id="top"
	class="relative flex min-h-svh flex-col overflow-hidden bg-sand-900"
	style="padding-top: var(--header-h, 4.5rem)"
>
	<video
		class="hero-video absolute inset-0 h-full w-full object-cover"
		autoplay
		muted
		loop
		playsinline
		aria-hidden="true"
	>
		<source src="/hero.mp4" type="video/mp4" />
	</video>
	<div
		class="absolute inset-0 bg-linear-to-b from-sand-900/70 via-sand-900/50 to-sand-900/80"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center [@media(min-width:1280px)_and_(min-height:800px)]:max-w-6xl"
	>
		<img
			src="/logo.jpg"
			alt="Hjem i Kroppen logo"
			class="hero-in mb-4 h-14 w-14 rounded-full object-cover shadow-lg ring-4 ring-sand-50 sm:mb-6 sm:h-24 sm:w-24 md:mb-8 md:h-28 md:w-28 [@media(min-width:1280px)_and_(min-height:800px)]:h-36 [@media(min-width:1280px)_and_(min-height:800px)]:w-36"
			style="animation-delay: 100ms"
		/>

		<p
			class="hero-in text-xs font-medium tracking-[0.3em] text-sand-200 uppercase sm:text-sm [@media(min-width:1280px)_and_(min-height:800px)]:text-base"
			style="animation-delay: 220ms"
		>
			Danse- og bevægelsesterapi
		</p>

		<h1
			class="hero-in mt-3 font-serif text-3xl leading-tight font-semibold text-sand-50 sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl [@media(min-width:1280px)_and_(min-height:800px)]:text-8xl"
			style="animation-delay: 340ms"
		>
			{h.heroTitle}
		</h1>

		<p
			class="hero-in mt-4 max-w-2xl text-base leading-relaxed text-sand-100 sm:mt-6 sm:text-lg lg:text-xl [@media(min-width:1280px)_and_(min-height:800px)]:max-w-3xl [@media(min-width:1280px)_and_(min-height:800px)]:text-2xl"
			style="animation-delay: 460ms"
		>
			Hjem i Kroppen er et rum for dans, bevægelse og nærvær, hvor du kan mærke efter og finde ro,
			glæde og forbindelse til dig selv &mdash; i dit eget tempo.
		</p>

		<div
			class="hero-in mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4 md:mt-12 [@media(min-width:1280px)_and_(min-height:800px)]:gap-5"
			style="animation-delay: 580ms"
		>
			<a
				href="#tilbud"
				class="rounded-full border border-sand-200/70 px-8 py-3 text-base font-medium text-sand-50 transition-all duration-300 hover:scale-[1.03] hover:bg-sand-50/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-100 active:scale-95 sm:py-3.5 [@media(min-width:1280px)_and_(min-height:800px)]:px-10 [@media(min-width:1280px)_and_(min-height:800px)]:py-4 [@media(min-width:1280px)_and_(min-height:800px)]:text-lg"
			>
				Se mine tilbud
			</a>
		</div>
	</div>

	<div
		class="relative hidden justify-center pb-6 [@media(min-width:640px)_and_(min-height:760px)]:flex"
	>
		<a
			href="#om-mig"
			aria-label="Scroll ned"
			class="text-sand-100 transition-colors hover:text-sand-50"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6 animate-bounce"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
			</svg>
		</a>
	</div>
</section>
