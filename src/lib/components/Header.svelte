<script lang="ts">
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	import type { SettingsProperties } from '$lib/types/settings';
	import { navLinks } from '$lib/navigation';

	let { settings }: { settings: SettingsProperties } = $props();

	const s = $derived(settings);
	const logo = $derived(s.logo?.[0]);

	let mobileMenuOpen = $state(false);
	let topBarEl: HTMLDivElement | undefined = $state();
	let scrolled = $state(false);

	// Solid background once scrolled past the hero (or while the mobile menu is open) - transparent over the hero video otherwise.
	const solid = $derived(scrolled || mobileMenuOpen);

	// Expose the header's height as a CSS var so sections below can clear it exactly (instead of a guessed padding value).
	$effect(() => {
		const el = topBarEl;
		if (!el) return;

		const updateHeight = () => {
			document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
		};
		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(el);
		return () => observer.disconnect();
	});

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 8;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<header
	class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 {solid
		? 'border-sand-200/60 bg-sand-50/80 shadow-sm shadow-sand-900/5 backdrop-blur-md'
		: 'border-transparent bg-transparent'}"
>
	<div
		bind:this={topBarEl}
		class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8"
	>
		<!-- Spacer matching the mobile menu button width, so the logo below is truly centered -->
		<div class="h-10 w-10 lg:hidden" aria-hidden="true"></div>

		<a
			href="#top"
			class="flex flex-col items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-600 lg:flex-row lg:gap-3"
		>
			{#if logo}
				<img
					src={mediaSrc(logo.url, 'headerLogo')}
					srcset={mediaSrcset(logo.url, 'headerLogo')}
					sizes="96px"
					alt={logo.name}
					fetchpriority="high"
					loading="eager"
					decoding="async"
					width="96"
					height="96"
					class="h-20 w-20 rounded-full object-cover shadow-sm lg:h-12 lg:w-12"
				/>
			{/if}
			<span
				class="font-serif text-base font-semibold tracking-wide transition-colors lg:text-xl {solid
					? 'text-sand-900'
					: 'text-sand-50'}">{s.siteName}</span
			>
		</a>

		<nav class="hidden items-center gap-9 lg:flex" aria-label="Hovedmenu">
			{#each navLinks as link}
				<a
					href={link.href}
					class="relative rounded-sm text-sm font-medium tracking-wide transition-colors after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-600 {solid
						? 'text-sand-700 hover:text-sand-900'
						: 'text-sand-100 hover:text-sand-50'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<button
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-600 lg:hidden {solid
				? 'text-sand-800'
				: 'text-sand-50'}"
			aria-label={mobileMenuOpen ? 'Luk menu' : 'Åbn menu'}
			aria-expanded={mobileMenuOpen}
			aria-controls="mobile-menu"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			{#if mobileMenuOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					class="h-6 w-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
					/>
				</svg>
			{/if}
		</button>
	</div>

	{#if mobileMenuOpen}
		<nav
			id="mobile-menu"
			class="flex flex-col gap-1 border-t border-sand-200/60 bg-sand-50 px-6 py-4 lg:hidden"
			aria-label="Mobilmenu"
		>
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={closeMenu}
					class="rounded-lg px-3 py-2.5 text-base font-medium text-sand-800 transition-colors hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-600"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
