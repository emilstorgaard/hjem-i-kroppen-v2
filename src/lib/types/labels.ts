/** Button and section texts edited on "Indstillinger" (group "Tekster"). */
export type SettingsLabels = {
	/** Header button to the booking calendar. */
	bookButtonText: string;
	/** Header link to the login page. */
	loginButtonText: string;
};

/** Button and section texts edited on the home page, next to the sections they belong to. */
export type HomeLabels = {
	/** Button in the hero that scrolls to the therapy cards. */
	heroButtonText: string;
	/** Heading above the testimonials on the home page. Therapy pages have their own. */
	testimonialsHeading: string;
	/** Mail button in the contact section. */
	contactButtonText: string;
	/** Link on the therapy cards. */
	readMoreText: string;
	/** Button in the "Om mig" section. */
	readMoreAboutText: string;
	/** Book buttons in the contact section and on the booking options. */
	bookText: string;
	dmtLabel: string;
	/** Label above the therapy cards and on the therapy pages. */
	therapyLabel: string;
	/** Label above the testimonials on the home page. Therapy pages have their own. */
	testimonialsLabel: string;
	contactLabel: string;
};

export type SiteLabels = SettingsLabels & HomeLabels;
