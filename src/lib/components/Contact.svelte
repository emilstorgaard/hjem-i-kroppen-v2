<script lang="ts">
	import type { ContactProperties } from '$lib/types/contact';
	import { reveal } from '$lib/actions/reveal';

	let { contact }: { contact: ContactProperties } = $props();

	const p = $derived(contact);

	const phoneHref = $derived(`tel:${p.phone?.replace(/\s/g, '') ?? ''}`);
	const emailHref = $derived(`mailto:${p.email}`);
	const address = $derived(
		[p.streetAddress, [p.postalCode, p.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
	);
	const directionsHref = $derived(
		address
			? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
			: undefined
	);
	const mapsEmbedSrc = $derived(
		address
			? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
			: undefined
	);
</script>

<section id="kontakt" aria-labelledby="kontakt-heading" class="bg-sand-900 px-6 py-24 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-2xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-sand-400 uppercase">Kontakt</p>
			<h2
				class="mt-4 font-serif text-4xl font-semibold text-sand-50 sm:text-5xl"
				id="kontakt-heading"
			>
				Lad os finde hjem i din krop &mdash; sammen
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-sand-300">
				Har du spørgsmål, eller vil du booke en tid? Så tøv ikke med at skrive eller ringe &mdash;
				jeg glæder mig til at høre fra dig.
			</p>
		</div>

		<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#if p.phone}
				<a
					href={phoneHref}
					use:reveal
					class="hover:shadow-sand-950/30 flex flex-col items-center gap-3 rounded-3xl bg-sand-800/60 p-8 text-center ring-1 ring-sand-700 transition-all duration-300 hover:-translate-y-1 hover:bg-sand-800 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-8 w-8 text-sand-300"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a11.25 11.25 0 0 1-6.238-6.238l1.293-.97a1.125 1.125 0 0 0 .417-1.173L8.963 3.102a1.125 1.125 0 0 0-1.091-.852H6.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
						/>
					</svg>
					<p class="font-serif text-lg font-semibold text-sand-50">Telefon</p>
					<p class="text-sand-300">{p.phone}</p>
				</a>
			{/if}

			<a
				href={emailHref}
				use:reveal={{ delay: 120 }}
				class="hover:shadow-sand-950/30 flex flex-col items-center gap-3 rounded-3xl bg-sand-800/60 p-8 text-center ring-1 ring-sand-700 transition-all duration-300 hover:-translate-y-1 hover:bg-sand-800 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-8 w-8 text-sand-300"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
					/>
				</svg>
				<p class="font-serif text-lg font-semibold text-sand-50">Email</p>
				<p class="text-sand-300">{p.email}</p>
			</a>

			{#if address}
				<a
					href={directionsHref}
					target="_blank"
					rel="noopener noreferrer"
					use:reveal={{ delay: 240 }}
					class="hover:shadow-sand-950/30 flex flex-col items-center gap-3 rounded-3xl bg-sand-800/60 p-8 text-center ring-1 ring-sand-700 transition-all duration-300 hover:-translate-y-1 hover:bg-sand-800 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200 sm:col-span-2 lg:col-span-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-8 w-8 text-sand-300"
					>
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
					</svg>
					<p class="font-serif text-lg font-semibold text-sand-50">Adresse</p>
					<p class="text-sand-300">{address}</p>
				</a>
			{/if}
		</div>

		{#if address}
			<div class="mt-6 flex justify-center">
				<a
					href={directionsHref}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-full bg-sand-800/60 px-5 py-2.5 text-sm font-medium text-sand-200 ring-1 ring-sand-700 transition-all duration-300 hover:scale-[1.03] hover:bg-sand-800 hover:text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200 active:scale-95"
				>
					Få rutevejledning
				</a>
			</div>

			<div class="mt-8 overflow-hidden rounded-3xl ring-1 ring-sand-700">
				<iframe
					src={mapsEmbedSrc}
					title="Kort over {address}"
					class="h-80 w-full border-0"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		{/if}

		{#if p.instagramUrl || p.facebookUrl}
			<div class="mt-12 flex justify-center gap-6">
				{#if p.instagramUrl}
					<a
						href={p.instagramUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="rounded-full text-sand-300 transition-all duration-300 hover:scale-110 hover:text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200"
						aria-label="Følg på Instagram"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-7 w-7"
						>
							<path
								fill-rule="evenodd"
								d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47a4.9 4.9 0 0 0-1.77 1.15A4.9 4.9 0 0 0 2.53 5.45c-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43a4.9 4.9 0 0 0 1.15 1.77 4.9 4.9 0 0 0 1.77 1.15c.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47a4.9 4.9 0 0 0 1.77-1.15 4.9 4.9 0 0 0 1.15-1.77c.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.15-1.77 4.9 4.9 0 0 0-1.77-1.15c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.2 1.86.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.2 1.5-.34 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.2-1.86-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.3-.88-.34-1.86-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.2-1.5.34-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.88-.3 1.86-.34C9.01 3.81 9.33 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3Zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7Zm5.34-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{/if}
				{#if p.facebookUrl}
					<a
						href={p.facebookUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="rounded-full text-sand-300 transition-all duration-300 hover:scale-110 hover:text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-200"
						aria-label="Følg på Facebook"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-7 w-7"
						>
							<path
								fill-rule="evenodd"
								d="M22 12.06C22 6.53 17.52 2 12 2S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94Z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{/if}
			</div>
		{/if}
	</div>
</section>
