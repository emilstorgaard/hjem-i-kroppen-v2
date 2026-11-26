import type { SeoProperties } from './seo';
import type { UmbracoMedia } from './umbraco';
import type { ContactProperties } from './contact';
import type { HeroProperties } from './hero';
import type { DmtProperties } from './dmt';
import type { Address } from './address';
import type { Testimonial, TestimonialElement } from './testimonial';
import type { BlockList, ElementBlock } from './elementTypes';
import type { HomeLabels } from './labels';

type Text = string | null;

/**
 * The home page ("Forside", alias `homePage`, Umbraco path `forside`) exactly as the Delivery API returns it. Every
 * property can be missing or null while the editor is still filling in the page.
 */
export type HomePageContent = {
	id: string;
	name: string;
	contentType: string;
	updateDate?: string;
	/** The button and section texts are Textstrings next to their sections; empty ones fall back to the defaults. */
	properties: Partial<SeoProperties> &
		Partial<Record<keyof HomeLabels, Text>> & {
			/** Textarea, so the title can be split over several lines. */
			heroTitle?: Text;
			/** Textarea, one line per paragraph. */
			heroText?: Text;
			/** Media Picker (Video, max 1). */
			heroVideo?: UmbracoMedia[] | null;
			dmtHeading?: Text;
			/** Textarea, paragraphs separated by a blank line. */
			dmtText?: Text;
			/** Element type Punkt (`dmtPoint`): `title` and `text`. */
			dmtPoints?: BlockList<ElementBlock<{ title?: Text; text?: Text }>> | null;
			/** Element type Anmeldelse, the same as on the therapy pages. */
			testimonials?: BlockList<ElementBlock<TestimonialElement>> | null;
			contactHeading?: Text;
			/** Textarea, paragraphs separated by a blank line. */
			contactText?: Text;
			email?: Text;
			phone?: Text;
			/** Element type Adresse (`address`): `label`, `streetAddress`, `postalCode` and `city`. */
			addresses?: BlockList<
				ElementBlock<{ label?: Text; streetAddress?: Text; postalCode?: Text; city?: Text }>
			> | null;
		};
};

export type HomePageProperties = SeoProperties &
	HeroProperties &
	ContactProperties & {
		dmt: DmtProperties;
		testimonials: Testimonial[];
		/** Shown on the home page and every therapy page. The first one is the business address in structured data. */
		addresses: Address[];
		/** The button and section texts that are filled in. Read them with `getLabels()`. */
		labels: Partial<HomeLabels>;
	};

/** The home page ready for rendering. */
export type HomePage = {
	id: string;
	name: string;
	updatedAt?: string;
	properties: HomePageProperties;
};
