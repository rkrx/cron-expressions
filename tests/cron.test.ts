import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {format} from "https://deno.land/x/date_fns/index.js";
import {CronExpression} from "../src/Cron.ts";

const t = (expression: string, offsetDate: string, expectedResult: string) => {
    return () => {
        const nextDate = new CronExpression(expression).getNextDate(parse(offsetDate), 1);
        assertEquals(format(nextDate, 'yyyy-MM-dd HH:mm:ss', undefined), expectedResult);
    };
}

//region Next minute
Deno.test('next minute within an hour', t('* * * * *', '2020-07-03 21:00:00', '2020-07-03 21:01:00'));
Deno.test('next minute, advance hour by one', t('* * * * *', '2020-07-03 21:59:00', '2020-07-03 22:00:00'));
Deno.test('next minute is at the beginning of a window in the next hour', t('10-20 * * * *', '2020-07-03 21:30:00', '2020-07-03 22:10:00'));
Deno.test('next minute, where minute has to be */5', t('*/5 * * * *', '2000-02-01 00:00:00', '2000-02-01 00:05:00'));
//endregion

//region Next hour
Deno.test('next hour within a day', t('0 * * * *', '2020-07-03 00:00:00', '2020-07-03 01:00:00'));
Deno.test('next hour, advance day by one', t('30 * * * *', '2020-07-03 23:35:00', '2020-07-04 00:30:00'));
Deno.test('next hour is at the beginning of a window in the next day', t('0 10-20 * * *', '2020-07-03 23:35:00', '2020-07-04 10:00:00'));
Deno.test('next hour, where hour has to be */5', t('0 */5 * * *', '2000-02-01 00:00:00', '2000-02-01 05:00:00'));
//endregion

//region Next day
Deno.test('next day within an month', t('0 0 4 * *', '2020-07-03 23:35:00', '2020-07-04 00:00:00'));
Deno.test('next day, advance month by one', t('0 0 1 * *', '2020-07-03 00:00:00', '2020-08-01 00:00:00'));
Deno.test('next day is at the beginning of a window in the next month', t('0 0 2 * *', '2020-07-03 23:35:00', '2020-08-02 00:00:00'));
Deno.test('next day, where day has to be */5', t('0 0 */5 1 *', '2019-12-31 00:00:00', '2020-01-01 00:00:00'));
Deno.test('next day, where day has to be */5', t('0 0 */5 1 *', '2020-01-02 00:00:00', '2020-01-06 00:00:00'));
//endregion

//region Next month
Deno.test('next month within a year', t('0 0 1 8 *', '2020-07-01 23:35:00', '2020-08-01 00:00:00'));
Deno.test('next month, advance year by one', t('0 * * * *', '2020-12-31 23:59:59', '2021-01-01 00:00:00'));
Deno.test('next month is at the beginning of a window in the next year', t('0 0 15-20 4-5 *', '2020-07-01 23:35:00', '2021-04-15 00:00:00'));
Deno.test('next month, where month has to be */5', t('0 0 1 */5 *', '2000-02-01 00:00:00', '2000-06-01 00:00:00'));
//endregion

//region Next day of week
Deno.test('find any day from sunday till thursday, where it\'s january, 1st; it\'s 0:00h; starting at 2020-01-10', t('0 0 1 1 */5', '2020-01-10 23:59:00', '2021-01-01 00:00:00'));
Deno.test('find the next sunday where month is january', t('* * * 1 0', '2020-02-01 23:59:59', '2021-01-03 00:00:00'));
Deno.test('find the next sunday where it\'s january, 1st; it\'s 0:00h; starting at 2020-01-10', t('0 0 1 1 0', '2020-01-10 23:59:00', '2023-01-01 00:00:00'));
//endregion

function parse(date: string): Date {
    const matches = date.match(/^(\d{4})-(\d{2})-(\d{2})\D(\d{2}):(\d{2}):(\d{2})$/)!.slice(1).map(x => parseInt(x));
    return new Date(matches[0], matches[1] - 1, matches[2], matches[3], matches[4], matches[5]);
}
