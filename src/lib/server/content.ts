import type { BlockList, ElementBlock } from '$lib/types/elementTypes';
import type { Testimonial, TestimonialElement } from '$lib/types/testimonial';

/** Helpers that turn raw Delivery API values (anything may be missing or null) into render-ready values. */

/** A Textarea value split into paragraphs at blank lines. */
export function toParagraphs(text: string | null | undefined): string[] {
	return (text ?? '')
		.split(/\r?\n\s*\r?\n/)
		.map((s) => s.trim())
		.filter(Boolean);
}

/** A Textarea value split into its non-empty lines. */
export function toLines(text: string | null | undefined): string[] {
	return (text ?? '')
		.split(/\r?\n/)
		.map((s) => s.trim())
		.filter(Boolean);
}

/** The block's element properties, in Block List order. */
export function blockProperties<T>(list: BlockList<ElementBlock<T>> | null | undefined): T[] {
	return (list?.items ?? []).map((b) => b.content.properties);
}

/** Testimonials without a quote are skipped. A missing rating counts as 5 stars. */
export function toTestimonials(
	list: BlockList<ElementBlock<TestimonialElement>> | null | undefined
): Testimonial[] {
	return blockProperties(list)
		.filter((t) => !!t.quote?.trim())
		.map((t) => ({
			quote: t.quote!.trim(),
			name: t.author?.trim() ?? '',
			rating: Number(t.rating) || 5
		}));
}
