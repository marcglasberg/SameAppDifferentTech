import Stock from './Stock';

import { round } from '../utils/utils';

/**
 * Stocks that are available to buy/sell.
 * This is read from the backend.
 */
export class AvailableStock {
  readonly ticker: string;
  readonly name: string;
  readonly currentPrice: number;

  constructor(ticker: string, name: string, currentPrice: number) {
    this.name = name;
    this.ticker = ticker;
    this.currentPrice = round(currentPrice);
  }

  get currentPriceStr(): string {
    return `US$ ${this.currentPrice.toFixed(2)}`;
  }

  withCurrentPrice(price: number): AvailableStock {
    return new AvailableStock(this.ticker, this.name, round(price));
  }

  toStock(shares: number = 1): Stock {
    return new Stock(this.ticker, shares, this.currentPrice);
  }

  toString(): string {
    return `${this.ticker} (${this.name})`;
  }
}
