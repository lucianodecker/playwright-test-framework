export class PricingService {
    static parsePrice(raw: string): number {
        if (!raw) {
            throw new Error('Price value is empty');
        }

        const normalized = raw.replace('$', '').trim();
        const parsed = Number(normalized);

        if (isNaN(parsed)) {
            throw new Error(`Invalid price format: ${raw}`);
        }

        return parsed;
    }

    static parsePrices(rawPrices: string[]): number[] {
        return rawPrices.map(price => this.parsePrice(price));
    }

    static isSortedAscending(prices: number[]): boolean {
        return prices.every((value, index, array) =>
        index === 0 || array[index - 1] <= value
    );
    }
}