<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Alert from '$lib/components/booking/Alert.svelte';
	import BookingRow from '$lib/components/booking/BookingRow.svelte';
	import Button from '$lib/components/booking/Button.svelte';
	import ConfirmDialog from '$lib/components/booking/ConfirmDialog.svelte';
	import FormField from '$lib/components/booking/FormField.svelte';
	import PageShell from '$lib/components/booking/PageShell.svelte';
	import Pagination from '$lib/components/booking/Pagination.svelte';
	import { feedback } from '$lib/booking/enhance';
	import { fieldError, resultFor } from '$lib/booking/forms';
	import { withParams } from '$lib/booking/url';
	import type { BookingResponse } from '$lib/types/booking';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const firstName = $derived(data.profile.fullName.split(' ')[0]);
	const now = Date.now();

	type Group = { seriesId: string | null; title: string; bookings: BookingResponse[] };

	/** Bookings in a series are shown together; single bookings stay in date order. */
	function group(bookings: BookingResponse[]): Group[] {
		const groups: Group[] = [];
		const bySeries: Record<string, Group> = {};
		for (const b of bookings) {
			if (!b.seriesId) {
				groups.push({ seriesId: null, title: b.serviceTypeName, bookings: [b] });
				continue;
			}
			let g = bySeries[b.seriesId];
			if (!g) {
				g = {
					seriesId: b.seriesId,
					title: data.seriesTitles[b.seriesId] ?? `Forløb · ${b.serviceTypeName}`,
					bookings: []
				};
				bySeries[b.seriesId] = g;
				groups.push(g);
			}
			g.bookings.push(b);
		}
		return groups;
	}

	const upcomingGroups = $derived(group(data.upcoming));

	const profileResult = $derived(resultFor(form, 'profile'));
	const passwordResult = $derived(resultFor(form, 'password'));
	const deactivateResult = $derived(resultFor(form, 'deactivate'));
	const cancelResult = $derived(resultFor(form, 'cancel'));
	let profilePending = $state(false);
	let passwordPending = $state(false);
	let deactivatePending = $state(false);
</script>

<SeoHead
	seo={{
		metaTitle: 'Min side | Hjem i Kroppen',
		metaDescription: 'Dine bookinger og oplysninger hos Hjem i Kroppen.'
	}}
	noindex
/>

<PageShell eyebrow="Hej {firstName}" title="Min side" width="xl">
	{#snippet actions()}
		<Button href="/book" size="lg">Book en ny tid</Button>
	{/snippet}

	<noscript>
		{#if form?.success && form.message}<Alert
				tone="success"
				class="mb-6"
				message={form.message}
			/>{/if}
	</noscript>

	<div class="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
		<div class="flex flex-col gap-10">
			{#if data.loadError}
				<Alert message={data.loadError} />
			{/if}
			{#if cancelResult?.message && !cancelResult.success}<Alert
					message={cancelResult.message}
				/>{/if}

			<section aria-labelledby="upcoming-heading">
				<h2 id="upcoming-heading" class="font-serif text-2xl font-semibold sm:text-3xl">
					Kommende bookinger
				</h2>
				{#if upcomingGroups.length === 0}
					<div class="mt-5 rounded-3xl bg-mint-600/50 p-8 text-center">
						<p class="font-serif text-xl font-semibold">Du har ingen kommende tider</p>
						<p class="mt-1 text-sm text-black/65">Find en tid, der passer dig, i kalenderen.</p>
						<Button href="/book" class="mt-5">Se ledige tider</Button>
					</div>
				{:else}
					<div class="mt-5 flex flex-col gap-4">
						{#each upcomingGroups as g (g.seriesId ?? g.bookings[0].id)}
							<article class="rounded-3xl bg-white px-5 shadow-sm ring-1 ring-black/10 sm:px-6">
								{#if g.seriesId}
									<header
										class="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 py-4"
									>
										<div>
											<p class="text-xs font-medium tracking-[0.25em] text-black/55 uppercase">
												Forløb · {g.bookings.length} kommende {g.bookings.length === 1
													? 'tid'
													: 'tider'}
											</p>
											<a
												href="/book/serie/{g.seriesId}"
												class="font-serif text-xl font-semibold hover:text-mint-700">{g.title}</a
											>
										</div>
										<ConfirmDialog
											action="?/cancelSeries"
											fields={{ seriesId: g.seriesId }}
											title="Aflys hele forløbet?"
											message="Alle dine kommende tider i forløbet bliver aflyst. Tider, der allerede er startet, berøres ikke."
											confirmLabel="Aflys hele forløbet"
											variant="ghost"
										/>
									</header>
								{/if}
								<div class="divide-y divide-black/10">
									{#each g.bookings as booking (booking.id)}
										<BookingRow {booking} {now} />
									{/each}
								</div>
							</article>
						{/each}
					</div>
				{/if}
			</section>

			<section aria-labelledby="past-heading">
				<h2 id="past-heading" class="font-serif text-2xl font-semibold sm:text-3xl">
					Tidligere bookinger
				</h2>
				{#if data.past.items.length === 0}
					<p class="mt-4 text-sm text-black/60">Her kommer dine tidligere tider til at stå.</p>
				{:else}
					<div class="mt-5 rounded-3xl bg-white px-5 ring-1 ring-black/10 sm:px-6">
						<div class="divide-y divide-black/10">
							{#each data.past.items as booking (booking.id)}
								<div>
									{#if booking.seriesId}
										<p class="pt-4 text-xs font-medium tracking-[0.2em] text-black/45 uppercase">
											{data.seriesTitles[booking.seriesId] ?? 'Forløb'}
										</p>
									{/if}
									<BookingRow {booking} cancellable={false} {now} />
								</div>
							{/each}
						</div>
					</div>
					<div class="mt-4">
						<Pagination
							page={data.past.page}
							totalPages={data.past.totalPages}
							href={(p) => withParams(page.url, { tidligere: p === 1 ? null : p })}
							label="Tidligere bookinger"
						/>
					</div>
				{/if}
			</section>
		</div>

		<aside class="flex flex-col gap-6" aria-label="Mine oplysninger">
			<section class="rounded-3xl bg-mint-600/50 p-6">
				<h2 class="font-serif text-2xl font-semibold">Mine oplysninger</h2>
				<form
					method="POST"
					action="?/updateProfile"
					class="mt-4 flex flex-col gap-4"
					use:enhance={feedback({ pending: (v) => (profilePending = v), resetOnSuccess: false })}
				>
					{#if profileResult?.message && !profileResult.success}<Alert
							message={profileResult.message}
						/>{/if}
					<FormField
						label="Fulde navn"
						name="fullName"
						autocomplete="name"
						required
						maxlength={200}
						value={profileResult?.values?.fullName ?? data.profile.fullName}
						error={fieldError(profileResult, 'fullName')}
					/>
					<FormField
						label="E-mail"
						name="email"
						type="email"
						autocomplete="email"
						required
						maxlength={256}
						value={profileResult?.values?.email ?? data.profile.email}
						error={fieldError(profileResult, 'email')}
					/>
					<Button type="submit" loading={profilePending}>Gem ændringer</Button>
				</form>
			</section>

			<details
				class="group rounded-3xl bg-white p-6 ring-1 ring-black/10"
				open={!!passwordResult && !passwordResult.success}
			>
				<summary
					class="flex cursor-pointer list-none items-center justify-between font-serif text-xl font-semibold"
				>
					Skift adgangskode
					<span class="text-black/40 transition-transform group-open:rotate-45" aria-hidden="true"
						>+</span
					>
				</summary>
				<form
					method="POST"
					action="?/changePassword"
					class="mt-4 flex flex-col gap-4"
					use:enhance={feedback({ pending: (v) => (passwordPending = v) })}
				>
					{#if passwordResult?.message && !passwordResult.success}<Alert
							message={passwordResult.message}
						/>{/if}
					<FormField
						label="Nuværende adgangskode"
						name="currentPassword"
						type="password"
						autocomplete="current-password"
						required
						error={fieldError(passwordResult, 'currentPassword')}
					/>
					<FormField
						label="Ny adgangskode"
						name="newPassword"
						type="password"
						autocomplete="new-password"
						required
						minlength={8}
						hint="Mindst 8 tegn."
						error={fieldError(passwordResult, 'newPassword')}
					/>
					<FormField
						label="Gentag ny adgangskode"
						name="newPasswordRepeat"
						type="password"
						autocomplete="new-password"
						required
						error={fieldError(passwordResult, 'newPasswordRepeat')}
					/>
					<Button type="submit" variant="secondary" loading={passwordPending}
						>Skift adgangskode</Button
					>
				</form>
			</details>

			<details
				class="group rounded-3xl bg-white p-6 ring-1 ring-rust-700/20"
				open={!!deactivateResult}
			>
				<summary
					class="flex cursor-pointer list-none items-center justify-between font-serif text-xl font-semibold text-rust-700"
				>
					Deaktiver konto
					<span
						class="text-rust-700/50 transition-transform group-open:rotate-45"
						aria-hidden="true">+</span
					>
				</summary>
				<p class="mt-3 text-sm leading-relaxed text-black/65">
					Når kontoen er deaktiveret, kan du ikke længere logge ind. Kontakt mig, hvis du vil have
					den genåbnet.
				</p>
				<form
					method="POST"
					action="?/deactivate"
					class="mt-4 flex flex-col gap-4"
					use:enhance={feedback({ pending: (v) => (deactivatePending = v) })}
				>
					{#if deactivateResult?.message}<Alert message={deactivateResult.message} />{/if}
					<FormField
						label="Bekræft med din adgangskode"
						name="password"
						id="deactivate-password"
						type="password"
						autocomplete="current-password"
						required
						error={fieldError(deactivateResult, 'password')}
					/>
					<Button type="submit" variant="danger" loading={deactivatePending}
						>Deaktiver min konto</Button
					>
				</form>
			</details>
		</aside>
	</div>
</PageShell>
