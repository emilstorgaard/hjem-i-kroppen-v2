<script lang="ts">
	import { PUBLIC_UMBRACO_URL } from '$env/static/public';
	import { getMediaUrl } from '$lib/api/umbraco';
	import { getLabels } from '$lib/labels';
	import type { HeroProperties } from '$lib/types/hero';

	let { hero }: { hero: HeroProperties } = $props();

	const labels = $derived(getLabels());
	const videoUrl = $derived(hero.heroVideo ? getMediaUrl(hero.heroVideo.url) : undefined);
	const umbracoOrigin = new URL(PUBLIC_UMBRACO_URL).origin;

	// The video fades in once it is actually playing, so a slow start from the CMS never shows as a frozen or stuttering frame.
	let playing = $state(false);
	let video = $state<HTMLVideoElement>();

	// The video may already be playing before hydration, in which case the `playing` event was missed.
	$effect(() => {
		if (video && !video.paused && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA)
			playing = true;
	});
</script>

<svelte:head>
	{#if videoUrl}
		<link rel="preconnect" href={umbracoOrigin} />
	{/if}
</svelte:head>

<section
	id="top"
	class="relative flex min-h-svh flex-col overflow-hidden bg-black max-lg:min-h-[calc(100svh-var(--header-h,4.5rem)-1px)] lg:h-svh lg:min-h-[480px] lg:pt-[var(--header-h,4.5rem)]"
>
	{#if videoUrl}
		<video
			bind:this={video}
			class="hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 {playing
				? 'opacity-100'
				: 'opacity-0'}"
			src={videoUrl}
			autoplay
			muted
			loop
			playsinline
			preload="auto"
			disablepictureinpicture
			disableremoteplayback
			aria-hidden="true"
			onplaying={() => (playing = true)}
		></video>
	{/if}
	<div
		class="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center lg:max-w-5xl lg:pb-[3svh]"
	>
		<h1
			class="hero-in mt-3 font-serif text-3xl leading-tight font-semibold text-mint-400 sm:mt-5 sm:text-4xl md:text-5xl lg:mt-0 lg:text-[length:clamp(2.25rem,10svh,6rem)]"
			style="animation-delay: 340ms"
		>
			{#each hero.heroTitle as line, i (i)}{#if i > 0}<br />{/if}{line}{/each}
		</h1>

		{#each hero.heroText as line, i (i)}
			<p
				class="hero-in mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg lg:mt-[clamp(0.5rem,2.4svh,1.5rem)] lg:max-w-3xl lg:text-[length:clamp(1rem,2.8svh,1.5rem)]"
				style="animation-delay: 460ms"
			>
				{line}
			</p>
		{/each}

		<div
			class="hero-in mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4 md:mt-12 lg:mt-[clamp(1rem,4svh,3rem)]"
			style="animation-delay: 580ms"
		>
			<a
				href="#terapi"
				class="rounded-full bg-mint-700 px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-400 active:scale-95 sm:py-3.5 lg:px-[clamp(1.75rem,4svh,2.5rem)] lg:py-[clamp(0.6rem,1.8svh,1rem)] lg:text-[length:clamp(0.95rem,2.2svh,1.125rem)]"
			>
				{labels.heroButtonText}
			</a>
		</div>
	</div>
</section>