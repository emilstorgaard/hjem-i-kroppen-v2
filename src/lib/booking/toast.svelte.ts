export type ToastTone = 'success' | 'error' | 'info';
export type Toast = { id: number; tone: ToastTone; message: string };

const DURATION_MS = 4500;
let nextId = 1;

/** Global toast queue, rendered by `Toaster.svelte` in the root layout. */
export const toasts = $state<Toast[]>([]);

export function dismissToast(id: number): void {
	const index = toasts.findIndex((t) => t.id === id);
	if (index !== -1) toasts.splice(index, 1);
}

export function showToast(message: string, tone: ToastTone = 'info', duration = DURATION_MS): void {
	const id = nextId++;
	toasts.push({ id, tone, message });
	if (toasts.length > 3) toasts.shift();
	setTimeout(() => dismissToast(id), duration);
}

export const toast = {
	success: (message: string) => showToast(message, 'success'),
	error: (message: string) => showToast(message, 'error', 7000),
	info: (message: string) => showToast(message, 'info')
};
