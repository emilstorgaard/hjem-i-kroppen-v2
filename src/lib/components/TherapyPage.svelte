<script lang="ts">
	import SplitSection from '$lib/components/SplitSection.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import BookingOptions from '$lib/components/BookingOptions.svelte';
	import TherapyContact from '$lib/components/TherapyContact.svelte';
	import { reveal } from '$lib/actions/reveal';
	import type { Address } from '$lib/types/address';
	import type { ContactProperties } from '$lib/types/contact';
	import type { TherapyPageProperties } from '$lib/types/therapyPage';

	type Props = {
		therapy: TherapyPageProperties;
		contact: ContactProperties | null;
		addresses: Address[];
	};

	let { therapy, contact, addresses }: Props = $props();
</script>

<SplitSection image={therapy.image?.[0]} imageAlt={therapy.heading}>
	<div
		use:reveal={{ delay: 150 }}
		class="flex flex-col justify-center bg-mint-600 px-6 py-10 text-center md:p-10 md:text-left md:shadow-sm md:ring-1 md:ring-black/10 lg:p-14"
	>
		<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">Terapi</p>
		<h1 class="mt-4 font-serif text-3xl font-semibold text-black sm:text-4xl lg:text-5xl">
			{therapy.heading}
		</h1>
		<p
			class="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-medium tracking-[0.2em] text-mint-700 uppercase md:justify-start"
		>
			<span>{therapy.audience}</span>
			<span>{therapy.participants}</span>
		</p>
		<p class="mt-6 leading-relaxed text-black/70 lg:text-lg">{therapy.info}</p>
	</div>
</SplitSection>

{#if therapy.testimonials.length > 0}
	<Testimonials testimonials={therapy.testimonials} />
{/if}

{#if therapy.bookingOptions?.length}
	<BookingOptions options={therapy.bookingOptions} />
{/if}

<TherapyContact {contact} {addresses} therapyName={therapy.heading} />
