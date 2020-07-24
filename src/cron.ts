import {getNextDateIteration, CronDef, parseExpression} from "./tools.ts";

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