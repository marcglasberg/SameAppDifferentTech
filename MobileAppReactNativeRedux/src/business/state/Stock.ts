
/** Stocks the user owns. */
export class Stock {
  readonly ticker: string;
  readonly howManyShares: number;
  readonly averagePrice: number;

  constructor(ticker: string,
              howManyShares: number,
              averagePrice: number) {
    this.ticker = ticker;
    this.howManyShares = howManyShares;
    this.averagePrice = averagePrice;
  }

  copyWith({
             ticker = this.ticker,
             howManyShares = this.howManyShares,
             averagePrice = this.averagePrice
           }: {
    ticker?: string,
    howManyShares?: number,
    averagePrice?: number
  } = {}): Stock {
    return new Stock(ticker, howManyShares, averagePrice);
  }

  get costBasis() {
    return this.howManyShares * this.averagePrice;
  }

  get averagePriceStr() {
    return `US$ ${this.averagePrice.toFixed(2)}`;
  }

  toString(): string {
    return `${this.ticker}: ${this.howManyShares} shares`;
  }
}
