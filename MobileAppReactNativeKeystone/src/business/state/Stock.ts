import { Model, model, modelAction, prop } from 'mobx-keystone';
import { computed } from 'mobx';

@model('Stock')
export class Stock extends Model({
  ticker: prop<string>(() => ''),
  howManyShares: prop<number>(() => 0),
  averagePrice: prop<number>(() => 0)
}) {

  @modelAction
  setHowManyShares(howManyShares: number): void {
    this.howManyShares = howManyShares;
  }

  @modelAction
  setAveragePrice(averagePrice: number): void {
    this.averagePrice = averagePrice;
  }

  @computed
  get costBasis(): number {
    return this.howManyShares * this.averagePrice;
  }

  @computed
  get averagePriceStr(): string {
    return `US$ ${this.averagePrice.toFixed(2)}`;
  }

  toString(): string {
    return `${this.ticker}: ${this.howManyShares} shares`;
  }
}

