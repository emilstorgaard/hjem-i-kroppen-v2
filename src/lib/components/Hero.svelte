<script lang="ts">
	import type { HeroProperties } from '$lib/types/hero';

	let { hero: _hero }: { hero: HeroProperties } = $props();
</script>

<section
	id="top"
	class="relative flex min-h-svh flex-col overflow-hidden bg-black"
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
		class="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center [@media(min-width:1280px)_and_(min-height:800px)]:max-w-6xl"
	>
		<h1
			class="hero-in mt-3 font-serif text-3xl leading-tight font-semibold text-mint-400 sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl [@media(min-width:1280px)_and_(min-height:800px)]:text-8xl"
			style="animation-delay: 340ms"
		>
			<!--{h.heroTitle}-->
			DANS DIG<br /> FRI
		</h1>

		<p
			class="hero-in mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg lg:text-xl [@media(min-width:1280px)_and_(min-height:800px)]:max-w-3xl [@media(min-width:1280px)_and_(min-height:800px)]:text-2xl"
			style="animation-delay: 460ms"
		>
			Giv slip. Giv dig hen. Dans frit.
		</p>

		<p
			class="hero-in mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg lg:text-xl [@media(min-width:1280px)_and_(min-height:800px)]:max-w-3xl [@media(min-width:1280px)_and_(min-height:800px)]:text-2xl"
			style="animation-delay: 460ms"
		>
			Oplev stærkere forbindelse til din krop, tydeligere kontakt mellem krop, følelser og tanker 〰
			og mere frihed, bevidsthed og nærvær i dit liv.
		</p>

		<p
			class="hero-in mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg lg:text-xl [@media(min-width:1280px)_and_(min-height:800px)]:max-w-3xl [@media(min-width:1280px)_and_(min-height:800px)]:text-2xl"
			style="animation-delay: 460ms"
		>
			Jeg guider Fri Dans og danseterapi. Du er velkommen.
		</p>

		<div
			class="hero-in mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4 md:mt-12 [@media(min-width:1280px)_and_(min-height:800px)]:gap-5"
			style="animation-delay: 580ms"
		>
			<a
				href="#tilbud"
				class="rounded-full bg-mint-700 px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-400 active:scale-95 sm:py-3.5 [@media(min-width:1280px)_and_(min-height:800px)]:px-10 [@media(min-width:1280px)_and_(min-height:800px)]:py-4 [@media(min-width:1280px)_and_(min-height:800px)]:text-lg"
			>
				FIND DIN DANS
			</a>
		</div>
	</div>
</section>
