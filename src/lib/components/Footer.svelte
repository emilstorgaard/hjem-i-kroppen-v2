<script lang="ts">
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	import type { SettingsProperties } from '$lib/types/settings';
	import { navLinks } from '$lib/navigation';

	const year = new Date().getFullYear();

	let { settings }: { settings: SettingsProperties } = $props();

	const s = $derived(settings);
	const logo = $derived(s.logo?.[0]);
</script>

<footer class="border-t border-sand-800 bg-sand-900 px-6 py-12 lg:px-8">
	<div
		class="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left"
	>
		<a
			href="#top"
			class="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200"
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
			<span class="font-serif text-lg font-semibold text-sand-50">{s.siteName}</span>
		</a>

		<nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footermenu">
			{#each navLinks as link}
				<a
					href={link.href}
					class="relative rounded-sm text-sm text-sand-400 transition-colors after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-sand-50 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>

	<div class="mx-auto mt-8 max-w-6xl border-t border-sand-800 pt-6 text-center">
		<p class="text-sm text-sand-500">
			&copy; {year}
			{s.ownerName} &middot; Danse- og bevægelsesterapi
		</p>
	</div>
</footer>
