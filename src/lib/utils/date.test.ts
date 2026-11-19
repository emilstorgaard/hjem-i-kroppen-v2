// Run with `npm test` (Node's built-in test runner with type stripping, no extra dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	addDays,
	dateKeyOf,
	dayRangeUtc,
	formatTime,
	fromLocalInput,
	isoWeek,
	isoWeekString,
	offsetMinutes,
	parseIsoWeek,
	startOfDayUtc,
	startOfWeek,
	toLocalInput,
	weekdayIndex,
	zonedToUtc
} from './date.ts';

test('offset is +1 in winter and +2 in summer', () => {
	assert.equal(offsetMinutes('2027-01-15T12:00:00Z'), 60);
	assert.equal(offsetMinutes('2027-07-15T12:00:00Z'), 120);
});

test('zonedToUtc converts regular wall-clock times', () => {
	assert.equal(zonedToUtc(2027, 1, 15, 17, 0).toISOString(), '2027-01-15T16:00:00.000Z');
	assert.equal(zonedToUtc(2027, 7, 15, 17, 0).toISOString(), '2027-07-15T15:00:00.000Z');
});

test('zonedToUtc around spring forward (28 March 2027)', () => {
	assert.equal(zonedToUtc(2027, 3, 28, 1, 30).toISOString(), '2027-03-28T00:30:00.000Z');
	// 02:30 does not exist; a wall clock shows 03:30.
	assert.equal(zonedToUtc(2027, 3, 28, 2, 30).toISOString(), '2027-03-28T01:30:00.000Z');
	assert.equal(zonedToUtc(2027, 3, 28, 3, 0).toISOString(), '2027-03-28T01:00:00.000Z');
});

test('zonedToUtc around fall back (31 October 2027) picks the first occurrence', () => {
	assert.equal(zonedToUtc(2027, 10, 31, 2, 30).toISOString(), '2027-10-31T00:30:00.000Z');
	assert.equal(zonedToUtc(2027, 10, 31, 3, 0).toISOString(), '2027-10-31T02:00:00.000Z');
});

test('day ranges have 23 and 25 hours on DST days', () => {
	const spring = dayRangeUtc('2027-03-28', 1);
	assert.equal(spring.from, '2027-03-27T23:00:00.000Z');
	assert.equal(spring.to, '2027-03-28T22:00:00.000Z');
	const autumn = dayRangeUtc('2027-10-31', 1);
	assert.equal(autumn.from, '2027-10-30T22:00:00.000Z');
	assert.equal(autumn.to, '2027-10-31T23:00:00.000Z');
});

test('dateKeyOf uses the Copenhagen calendar day', () => {
	assert.equal(dateKeyOf('2027-03-01T23:30:00Z'), '2027-03-02');
	assert.equal(dateKeyOf('2027-07-01T21:59:00Z'), '2027-07-01');
	assert.equal(dateKeyOf('2027-07-01T22:00:00Z'), '2027-07-02');
});

test('weeks start on Monday', () => {
	assert.equal(weekdayIndex('2027-03-08'), 0);
	assert.equal(weekdayIndex('2027-03-14'), 6);
	assert.equal(startOfWeek('2027-03-14'), '2027-03-08');
	assert.equal(addDays('2027-02-27', 2), '2027-03-01');
});

test('ISO week numbers, including year boundaries', () => {
	assert.deepEqual(isoWeek('2027-03-08'), { year: 2027, week: 10 });
	assert.deepEqual(isoWeek('2027-01-01'), { year: 2026, week: 53 });
	assert.deepEqual(isoWeek('2024-12-30'), { year: 2025, week: 1 });
	assert.equal(isoWeekString('2027-03-10'), '2027-W10');
});

test('parseIsoWeek returns Monday and rejects invalid weeks', () => {
	assert.equal(parseIsoWeek('2027-W10'), '2027-03-08');
	assert.equal(parseIsoWeek('2026-W53'), '2026-12-28');
	assert.equal(parseIsoWeek('2027-W53'), null);
	assert.equal(parseIsoWeek('nonsense'), null);
	assert.equal(startOfDayUtc(parseIsoWeek('2027-W10')!).toISOString(), '2027-03-07T23:00:00.000Z');
});

test('datetime-local round trip', () => {
	assert.equal(toLocalInput('2027-07-15T15:00:00Z'), '2027-07-15T17:00');
	assert.equal(fromLocalInput('2027-07-15T17:00'), '2027-07-15T15:00:00.000Z');
	assert.equal(fromLocalInput('2027-02-30T17:00'), null);
	assert.equal(fromLocalInput(''), null);
});

test('formats time in Danish', () => {
	assert.equal(formatTime('2027-07-15T15:00:00Z'), '17.00');
});
