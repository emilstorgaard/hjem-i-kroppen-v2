<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';

	type Props = {
		open: boolean;
		title: string;
		/** Small uppercase line above the title. */
		eyebrow?: string;
		onclose: () => void;
		/** Without JS the close button is a link to this URL (e.g. the page without `?session=`). */
		closeHref?: string;
		size?: 'md' | 'lg' | 'xl';
		children: Snippet;
		footer?: Snippet;
	};

	let { open, title, eyebrow, onclose, closeHref, size = 'md', children, footer }: Props = $props();

	const uid = $props.id();
	let panel: HTMLDivElement | undefined = $state();

	const widths = { md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };
	const motion = $derived(prefersReducedMotion.current ? 0 : 1);

	const FOCUSABLE =
		'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	function focusables(): HTMLElement[] {
		return panel
			? [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
					(el) => el.offsetParent !== null || el === document.activeElement
				)
			: [];
	}

	$effect(() => {
		if (!open || !panel) return;
		const previous = document.activeElement as HTMLElement | null;
		const overflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		// Focus the first field if there is one, otherwise the panel itself (so screen readers announce the title).
		const first = panel.querySelector<HTMLElement>('[data-autofocus]') ?? panel;
		first.focus({ preventScroll: true });

		return () => {
			document.body.style.overflow = overflow;
			if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
		};
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onclose();
			return;
		}
		if (event.key !== 'Tab') return;
		// A dialog opened from inside another one handles its own focus trap.
		event.stopPropagation();
		const items = focusables();
		if (items.length === 0) {
			event.preventDefault();
			panel?.focus();
			return;
		}
		const firstItem = items[0];
		const lastItem = items[items.length - 1];
		if (
			event.shiftKey &&
			(document.activeElement === firstItem || document.activeElement === panel)
		) {
			event.preventDefault();
			lastItem.focus();
		} else if (!event.shiftKey && document.activeElement === lastItem) {
			event.preventDefault();
			firstItem.focus();
		}
	}

	function closeClick(event: MouseEvent) {
		event.preventDefault();
		onclose();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
		role="presentation"
	>
		<div
			class="absolute inset-0 bg-black/40 backdrop-blur-sm"
			transition:fade={{ duration: 180 * motion }}
			onclick={onclose}
			aria-hidden="true"
		></div>

		<div
			bind:this={panel}
			class="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 shadow-black/20 ring-black/10 outline-none sm:rounded-3xl {widths[
				size
			]}"
			role="dialog"
			aria-modal="true"
			aria-labelledby="{uid}-title"
			tabindex="-1"
			{onkeydown}
			transition:fly={{ y: 40 * motion, duration: 260 * motion }}
		>
			<div
				class="mx-auto mt-2 h-1.5 w-12 rounded-full bg-black/10 sm:hidden"
				aria-hidden="true"
			></div>
			<header class="flex items-start justify-between gap-4 px-6 pt-5 pb-3 sm:px-8 sm:pt-7">
				<div>
					{#if eyebrow}
						<p class="text-xs font-medium tracking-[0.3em] text-black/55 uppercase">{eyebrow}</p>
					{/if}
					<h2
						id="{uid}-title"
						class="mt-1 font-serif text-2xl font-semibold text-black sm:text-3xl"
					>
						{title}
					</h2>
				</div>
				<a
					href={closeHref ?? '#'}
					onclick={closeClick}
					class="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-mint-700"
					aria-label="Luk"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-5 w-5"
						aria-hidden="true"
						><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg
					>
				</a>
			</header>
			<div class="flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
				{@render children()}
			</div>
			{#if footer}
				<footer class="border-t border-black/10 bg-white px-6 py-4 sm:px-8">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
{/if}
