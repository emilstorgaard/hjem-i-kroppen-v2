<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/actions/reveal';
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	import type { UmbracoMedia } from '$lib/types/umbraco';

	type Props = {
		image?: UmbracoMedia;
		imageAlt: string;
		children: Snippet;
	};

	let { image, imageAlt, children }: Props = $props();
</script>

<section
	class="bg-white max-md:pb-16 md:px-6 md:py-24 lg:px-8 lg:pt-[calc(var(--header-h,4.5rem)+6rem)]"
>
	<div class="mx-auto grid max-w-6xl md:grid-cols-2 md:gap-6 lg:gap-8">
		<div
			use:reveal
			class="aspect-square w-full overflow-hidden bg-black/5 md:aspect-auto md:min-h-[28rem] md:shadow-sm md:ring-1 md:ring-black/10 lg:min-h-[36rem]"
		>
			{#if image}
				<img
					src={mediaSrc(image.url, 'splitImage')}
					srcset={mediaSrcset(image.url, 'splitImage')}
					sizes="(min-width: 1152px) 576px, (min-width: 768px) 50vw, 100vw"
					alt={imageAlt}
					class="h-full w-full object-cover"
				/>
			{:else}
				<img src="/logo.jpg" alt={imageAlt} class="h-full w-full object-cover" />
			{/if}
		</div>

		{@render children()}
	</div>
</section>
