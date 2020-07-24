# cron-expressions

[![Build Status](https://travis-ci.org/rkrx/cron-expressions.svg?branch=master)](https://travis-ci.org/rkrx/cron-expressions)

Cron expression parser and tooling for typescript and deno

## Example

```typescript
import {cron} from 'https://raw.githubusercontent.com/rkrx/cron-expressions/master/mod.ts';

// Next monday
console.log(cron('0 0 * * 0').getNextDate()); // Next `Date`

// Next monday relative to a given offset date
const now = new Date(Date.parse('01 Jan 2020 00:00:00 GMT'));
console.log(cron('0 0 * * 0').getNextDate(now)); // 2020-01-04T23:00:00.000Z
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
  * [ ] Hash (`#`) to find the nth weekday of a given month

## Side notes

* Uses only the built-in date library. No third party dependencies.
* Tested against hundreds of thousands of test-cases and used results from other libraries.

## TODO

* The error-handling is still not very good, when the input data is garbage.
* Still missing some features