// Copenhagen-time helpers. The API speaks UTC; everything the visitor sees or types is Europe/Copenhagen.
// Calendar days are handled as `YYYY-MM-DD` strings ("date keys") so no local-time Date math leaks in.
// DST is resolved through Intl, never through fixed +1/+2 offsets. No imports, so it runs under `node --test`.

export const TIME_ZONE = 'Europe/Copenhagen';
const LOCALE = 'da-DK';

/** A calendar day in Copenhagen, `YYYY-MM-DD`. */
export type DateKey = string;

type Parts = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
};

const partsFormatter = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	hourCycle: 'h23',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
});

function toDate(value: Date | string | number): Date {
	return value instanceof Date ? value : new Date(value);
}

function pad(n: number, width = 2): string {
	return String(n).padStart(width, '0');
}

/** Wall-clock parts of an instant in Copenhagen. */
export function zonedParts(value: Date | string | number): Parts {
	const map: Record<string, number> = {};
	for (const p of partsFormatter.formatToParts(toDate(value)))
		if (p.type !== 'literal') map[p.type] = Number(p.value);
	return {
		year: map.year,
		month: map.month,
		day: map.day,
		hour: map.hour % 24,
		minute: map.minute,
		second: map.second
	};
}

/** Copenhagen's offset from UTC in minutes at the given instant (60 in winter, 120 in summer). */
export function offsetMinutes(value: Date | string | number): number {
	const date = toDate(value);
	const p = zonedParts(date);
	const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
	return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60_000);
}

/**
 * The instant at which Copenhagen's wall clock shows the given time.
 * In the spring-forward gap (02:00–03:00) the time is moved forward by an hour, like a wall clock would.
 * In the autumn overlap the first (summer time) occurrence is used.
 */
export function zonedToUtc(year: number, month: number, day: number, hour = 0, minute = 0): Date {
	const wall = Date.UTC(year, month - 1, day, hour, minute);
	const first = wall - offsetMinutes(wall - 120 * 60_000) * 60_000;
	if (zonedParts(first).hour === hour) return new Date(first);
	const second = wall - offsetMinutes(wall) * 60_000;
	return new Date(Math.max(first, second));
}

export function parseDateKey(key: DateKey): { year: number; month: number; day: number } {
	const [year, month, day] = key.split('-').map(Number);
	return { year, month, day };
}

export function isDateKey(value: string | null | undefined): value is DateKey {
	if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const { year, month, day } = parseDateKey(value);
	const d = new Date(Date.UTC(year, month - 1, day));
	return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

/** The Copenhagen calendar day of an instant. */
export function dateKeyOf(value: Date | string | number): DateKey {
	const p = zonedParts(value);
	return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function todayKey(now: Date = new Date()): DateKey {
	return dateKeyOf(now);
}

export function addDays(key: DateKey, days: number): DateKey {
	const { year, month, day } = parseDateKey(key);
	const d = new Date(Date.UTC(year, month - 1, day + days));
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function addMonths(key: DateKey, months: number): DateKey {
	const { year, month } = parseDateKey(key);
	const d = new Date(Date.UTC(year, month - 1 + months, 1));
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-01`;
}

export function startOfMonth(key: DateKey): DateKey {
	return `${key.slice(0, 7)}-01`;
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(key: DateKey): number {
	const { year, month, day } = parseDateKey(key);
	return (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7;
}

export function startOfWeek(key: DateKey): DateKey {
	return addDays(key, -weekdayIndex(key));
}

/** The 7 days (Mon–Sun) of the week containing `key`. */
export function weekDays(key: DateKey): DateKey[] {
	const monday = startOfWeek(key);
	return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** ISO 8601 week-numbering year and week (weeks start Monday; week 1 contains the first Thursday). */
export function isoWeek(key: DateKey): { year: number; week: number } {
	const thursday = addDays(startOfWeek(key), 3);
	const { year } = parseDateKey(thursday);
	const jan4 = `${year}-01-04`;
	const week1Monday = startOfWeek(jan4);
	const diffDays = Math.round(
		(Date.parse(`${thursday}T00:00:00Z`) - Date.parse(`${week1Monday}T00:00:00Z`)) / 86_400_000
	);
	return { year, week: Math.floor(diffDays / 7) + 1 };
}

/** `2027-W10` */
export function isoWeekString(key: DateKey): string {
	const { year, week } = isoWeek(key);
	return `${year}-W${pad(week)}`;
}

/** Monday of an ISO week string like `2027-W10`, or null when invalid. */
export function parseIsoWeek(value: string | null | undefined): DateKey | null {
	const m = value?.match(/^(\d{4})-W(\d{2})$/);
	if (!m) return null;
	const year = Number(m[1]);
	const week = Number(m[2]);
	if (week < 1 || week > 53) return null;
	const monday = addDays(startOfWeek(`${year}-01-04`), (week - 1) * 7);
	return isoWeek(monday).year === year ? monday : null;
}

/** The UTC instant at which the Copenhagen day starts (handles 23- and 25-hour days). */
export function startOfDayUtc(key: DateKey): Date {
	const { year, month, day } = parseDateKey(key);
	return zonedToUtc(year, month, day, 0, 0);
}

/** `[from, to)` in UTC ISO strings for whole Copenhagen days, ready for the API's `from`/`to`. */
export function dayRangeUtc(firstDay: DateKey, dayCount: number): { from: string; to: string } {
	return {
		from: startOfDayUtc(firstDay).toISOString(),
		to: startOfDayUtc(addDays(firstDay, dayCount)).toISOString()
	};
}

/** Value for `<input type="datetime-local">`: `YYYY-MM-DDTHH:mm` in Copenhagen. */
export function toLocalInput(value: Date | string | number): string {
	const p = zonedParts(value);
	return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/** Parses a `datetime-local` value as Copenhagen time and returns the UTC ISO string, or null when invalid. */
export function fromLocalInput(value: string | null | undefined): string | null {
	const m = value?.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
	if (!m) return null;
	const [year, month, day, hour, minute] = m.slice(1).map(Number);
	if (!isDateKey(`${m[1]}-${m[2]}-${m[3]}`) || hour > 23 || minute > 59) return null;
	return zonedToUtc(year, month, day, hour, minute).toISOString();
}

/** Combines a date key and `HH:mm` into a UTC ISO string. */
export function zonedDateTimeToIso(key: DateKey, time: string): string | null {
	return fromLocalInput(`${key}T${time}`);
}

function formatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	return new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options });
}

const timeFmt = formatter({ hour: '2-digit', minute: '2-digit' });
const dateFmt = formatter({ day: 'numeric', month: 'long', year: 'numeric' });
const shortDateFmt = formatter({ day: 'numeric', month: 'short' });
const weekdayDateFmt = formatter({ weekday: 'long', day: 'numeric', month: 'long' });
const dateTimeFmt = formatter({
	weekday: 'short',
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
});
const weekdayShortFmt = formatter({ weekday: 'short' });
const monthYearFmt = formatter({ month: 'long', year: 'numeric' });

/** Noon UTC of a date key: always the same Copenhagen day, safe to format with the Copenhagen time zone. */
function keyToNoon(key: DateKey): Date {
	return new Date(`${key}T12:00:00Z`);
}

/** `17.00` */
export function formatTime(value: Date | string): string {
	return timeFmt.format(toDate(value));
}

/** `17.00–18.30` */
export function formatTimeRange(start: Date | string, end: Date | string): string {
	return `${formatTime(start)}–${formatTime(end)}`;
}

/** `1. marts 2027` */
export function formatDate(value: Date | string): string {
	return dateFmt.format(toDate(value));
}

/** `man. 1. mar. 2027 17.00` */
export function formatDateTime(value: Date | string): string {
	return dateTimeFmt.format(toDate(value));
}

/** `mandag 1. marts` for a date key. */
export function formatDayLong(key: DateKey): string {
	return weekdayDateFmt.format(keyToNoon(key));
}

/** `mandag 1. marts` for an instant. */
export function formatWeekdayDate(value: Date | string): string {
	return weekdayDateFmt.format(toDate(value));
}

/** `1. mar.` */
export function formatDayShort(key: DateKey): string {
	return shortDateFmt.format(keyToNoon(key));
}

/** `man.` */
export function formatWeekdayShort(key: DateKey): string {
	return weekdayShortFmt.format(keyToNoon(key));
}

/** `marts 2027` */
export function formatMonthYear(key: DateKey): string {
	return monthYearFmt.format(keyToNoon(key));
}

export function dayOfMonth(key: DateKey): number {
	return parseDateKey(key).day;
}

/** `Uge 10 · 8.–14. marts 2027` */
export function formatWeekLabel(monday: DateKey): string {
	const sunday = addDays(monday, 6);
	const a = parseDateKey(monday);
	const b = parseDateKey(sunday);
	const range =
		a.month === b.month
			? `${a.day}.–${formatDate(keyToNoon(sunday))}`
			: a.year === b.year
				? `${formatDayShort(monday)} – ${formatDate(keyToNoon(sunday))}`
				: `${formatDate(keyToNoon(monday))} – ${formatDate(keyToNoon(sunday))}`;
	return `Uge ${isoWeek(monday).week} · ${range}`;
}

/** Minutes between two instants. */
export function minutesBetween(start: Date | string, end: Date | string): number {
	return Math.round((toDate(end).getTime() - toDate(start).getTime()) / 60_000);
}
