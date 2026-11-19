// Shape returned by every form action (success or `fail`) so pages can show messages and field errors uniformly.

export type FormResult = {
	/** Identifies which form on the page the result belongs to. */
	formId?: string;
	success?: boolean;
	/** Danish message: API `detail` on failure, or a confirmation on success. */
	message?: string;
	/** Field name → Danish messages (from the API's 422 `errors`). */
	fieldErrors?: Record<string, string[]>;
	/** Submitted values to refill the form after a failed non-JS submit. Never contains passwords. */
	values?: Record<string, string>;
	parameters?: Record<string, unknown>;
};

/** Narrows SvelteKit's `form` prop to the result of one specific form. */
export function resultFor(form: unknown, formId: string): FormResult | undefined {
	const result = form as FormResult | null | undefined;
	return result?.formId === formId ? result : undefined;
}

/** First message for a field, matching the API's camelCase field paths. */
export function fieldError(result: FormResult | undefined, field: string): string | undefined {
	return result?.fieldErrors?.[field]?.[0];
}
