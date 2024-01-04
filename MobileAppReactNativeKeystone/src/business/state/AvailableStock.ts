import { Stock } from './Stock';

import { model, Model, modelAction, prop } from 'mobx-keystone';
import { round } from '../utils/utils';
import { computed } from 'mobx';

@model('AvailableStock')
export class AvailableStock extends Model({
  ticker: prop<string>(() => ''),
  name: prop<string>(() => ''),
  currentPrice: prop<number>(() => 0)
}) {

  @modelAction
  setCurrentPrice(price: number): void {
    this.currentPrice = round(price);
  }

  @computed
  get currentPriceStr(): string {
    return `US$ ${this.currentPrice.toFixed(2)}`;
  }

  @modelAction
  toStock(shares: number = 1): Stock {
    return new Stock({
      ticker: this.ticker,
      howManyShares: shares,
      averagePrice: this.currentPrice
    });
  }

  toString(): string {
    return `${this.ticker} (${this.name})`;
  }
}
