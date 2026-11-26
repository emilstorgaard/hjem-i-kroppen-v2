<script lang="ts">
	import { mediaSrc, mediaSrcset } from '$lib/utils/media';
	import type { SettingsProperties } from '$lib/types/settings';
	import { navLinks } from '$lib/navigation';
	import { page } from '$app/state';
	import { getLabels } from '$lib/labels';
	import type { UserResponse } from '$lib/types/booking';

	let { settings, user = null }: { settings: SettingsProperties; user?: UserResponse | null } =
		$props();

	const s = $derived(settings);
	const logo = $derived(s.logo?.[0]);

	let mobileMenuOpen = $state(false);
	let topBarEl: HTMLDivElement | undefined = $state();
	let scrolled = $state(false);

	const isHome = $derived(page.url.pathname === '/');

	const solid = $derived(!isHome || scrolled || mobileMenuOpen);

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

	let userMenuOpen = $state(false);
	let userMenuEl: HTMLDivElement | undefined = $state();
	const initials = $derived(
		(user?.fullName ?? '')
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('')
	);
	const loginHref = $derived(
		page.url.pathname === '/login'
			? '/login'
			: `/login?redirectTo=${encodeURIComponent(page.url.pathname + page.url.search)}`
	);

	// Close the user menu on navigation, outside clicks and Escape.
	$effect(() => {
		void page.url.pathname;
		userMenuOpen = false;
		mobileMenuOpen = false;
	});

	$effect(() => {
		if (!userMenuOpen) return;
		const onPointer = (event: PointerEvent) => {
			if (userMenuEl && !userMenuEl.contains(event.target as Node)) userMenuOpen = false;
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				userMenuOpen = false;
				userMenuEl?.querySelector<HTMLButtonElement>('button')?.focus();
			}
		};
		document.addEventListener('pointerdown', onPointer);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onPointer);
			document.removeEventListener('keydown', onKey);
		};
	});

	function closeMenu() {
		mobileMenuOpen = false;
	}

	const labels = $derived(getLabels());
</script>

<header
	class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 max-lg:relative max-lg:border-[#f6ede4] max-lg:bg-[#f6ede4] max-lg:shadow-none max-lg:backdrop-blur-none {solid
		? 'border-black/10 bg-white/80 shadow-sm shadow-black/5 backdrop-blur-md'
		: 'border-transparent bg-transparent'}"
>
	<div
		bind:this={topBarEl}
		class="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 max-lg:relative max-lg:justify-center max-lg:py-0 lg:px-8 lg:py-3"
	>
		<a
			href="/"
			class="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 max-lg:rounded-none lg:gap-3"
		>
			{#if logo}
				<img
					src={mediaSrc(logo.url, 'headerLogo')}
					srcset={mediaSrcset(logo.url, 'headerLogo')}
					sizes="(min-width: 1024px) 96px, 224px"
					alt={logo.name}
					fetchpriority="high"
					loading="eager"
					decoding="async"
					width="96"
					height="96"
					class="h-10 w-10 rounded-full object-cover shadow-sm max-lg:h-32 max-lg:w-32 max-lg:rounded-none max-lg:object-contain max-lg:shadow-none lg:h-12 lg:w-12"
				/>
			{/if}
			<span
				class="font-serif text-base font-semibold tracking-wide transition-colors max-lg:hidden lg:text-xl {solid
					? 'text-black'
					: 'text-white'}">{s.siteName}</span
			>
		</a>

		<nav class="hidden items-center gap-9 lg:flex" aria-label="Hovedmenu">
			{#each navLinks as link (link.label)}
				<a
					href={link.href}
					class="relative rounded-sm text-sm font-medium tracking-wide transition-colors after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 {solid
						? 'text-black/70 hover:text-mint-700'
						: 'text-white/90 hover:text-mint-400'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="hidden items-center gap-3 lg:flex">
			<a
				href="/book"
				class="inline-flex items-center rounded-full px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase shadow-sm transition-all duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 active:scale-95 {solid
					? 'bg-mint-700 text-white hover:bg-black'
					: 'bg-white/90 text-black hover:bg-white'}"
			>
				{labels.bookButtonText}
			</a>

			{#if user}
				<div class="relative" bind:this={userMenuEl}>
					<button
						type="button"
						class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 {solid
							? 'bg-mint-200 text-mint-700 ring-mint-700/20 hover:bg-mint-400/60'
							: 'bg-white/15 text-white ring-white/40 hover:bg-white/25'}"
						aria-haspopup="true"
						aria-expanded={userMenuOpen}
						aria-controls="user-menu"
						aria-label="Brugermenu for {user.fullName}"
						onclick={() => (userMenuOpen = !userMenuOpen)}
					>
						{initials || '•'}
					</button>
					{#if userMenuOpen}
						<div
							id="user-menu"
							class="absolute right-0 mt-3 w-60 overflow-hidden rounded-3xl bg-white p-2 text-black shadow-xl ring-1 shadow-black/10 ring-black/10"
						>
							<p class="truncate px-3 pt-2 pb-1 font-serif text-lg font-semibold">
								{user.fullName}
							</p>
							<p class="truncate px-3 pb-2 text-xs text-black/55">{user.email}</p>
							<div class="my-1 h-px bg-black/10"></div>
							<a
								href="/min-side"
								class="block rounded-2xl px-3 py-2 text-sm font-medium hover:bg-mint-600/60"
								>Min side</a
							>
							{#if user.role === 'Admin'}
								<a
									href="/admin"
									class="block rounded-2xl px-3 py-2 text-sm font-medium hover:bg-mint-600/60"
									>Admin</a
								>
							{/if}
							<form method="POST" action="/logout">
								<button
									type="submit"
									class="w-full rounded-2xl px-3 py-2 text-left text-sm font-medium text-rust-700 hover:bg-rust-100/60"
								>
									Log ud
								</button>
							</form>
						</div>
					{/if}
				</div>
			{:else}
				<a
					href={loginHref}
					class="rounded-sm text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 {solid
						? 'text-black/70 hover:text-mint-700'
						: 'text-white/90 hover:text-mint-400'}"
				>
					{labels.loginButtonText}
				</a>
			{/if}
		</div>

		<button
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 max-lg:absolute max-lg:top-1/2 max-lg:right-6 max-lg:-translate-y-1/2 max-lg:text-black lg:hidden {solid
				? 'text-black'
				: 'text-white'}"
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
			class="flex flex-col gap-1 border-t border-black/10 bg-[#f6ede4] px-6 py-4 lg:hidden"
			aria-label="Mobilmenu"
		>
			{#each navLinks as link (link.label)}
				<a
					href={link.href}
					onclick={closeMenu}
					class="rounded-lg px-3 py-2.5 text-base font-medium text-black transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
				>
					{link.label}
				</a>
			{/each}
			<div class="my-2 h-px bg-black/10"></div>
			<a
				href="/book"
				onclick={closeMenu}
				class="mt-1 rounded-full bg-mint-700 px-5 py-3 text-center text-sm font-semibold tracking-[0.2em] text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
			>
				{labels.bookButtonText}
			</a>
			{#if user}
				<a
					href="/min-side"
					onclick={closeMenu}
					class="rounded-lg px-3 py-2.5 text-base font-medium text-black hover:bg-black/5"
					>Min side</a
				>
				{#if user.role === 'Admin'}
					<a
						href="/admin"
						onclick={closeMenu}
						class="rounded-lg px-3 py-2.5 text-base font-medium text-black hover:bg-black/5"
						>Admin</a
					>
				{/if}
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-rust-700 hover:bg-black/5"
					>
						Log ud ({user.fullName})
					</button>
				</form>
			{:else}
				<a
					href={loginHref}
					onclick={closeMenu}
					class="rounded-lg px-3 py-2.5 text-base font-medium text-black hover:bg-black/5"
					>{labels.loginButtonText}</a
				>
			{/if}
		</nav>
	{/if}
</header>
