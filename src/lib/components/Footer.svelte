<script lang="ts">
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	import type { SettingsProperties } from '$lib/types/settings';

	const year = new Date().getFullYear();

	let { settings }: { settings: SettingsProperties } = $props();

	const s = $derived(settings);
	const logo = $derived(s.logo?.[0]);
</script>

<footer class="border-t border-black/10 bg-[#808080] px-6 py-12 lg:px-8">
	<div
		class="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left"
	>
		<a
			href="/"
			class="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
		>
			{#if logo}
				<img
					src={mediaSrc(logo.url, 'footerLogo')}
					srcset={mediaSrcset(logo.url, 'footerLogo')}
					sizes="64px"
					alt={logo.name}
					width="64"
					height="64"
					loading="lazy"
					decoding="async"
					class="h-10 w-10 rounded-full object-cover"
				/>
			{/if}
			<span class="font-serif text-lg font-semibold text-white">{s.siteName}</span>
		</a>

		<p class="text-sm text-white/70 sm:text-right">
			&copy; {s.ownerName}
			{year}
			<br />
			Fotos [fotografens navn]
		</p>
	</div>
</footer>
