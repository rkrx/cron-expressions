# cron-expressions
Cron expression parser and tooling for typescript and deno

## Features

* Basic cron expressions
  * [x] `*` any value
  * [x] `,` value list separator (e.g. `1,2,5`)
  * [x] `-` range of values (e.g. `15-30`)
  * [x] `/` step values (e.g. `*/5`)
  * [x] Any combination of these (e.g. `5-10,20-25,*/15`)
* Non-standard
  * [x] Constants (`@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@hourly`, `@reboot`)
  * [ ] Named week days (`MON` - `SUN`)
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