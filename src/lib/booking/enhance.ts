import type { SubmitFunction } from '@sveltejs/kit';
import type { FormResult } from './forms';
import { toast } from './toast.svelte';

const NETWORK_ERROR = 'Vi kunne ikke få forbindelse. Tjek din internetforbindelse, og prøv igen.';

type Options = {
	/** Called with true when the request starts and false when it finishes. */
	pending?: (value: boolean) => void;
	onSuccess?: (result: FormResult) => void;
	onFailure?: (result: FormResult) => void;
	/** Reset the form after success (default true). */
	resetOnSuccess?: boolean;
	/** Show failures as a toast too (default false; forms show them inline). */
	toastFailures?: boolean;
	/** Re-run load functions after success (default true). */
	invalidate?: boolean;
};

/** `use:enhance` callback: pending state, a success toast with the action's message, and inline failures via `form`. */
export function feedback(options: Options = {}): SubmitFunction {
	return () => {
		options.pending?.(true);
		return async ({ result, update }) => {
			options.pending?.(false);
			if (result.type === 'success') {
				const data = (result.data ?? {}) as FormResult;
				if (data.message) toast.success(data.message);
				options.onSuccess?.(data);
				await update({
					reset: options.resetOnSuccess ?? true,
					invalidateAll: options.invalidate ?? true
				});
				return;
			}
			if (result.type === 'failure') {
				const data = (result.data ?? {}) as FormResult;
				if (options.toastFailures && data.message) toast.error(data.message);
				options.onFailure?.(data);
			}
			if (result.type === 'error') toast.error(NETWORK_ERROR);
			await update({ reset: false });
		};
	};
}
