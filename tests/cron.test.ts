import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {format} from "https://deno.land/x/date_fns/index.js";
import {CronExpression} from "../src/cron.ts";
import {getNumberForNamedWeekDay, replaceWeekDayNamesWithNumbers} from "../src/named-weekdays.ts";
import {parseValueList} from "../src/tools.ts";

//region Parse parts
Deno.test('parse *', () => assertEquals([{start: 0, end: 59}], parseValueList('*', 0, 59)));
Deno.test('parse 10-20', () => assertEquals([{start: 10, end: 20}], parseValueList('10-20', 0, 59)));
Deno.test('parse 20-10', () => assertEquals([{start: 0, end: 10}, {start: 20, end: 59}], parseValueList('20-10', 0, 59)));
Deno.test('parse 50-70', () => assertEquals([{start: 0, end: 10}, {start: 50, end: 59}], parseValueList('50-70', 0, 59)));
//endregion

//region Next minute
Deno.test('next minute within an hour', macro('* * * * *', '2020-07-03 21:00:00', '2020-07-03 21:01:00'));
Deno.test('next minute, advance hour by one', macro('* * * * *', '2020-07-03 21:59:00', '2020-07-03 22:00:00'));
Deno.test('next minute is at the beginning of a window in the next hour', macro('10-20 * * * *', '2020-07-03 21:30:00', '2020-07-03 22:10:00'));
Deno.test('next minute, where minute has to be */5', macro('*/5 * * * *', '2000-02-01 00:00:00', '2000-02-01 00:05:00'));
//endregion

//region Next hour
Deno.test('next hour within a day', macro('0 * * * *', '2020-07-03 00:00:00', '2020-07-03 01:00:00'));
Deno.test('next hour, advance day by one', macro('30 * * * *', '2020-07-03 23:35:00', '2020-07-04 00:30:00'));
Deno.test('next hour is at the beginning of a window in the next day', macro('0 10-20 * * *', '2020-07-03 23:35:00', '2020-07-04 10:00:00'));
Deno.test('next hour, where hour has to be */5', macro('0 */5 * * *', '2000-02-01 00:00:00', '2000-02-01 05:00:00'));
//endregion

//region Next day
Deno.test('next day within an month', macro('0 0 4 * *', '2020-07-03 23:35:00', '2020-07-04 00:00:00'));
Deno.test('next day, advance month by one', macro('0 0 1 * *', '2020-07-03 00:00:00', '2020-08-01 00:00:00'));
Deno.test('next day is at the beginning of a window in the next month', macro('0 0 2 * *', '2020-07-03 23:35:00', '2020-08-02 00:00:00'));
Deno.test('next day, where day has to be */5', macro('0 0 */5 1 *', '2019-12-31 00:00:00', '2020-01-01 00:00:00'));
Deno.test('next day, where day has to be */5', macro('0 0 */5 1 *', '2020-01-02 00:00:00', '2020-01-06 00:00:00'));
//endregion

//region Next month
Deno.test('next month within a year', macro('0 0 1 8 *', '2020-07-01 23:35:00', '2020-08-01 00:00:00'));
Deno.test('next month, advance year by one', macro('0 * * * *', '2020-12-31 23:59:59', '2021-01-01 00:00:00'));
Deno.test('next month is at the beginning of a window in the next year', macro('0 0 15-20 4-5 *', '2020-07-01 23:35:00', '2021-04-15 00:00:00'));
Deno.test('next month, where month has to be */5', macro('0 0 1 */5 *', '2000-02-01 00:00:00', '2000-06-01 00:00:00'));
//endregion

//region Next day of week
Deno.test('find any day from sunday till thursday, where it\'s january, 1st; it\'s 0:00h; starting at 2020-01-10', macro('0 0 1 1 */5', '2020-01-10 23:59:00', '2021-01-01 00:00:00'));
Deno.test('find the next sunday where month is january', macro('* * * 1 0', '2020-02-01 23:59:59', '2021-01-03 00:00:00'));
Deno.test('find the next sunday where it\'s january, 1st; it\'s 0:00h; starting at 2020-01-10', macro('0 0 1 1 0', '2020-01-10 23:59:00', '2023-01-01 00:00:00'));
//endregion

//region Named week days 
Deno.test('MON equals 1', () => assertEquals(getNumberForNamedWeekDay('MON'), 1));
Deno.test('TUE equals 2', () => assertEquals(getNumberForNamedWeekDay('TUE'), 2));
Deno.test('WED equals 3', () => assertEquals(getNumberForNamedWeekDay('WED'), 3));
Deno.test('THU equals 4', () => assertEquals(getNumberForNamedWeekDay('THU'), 4));
Deno.test('FRI equals 5', () => assertEquals(getNumberForNamedWeekDay('FRI'), 5));
Deno.test('SAT equals 6', () => assertEquals(getNumberForNamedWeekDay('SAT'), 6));
Deno.test('SUN equals 0', () => assertEquals(getNumberForNamedWeekDay('SUN'), 0));
Deno.test('SUN-WED means 0-3', () => assertEquals(replaceWeekDayNamesWithNumbers('SUN-WED'), '0-3'));
Deno.test('find the next sunday where it\'s january, 1st; it\'s 0:00h; starting at 2020-01-10 using a named weekday', macro('0 0 1 1 SUN', '2020-01-10 23:59:00', '2023-01-01 00:00:00'));
Deno.test('find the next day, that is some day between TUE to FRI; starting at 2020-01-10 using named weekdays', macro('0 0 * * TUE-FRI', '2020-01-10 00:00:00', '2020-01-14 00:00:00'));
Deno.test('find the next day, that is some day between TUE to FRI; starting at 2020-01-14 using named weekdays', macro('0 0 * * TUE-FRI', '2020-01-14 00:00:00', '2020-01-15 00:00:00'));
Deno.test('find the next day, that is some day between TUE to FRI; starting at 2020-01-15 using named weekdays', macro('0 0 * * TUE-FRI', '2020-01-15 00:00:00', '2020-01-16 00:00:00'));
Deno.test('find the next day, that is some day between TUE to FRI; starting at 2020-01-16 using named weekdays', macro('0 0 * * TUE-FRI', '2020-01-16 00:00:00', '2020-01-17 00:00:00'));
Deno.test('find the next day, that is some day between TUE to FRI; starting at 2020-01-17 using named weekdays', macro('0 0 * * TUE-FRI', '2020-01-17 00:00:00', '2020-01-21 00:00:00'));
Deno.test('find the next day, that is some day between TUE to WED and 4-5; starting at 2020-01-10 using named weekdays', macro('0 0 * * TUE-WED,4-5', '2020-01-10 00:00:00', '2020-01-14 00:00:00'));
Deno.test('find the next day, that is some day between TUE to WED and 4-5; starting at 2020-01-17 using named weekdays', macro('0 0 * * TUE-WED,4-5', '2020-01-17 00:00:00', '2020-01-21 00:00:00'));
//endregion

function macro(expression: string, offsetDate: string, expectedResult: string) {
    return () => {
        const nextDate = new CronExpression(expression).getNextDate(parse(offsetDate), 1);
        assertEquals(format(nextDate, 'yyyy-MM-dd HH:mm:ss', undefined), expectedResult);
    };
}

function parse(date: string): Date {
    const matches = date.match(/^(\d{4})-(\d{2})-(\d{2})\D(\d{2}):(\d{2}):(\d{2})$/)!.slice(1).map(x => parseInt(x));
    return new Date(matches[0], matches[1] - 1, matches[2], matches[3], matches[4], matches[5]);
}
