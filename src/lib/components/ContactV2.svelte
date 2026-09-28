<script lang="ts">
	import type { ContactProperties } from '$lib/types/contact';
	import { reveal } from '$lib/actions/reveal';

	let { contact }: { contact: ContactProperties } = $props();

	const p = $derived(contact);

	const emailHref = $derived(`mailto:${p.email}`);
</script>

<section
	id="kontakt"
	aria-labelledby="kontakt-heading"
	class="bg-mint-600 px-6 py-24 lg:px-8"
	style="scroll-margin-top: var(--header-h, 4.5rem)"
>
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-2xl text-center" use:reveal>
			<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Kontakt</p>
			<h2
				class="mt-4 font-serif text-4xl font-semibold text-black sm:text-5xl"
				id="kontakt-heading"
			>
				Lad os finde hjem i din krop &mdash; sammen
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-black/70">
				Har du spørgsmål, eller vil du booke en tid? Så tøv ikke med at skrive eller ringe &mdash;
				jeg glæder mig til at høre fra dig.
			</p>
		</div>

		<div
			use:reveal={{ delay: 120 }}
			class="mx-auto mt-16 flex max-w-sm flex-col items-center gap-3 rounded-3xl bg-black/5 p-8 text-center ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-black/10 hover:shadow-lg hover:shadow-black/10"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-8 w-8 text-mint-700"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
				/>
			</svg>
			<p class="font-serif text-lg font-semibold text-black">Email</p>
			<p class="text-black/70">{p.email}</p>
			<a
				href={emailHref}
				class="mt-2 inline-flex items-center justify-center rounded-full bg-mint-700 px-8 py-3.5 text-sm font-semibold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-700 active:scale-95"
			>
				Skriv en mail
			</a>
		</div>
	</div>
</section>
