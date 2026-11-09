<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { addressLines, directionsHref } from '$lib/utils/address';
	import type { Address } from '$lib/types/address';
	import type { ContactProperties } from '$lib/types/contact';

	type Props = {
		contact: ContactProperties | null;
		addresses: Address[];
		therapyName: string;
	};

	let { contact, addresses, therapyName }: Props = $props();

	type ContactItem = {
		icon: 'phone' | 'mail' | 'pin';
		label: string;
		lines: string[];
		href: string;
		external?: boolean;
	};

	const mailHref = $derived(
		contact
			? `mailto:${contact.email}?subject=${encodeURIComponent(`Henvendelse om ${therapyName}`)}`
			: undefined
	);

	const contactItems = $derived<ContactItem[]>(
		[
			contact?.phone && {
				icon: 'phone',
				label: 'Telefon',
				lines: [contact.phone],
				href: `tel:${contact.phone.replace(/\s/g, '')}`
			},
			contact?.email && {
				icon: 'mail',
				label: 'Mail',
				lines: [contact.email],
				href: `mailto:${contact.email}`
			},
			...addresses.map((address) => ({
				icon: 'pin',
				label: address.label,
				lines: addressLines(address),
				href: directionsHref(address),
				external: true
			}))
		].filter((item): item is ContactItem => Boolean(item))
	);
</script>

{#snippet icon(name: ContactItem['icon'])}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		aria-hidden="true"
		class="h-8 w-8 text-mint-700"
	>
		{#if name === 'phone'}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
			/>
		{:else if name === 'mail'}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
			/>
		{:else}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
			/>
		{/if}
	</svg>
{/snippet}

<section
	id="kontakt"
	aria-labelledby="therapy-contact-heading"
	class="bg-mint-600 px-6 py-16 lg:px-8 lg:py-24"
>
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-2xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Kontakt</p>
			<h2
				id="therapy-contact-heading"
				class="mt-4 font-serif text-3xl font-semibold text-black sm:text-4xl lg:text-5xl"
			>
				Lad os finde hjem i din krop &mdash; sammen
			</h2>

			{#if mailHref}
				<a
					href={mailHref}
					class="mt-8 inline-flex items-center justify-center rounded-full bg-mint-700 px-8 py-3.5 text-center text-sm font-semibold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 active:scale-95 max-sm:w-full"
				>
					Skriv til mig for at høre mere
				</a>
			{/if}
		</div>

		{#if contactItems.length > 0}
			<ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
				{#each contactItems as item, i (item.label)}
					<li use:reveal={{ delay: i * 120 }}>
						<a
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener noreferrer' : undefined}
							class="flex h-full flex-col items-center gap-3 rounded-3xl bg-black/5 p-8 text-center ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-black/10 hover:shadow-lg hover:shadow-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700"
						>
							{@render icon(item.icon)}
							<p class="font-serif text-lg font-semibold text-black">{item.label}</p>
							<div class="text-black/70">
								{#each item.lines as line (line)}
									<p class="break-words">{line}</p>
								{/each}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="mt-12 flex justify-center lg:mt-16" use:reveal>
			<!-- TODO: Connect to the booking system. Intentionally inactive for now. -->
			<button
				type="button"
				class="inline-flex items-center justify-center rounded-full bg-mint-700 px-12 py-4 text-base font-semibold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 active:scale-95 max-sm:w-full"
			>
				Book
			</button>
		</div>
	</div>
</section>
