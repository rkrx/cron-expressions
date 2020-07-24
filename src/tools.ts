import {replaceWeekDayNamesWithNumbers} from "./named-weekdays.ts";

export interface Range {
    start: number;
    end: number;
}

export interface CronDef {
    min: Range[];
    hour: Range[];
    dom: (year: number, month: number) => Range[];
    month: Range[];
    dow: boolean[];
}

export function toInt(input: string): number {
    const num = parseInt(input);
    if(isNaN(num)) {
        throw new Error(`Invalid numeric value: ${input}`);
    }
    return num;
}

export function parseExpression(expression: string): CronDef {
    expression = convert(expression);
    const parts = expression.split(/\s+/);
    parts.push('*', '*', '*', '*', '*');
    const numericDow = replaceWeekDayNamesWithNumbers(parts[4]);
    const dow = parseValueList(numericDow, 0, 6);
    const daysOfWeek = [];
    for(let d = 0; d < 7; d++) {
        daysOfWeek.push(false);
        for(const dowRange of dow) {
            if(dowRange.start <= d && dowRange.end >= d) {
                daysOfWeek[d] = true;
            }
        }
    }
    return {
        min: parseValueList(parts[0], 0, 59),
        hour: parseValueList(parts[1], 0, 23),
        dom: (year, month) => parseValueList(parts[2], 1, getDaysInMonth(new Date(year, month))),
        month: parseValueList(parts[3], 1, 12).map((r: Range) => ({start: r.start - 1, end: r.end - 1})),
        dow: daysOfWeek
    };
}

export function getNextDateIteration(now: Date, def: CronDef) {
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(now.getMinutes() + 1);

    for(let i = 0; i < 10000; i++) {
        const nextMinute = getNextNumber(def.min, now.getMinutes());
        if(nextMinute === null) {
            now.setMinutes(0);
            now.setHours(now.getHours() + 1);
            continue;
        } else {
            now.setMinutes(nextMinute);
        }

        const nextHour = getNextNumber(def.hour, now.getHours());
        if(nextHour === null) {
            now.setHours(0);
            now.setDate(now.getDate() + 1);
            continue;
        } else {
            now.setHours(nextHour);
        }

        const nextDay = getNextNumber(def.dom(now.getFullYear(), now.getMonth()), now.getDate());
        if(nextDay === null) {
            now.setDate(1);
            now.setMonth(now.getMonth() + 1);
            continue;
        } else {
            now.setDate(nextDay);
        }

        if(!def.dow[now.getDay()]) {
            now.setDate(now.getDate() + 1);
            continue;
        }

        const nextMonth = getNextNumber(def.month, now.getMonth());
        if(nextMonth === null) {
            now.setMonth(0);
            now.setFullYear(now.getFullYear() + 1);
            continue;
        } else {
            now.setMonth(nextMonth);
        }

        return now;
    }

    throw new Error('No next date found after 10000 iterations');
}

export function getNextNumber(ranges: Range[], offset: number): number|null {
    for(const range of resolveRanges(ranges, offset)) {
        if(range.start <= offset && range.end >= offset) {
            return offset;
        }
        if(range.start > offset) {
            return range.start;
        }
    }
    return null;
}

export function *resolveRanges(ranges: Range[], offset: number): IterableIterator<Range> {
    if(ranges.length < 1) {
    throw new Error('Empty range')
}
for(const range of ranges) {
    if(range.start > range.end) {
        throw new Error(`Invalid range: ${range.start} > ${range.end}`);
    }
    if(range.end < offset) {
        continue;
    }
    yield range;
}
}

export function convert(expression: string): string {
    switch(expression) {
        case '@annually':
        case '@yearly': return '0 0 1 1 *';
        case '@monthly': return '0 0 1 * *';
        case '@weekly': return '0 0 * * 0';
        case '@daily': return '0 0 * * *';
        case '@hourly': return '0 * * * *';
        default: return expression;
    }
}

export function parseValueList(input: string, min: number, max: number): Range[] {
    const result: Range[] = [];
    input.split(',')
        .forEach(x => parseValue(x, min, max).forEach(x => result.push(x)));
    return result.sort((a, b) => a.start < b.start ? -1 : (a.start > b.start ? 1 : 0));
}

export function parseValue(input: string, min: number, max: number): Range[] {
    if(input === '*') {
        return [{start: min, end: max}];
    }
    if(input.match(/^\d+$/)) {
        const x = toInt(input) % (max + 1);
        return [{start: mod(x), end: mod(x)}];
    }
    if(input.match(/^\d+-\d+$/)) {
        const [start, end] = input.split('-').map(toInt);
        const range = {start: mod(start), end: mod(end)};
        if(range.start > range.end) {
            return [{start: min, end: range.end}, {start: range.start, end: max}];
        }
        return [range];
    }
    const steps = input.match(/^\*\/(\d+)$/);
    if(steps) {
        const step = toInt(steps[1]);
        const result = [];
        for(let i = min; i < max; i += step) {
            result.push({start: mod(i), end: mod(i)});
        }
        return result;
    }
    const offsetSteps = input.match(/^(\d+)\/(\d+)$/);
    if(offsetSteps) {
        const offset = toInt(offsetSteps[1]);
        const step = toInt(offsetSteps[2]);
        const result = [];
        for(let i = offset; i < max; i += step) {
            result.push({start: mod(i), end: mod(i)});
        }
        return result;
    }
    throw Error(`Invalid expression: ${input}`);
    function mod(n: number): number {
        n = n - min;
        if(n < 0) {
            const multiplicator = (max + 1) - min;
            n = n + Math.ceil(Math.abs(n / multiplicator)) * multiplicator;
        }
        return n % ((max + 1) - min) + min;
    }
}

export function getDaysInMonth(d: Date): number {
    return (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getDate();
}
