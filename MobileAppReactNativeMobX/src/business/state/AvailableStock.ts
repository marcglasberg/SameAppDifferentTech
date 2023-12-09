import Stock from './Stock';

import { makeAutoObservable } from 'mobx';
import { round } from '../utils/utils';

/**
 * Stocks that are available to buy/sell.
 * This is read from the backend.
 */
class AvailableStock {
  readonly ticker: string;
  readonly name: string;
  private _currentPrice: number;

  constructor(ticker: string, name: string, currentPrice: number) {
    this.name = name;
    this.ticker = ticker;
    this._currentPrice = round(currentPrice);
    makeAutoObservable(this);
  }

  get currentPriceStr(): string {
    return `US$ ${this._currentPrice.toFixed(2)}`;
  }

  toStock(shares: number = 1): Stock {
    return new Stock(this.ticker, shares, this._currentPrice);
  }

  get currentPrice(): number {
    return this._currentPrice;
  }

  setCurrentPrice(price: number): void {
    this._currentPrice = round(price);
  }

  toString(): string {
    return `${this.ticker} (${this.name})`;
  }
}

export default AvailableStock;
