import { makeAutoObservable } from 'mobx';

/** Stocks the user owns. */
class Stock {
  readonly ticker: string;
  howManyShares: number;
  averagePrice: number;

  constructor(ticker: string, howManyShares: number, averagePrice: number) {
    this.ticker = ticker;
    this.howManyShares = howManyShares;
    this.averagePrice = averagePrice;
    makeAutoObservable(this);
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

export default Stock;
