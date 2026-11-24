<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const links = [
		{ href: '/admin', label: 'Oversigt' },
		{ href: '/admin/sessioner', label: 'Tider' },
		{ href: '/admin/forloeb', label: 'Forløb' },
		{ href: '/admin/ydelser', label: 'Ydelser' },
		{ href: '/admin/kategorier', label: 'Kategorier' },
		{ href: '/admin/bookinger', label: 'Bookinger' },
		{ href: '/admin/brugere', label: 'Brugere' }
	];

	const isActive = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);
</script>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<div class="bg-white px-6 pt-8 pb-20 lg:px-8 lg:pt-[calc(var(--header-h,4.5rem)+2.5rem)]">
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col gap-6 lg:flex-row lg:gap-10">
			<nav aria-label="Admin" class="lg:w-52 lg:shrink-0">
				<p class="hidden text-xs font-medium tracking-[0.3em] text-black/50 uppercase lg:block">
					Admin
				</p>
				<ul
					class="no-scrollbar -mx-6 -my-1.5 flex gap-2 overflow-x-auto px-6 py-1.5 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1 lg:px-0"
				>
					{#each links as link (link.href)}
						<li>
							<a
								href={link.href}
								aria-current={isActive(link.href) ? 'page' : undefined}
								class="block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 lg:rounded-2xl {isActive(
									link.href
								)
									? 'bg-mint-700 text-white'
									: 'bg-mint-600/50 text-black/75 hover:bg-mint-600 lg:bg-transparent'}"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="min-w-0 flex-1">
				{@render children()}
			</div>
		</div>
	</div>
</div>
