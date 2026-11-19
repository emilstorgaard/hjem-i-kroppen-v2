<script lang="ts">
	import { enhance } from '$app/forms';
	import { CATEGORY_LABEL, CATEGORY_STYLE } from '$lib/booking/categories';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, type FormResult } from '$lib/booking/forms';
	import { SPOTS_TONE_CLASS, spotsLabel } from '$lib/booking/spots';
	import {
		formatDateTime,
		formatTimeRange,
		formatWeekdayDate,
		minutesBetween
	} from '$lib/utils/date';
	import type { SessionResponse, UserResponse } from '$lib/types/booking';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';
	import ConfirmDialog from './ConfirmDialog.svelte';
	import LoginForm from './LoginForm.svelte';
	import Modal from './Modal.svelte';
	import RegisterForm from './RegisterForm.svelte';

	type Props = {
		session: SessionResponse | null;
		user: UserResponse | null;
		/** The visitor's active booking on this session, if any. */
		bookingId?: string;
		/** The visitor has bookings in the session's series. */
		seriesBooked?: boolean;
		/** Result of the last booking form action on the page. */
		result?: FormResult;
		loginResult?: FormResult;
		registerResult?: FormResult;
		/** Where to come back to after signing in (the page with this session open). */
		resumeHref: string;
		closeHref: string;
		onclose: () => void;
		/** Builds a form action URL (default `?/<name>`). */
		actionHref?: (name: string) => string;
	};

	let {
		session,
		user,
		bookingId,
		seriesBooked = false,
		result,
		loginResult,
		registerResult,
		resumeHref,
		closeHref,
		onclose,
		actionHref = (name: string) => `?/${name}`
	}: Props = $props();

	let pending = $state(false);
	let authMode = $derived<'login' | 'register'>(registerResult ? 'register' : 'login');

	const started = $derived(session ? Date.parse(session.startsAt) <= Date.now() : false);
	const spots = $derived(spotsLabel(session?.availableSpots ?? 0));
	const bookResult = $derived(result?.formId === 'book' ? result : undefined);
	const cancelResult = $derived(
		result?.formId === 'cancel' && !result.success ? result : undefined
	);
	/** For a full series booking the API names the full session; tell the visitor which one it was. */
	const fullSessionAt = $derived(
		bookResult?.parameters &&
			typeof bookResult.parameters.startsAt === 'string' &&
			bookResult.parameters.sessionId !== session?.id
			? formatDateTime(bookResult.parameters.startsAt)
			: null
	);
</script>

<Modal
	open={!!session}
	title={session?.serviceTypeName ?? ''}
	eyebrow={session ? CATEGORY_LABEL[session.category] : undefined}
	{onclose}
	{closeHref}
	size="md"
>
	{#if session}
		<dl class="grid gap-3 text-sm">
			<div class="flex items-start gap-3">
				<dt class="sr-only">Tidspunkt</dt>
				<span
					class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full {CATEGORY_STYLE[session.category].dot}"
					aria-hidden="true"
				></span>
				<dd>
					<p class="font-semibold capitalize">{formatWeekdayDate(session.startsAt)}</p>
					<p class="text-black/65 tabular-nums">
						kl. {formatTimeRange(session.startsAt, session.endsAt)} · {minutesBetween(
							session.startsAt,
							session.endsAt
						)} min.
					</p>
				</dd>
			</div>
			{#if session.location}
				<div class="flex gap-3">
					<dt class="w-2.5 shrink-0"><span class="sr-only">Sted</span></dt>
					<dd class="text-black/75">{session.location}</dd>
				</div>
			{/if}
			{#if session.seriesId}
				<div class="flex gap-3">
					<dt class="w-2.5 shrink-0"><span class="sr-only">Forløb</span></dt>
					<dd>
						Del af forløbet
						<a
							href="/book/serie/{session.seriesId}"
							class="font-semibold text-mint-700 underline-offset-4 hover:underline"
						>
							{session.seriesTitle ?? 'Se forløbet'}
						</a>
					</dd>
				</div>
			{/if}
			<div class="flex gap-3">
				<dt class="w-2.5 shrink-0"><span class="sr-only">Pladser</span></dt>
				<dd class={bookingId ? 'font-semibold text-mint-700' : SPOTS_TONE_CLASS[spots.tone]}>
					{bookingId ? 'Du er booket på denne tid' : spots.text}
				</dd>
			</div>
		</dl>

		{#if session.notes}
			<p
				class="mt-5 rounded-2xl bg-mint-600/50 p-4 text-sm leading-relaxed whitespace-pre-line text-black/75"
			>
				{session.notes}
			</p>
		{/if}

		<div class="mt-6 border-t border-black/10 pt-6">
			{#if bookingId}
				<div class="rounded-3xl bg-mint-200/60 p-5 ring-1 ring-mint-700/20">
					<p class="font-serif text-xl font-semibold text-mint-700">Du er booket ✓</p>
					<p class="mt-1 text-sm text-black/70">
						Du kan se og aflyse dine tider på <a
							href="/min-side"
							class="font-semibold underline-offset-4 hover:underline">Min side</a
						>.
					</p>
				</div>
				{#if cancelResult?.message}<Alert class="mt-4" message={cancelResult.message} />{/if}
				<div class="mt-4 flex flex-wrap gap-3">
					{#if started}
						<p class="text-sm text-black/60">
							Tiden er startet, så bookingen kan ikke længere aflyses.
						</p>
					{:else}
						<ConfirmDialog
							action={actionHref('cancel')}
							fields={{ bookingId }}
							title="Aflys booking?"
							message="Vil du aflyse din booking {formatDateTime(
								session.startsAt
							)}? Pladsen bliver frigivet til andre."
							confirmLabel="Aflys booking"
							variant="secondary"
							size="md"
						/>
						{#if session.seriesId && seriesBooked}
							<ConfirmDialog
								action={actionHref('cancelSeries')}
								fields={{ seriesId: session.seriesId }}
								title="Aflys hele forløbet?"
								message="Alle dine kommende tider i forløbet bliver aflyst. Tider, der allerede er startet, berøres ikke."
								confirmLabel="Aflys hele forløbet"
								variant="ghost"
								size="md"
							/>
						{/if}
					{/if}
				</div>
			{:else if started}
				<Alert tone="info" message="Tiden er startet og kan ikke længere bookes." />
			{:else if !user}
				<p class="font-serif text-xl font-semibold">Log ind for at booke</p>
				<p class="mt-1 text-sm text-black/65">Du kommer direkte tilbage til denne tid bagefter.</p>
				<div
					class="mt-4 grid grid-cols-2 gap-1 rounded-full bg-black/5 p-1 text-sm font-medium"
					role="group"
					aria-label="Log ind eller opret bruger"
				>
					<button
						type="button"
						class="rounded-full py-2 transition-colors {authMode === 'login'
							? 'bg-white shadow-sm'
							: 'text-black/60 hover:text-black'}"
						aria-pressed={authMode === 'login'}
						onclick={() => (authMode = 'login')}>Log ind</button
					>
					<button
						type="button"
						class="rounded-full py-2 transition-colors {authMode === 'register'
							? 'bg-white shadow-sm'
							: 'text-black/60 hover:text-black'}"
						aria-pressed={authMode === 'register'}
						onclick={() => (authMode = 'register')}>Opret bruger</button
					>
				</div>
				<div class="mt-5">
					{#if authMode === 'login'}
						<LoginForm redirectTo={resumeHref} result={loginResult} />
					{:else}
						<RegisterForm redirectTo={resumeHref} result={registerResult} />
					{/if}
				</div>
			{:else if session.availableSpots <= 0}
				<Alert tone="info">
					Tiden er desværre fuldt booket.
					{#if session.seriesId}<a
							href="/book/serie/{session.seriesId}"
							class="font-semibold underline">Se forløbets andre tider</a
						>.{/if}
				</Alert>
			{:else}
				<form
					method="POST"
					action={actionHref('book')}
					class="flex flex-col gap-4"
					use:enhance={feedback({ pending: (v) => (pending = v), resetOnSuccess: true })}
				>
					<input type="hidden" name="sessionId" value={session.id} />
					{#if session.seriesId}<input
							type="hidden"
							name="seriesId"
							value={session.seriesId}
						/>{/if}
					{#if bookResult?.message && !bookResult.success}
						<Alert>
							{bookResult.message}
							{#if fullSessionAt}<br /><span class="text-black/70"
									>Det gælder tiden {fullSessionAt}.</span
								>{/if}
						</Alert>
					{/if}
					<div class="flex flex-col gap-1.5">
						<label for="booking-note" class="text-sm font-medium text-black/80"
							>Besked til terapeuten <span class="font-normal text-black/50">(valgfri)</span></label
						>
						<textarea
							id="booking-note"
							name="note"
							rows="3"
							maxlength="1000"
							class="field-input resize-y {fieldError(bookResult, 'note')
								? 'field-input-error'
								: ''}"
							placeholder="Fx noget, jeg skal vide inden vi ses"
							value={bookResult?.values?.note ?? ''}
							aria-invalid={fieldError(bookResult, 'note') ? 'true' : undefined}></textarea>
						{#if fieldError(bookResult, 'note')}<p class="text-xs font-medium text-rust-700">
								{fieldError(bookResult, 'note')}
							</p>{/if}
					</div>
					<div class="flex flex-col gap-3 sm:flex-row">
						<Button type="submit" size="lg" loading={pending} class="sm:flex-1">
							{session.seriesId ? 'Book kun denne tid' : 'Book'}
						</Button>
						{#if session.seriesId}
							<Button
								type="submit"
								size="lg"
								variant="dark"
								formaction={actionHref('bookSeries')}
								disabled={pending}
								class="sm:flex-1"
							>
								Book hele forløbet
							</Button>
						{/if}
					</div>
					{#if session.seriesId}
						<p class="text-xs leading-relaxed text-black/55">
							"Book hele forløbet" booker alle forløbets kommende tider på én gang. Er én af dem
							fuldt booket, bookes ingen af dem.
						</p>
					{/if}
				</form>
			{/if}
		</div>
	{/if}
</Modal>
