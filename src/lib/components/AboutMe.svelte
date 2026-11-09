<script lang="ts">
	import SplitSection from '$lib/components/SplitSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import type { AboutPageProperties } from '$lib/types/aboutPage';

	let { about }: { about: AboutPageProperties } = $props();
</script>

<SplitSection image={about.image?.[0]} imageAlt="{about.heading}, grundlægger af Hjem i Kroppen">
	<div
		use:reveal={{ delay: 150 }}
		class="flex flex-col justify-center bg-mint-600 px-6 py-10 text-center md:p-10 md:text-left md:shadow-sm md:ring-1 md:ring-black/10 lg:p-14"
	>
		<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">{about.label}</p>
		<h1 class="mt-4 font-serif text-4xl font-semibold text-black lg:text-5xl">{about.heading}</h1>
		<p class="mt-2 text-sm font-medium tracking-[0.2em] text-mint-700 uppercase">
			{about.subtitle}
		</p>
		<p class="mt-6 leading-relaxed text-black/70 lg:text-lg">{about.text}</p>
	</div>
</SplitSection>
