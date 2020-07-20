export function replaceWeekDayNamesWithNumbers(input: string): string {
    return input.replaceAll(/\b([a-zA-Z]+)\b/g, (match) => `${getNumberForNamedWeekDay(match)}`);
}

export function getNumberForNamedWeekDay(name: string): number {
    switch(name.toUpperCase()) {
        case 'SUN': return 0;
        case 'MON': return 1;
        case 'TUE': return 2;
        case 'WED': return 3;
        case 'THU': return 4;
        case 'FRI': return 5;
        case 'SAT': return 6;
        default: throw new Error(`Invalid week day name: ${name}`);
    }
}