<script lang="ts">
	import SplitSection from '$lib/components/SplitSection.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import BookingOptions from '$lib/components/BookingOptions.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { DEFAULT_LABELS, getLabels } from '$lib/labels';
	import type { Address } from '$lib/types/address';
	import type { ContactProperties } from '$lib/types/contact';
	import type { BookingOption } from '$lib/types/bookingOption';
	import type { TherapyPageProperties } from '$lib/types/therapyPage';

	type Props = {
		/** Where the "Book" buttons point, e.g. `/book?kategori=danseterapi`. */
		bookHref: string;
		/** Booking options with their links resolved. */
		bookingOptions: BookingOption[];
		therapy: TherapyPageProperties;
		contact: ContactProperties | null;
		addresses: Address[];
	};

	let { therapy, bookHref, bookingOptions, contact, addresses }: Props = $props();

	const labels = $derived(getLabels());
</script>

<SplitSection image={therapy.image?.[0]} imageAlt={therapy.heading}>
	<div
		use:reveal={{ delay: 150 }}
		class="flex flex-col justify-center bg-mint-600 px-6 py-10 text-center md:p-10 md:text-left md:shadow-sm md:ring-1 md:ring-black/10 lg:p-14"
	>
		<p class="text-sm font-medium tracking-[0.3em] text-black/60 uppercase">{labels.therapyLabel}</p>
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
	<Testimonials
		testimonials={therapy.testimonials}
		label={therapy.testimonialsLabel || DEFAULT_LABELS.testimonialsLabel}
		heading={therapy.testimonialsHeading || DEFAULT_LABELS.testimonialsHeading}
	/>
{/if}

{#if bookingOptions.length}
	<BookingOptions
		options={bookingOptions}
		label={therapy.bookingOptionsLabel}
		heading={therapy.bookingOptionsHeading}
	/>
{/if}

<Contact {contact} {addresses} {bookHref} mailSubject="Henvendelse om {therapy.heading}" />
