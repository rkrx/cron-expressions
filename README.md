# cron-expressions

[![Build Status](https://travis-ci.org/rkrx/cron-expressions.svg?branch=master)](https://travis-ci.org/rkrx/cron-expressions)

Cron expression parser and tooling for typescript and deno

## Example

```typescript
import {CronExpression} from 'https://raw.githubusercontent.com/rkrx/cron-expressions/master/mod.ts';

// Next monday
console.log(new CronExpression('0 0 * * 0').getNextDate());

// Next monday relative to a given offset date
const now = new Date(Date.parse('01 Jan 2020 00:00:00 GMT'));
console.log(new CronExpression('0 0 * * 0').getNextDate(now));
```

## Features

* Basic cron expressions
  * [x] `*` any value
  * [x] `,` value list separator (e.g. `1,2,5`)
  * [x] `-` range of values (e.g. `15-30`)
  * [x] `/` step values (e.g. `*/5`)
  * [x] Any combination of these (e.g. `5-10,20-25,*/15`)
* Non-standard
  * [x] Constants
    * [x] `@yearly`, `@annually` = `0 0 1 1 *`
    * [x] `@monthly` = `0 0 1 * *`
    * [x] `@weekly` = `0 0 * * 0`
    * [x] `@daily` = `0 0 * * *`
    * [x] `@hourly` = `0 * * * *`
  * [x] Named week days (`MON` - `SUN`)
  * [x] Handle number overflow (`55-5`) which translates to `0-5, 55-59` when used for minutes
  * [ ] Increments of ranges (`2-59/3`)
  * [ ] `W` to find the nearest weekday for a given day of the month
  * [ ] `L` to find the last given weekday of a month
  * [ ] Hash (`#`) to find the nth weekday of a given month

## Side notes

* Uses only the built-in date library. No third party dependencies.
* Tested against hundreds of thousands of test-cases and used results from other libraries.

## TODO

* The error-handling is still not very good, when the input data is garbage.
* Still missing some features