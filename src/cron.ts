import {getNextDateIteration, CronDef, parseExpression} from "./tools.ts";

/**
 * ```
 * +----------- minute (0 - 59)
 * ¦ +--------- hour (0 - 23)
 * ¦ ¦ +------- day of the month (1 - 31)
 * ¦ ¦ ¦ +----- month (1 - 12)
 * ¦ ¦ ¦ ¦ +--- day of the week (0-6; SUN-SAT)
 * ¦ ¦ ¦ ¦ ¦
 * * * * * *
 * ```
 */
export function cron(expression: string): CronExpression {
    return new CronExpression(expression);
}

export class CronExpression {
    private readonly def: CronDef;

    constructor(expression: string) {
        this.def = parseExpression(expression);
    }

    getNextDate(now: Date|null = null, iterations: number = 1): Date {
        let cdt: Date = now === null ? new Date() : now;
        for(let i = 0; i < iterations; i++) {
            cdt = getNextDateIteration(cdt, this.def)
        }
        return cdt;
    }

    *getNextDates(now: Date|null = null, iterations: number|null = 1): IterableIterator<Date> {
        let cdt: Date = now === null ? new Date() : now;
        for(let i = 0; iterations === null || i < iterations; i++) {
            yield getNextDateIteration(cdt, this.def)
        }
    }
}