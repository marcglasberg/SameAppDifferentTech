import { Model, model, prop, modelAction } from 'mobx-keystone';
import { computed } from 'mobx';

@model('Stock')
export class Stock extends Model({
  ticker: prop<string>(),
  howManyShares: prop<number>(),
  averagePrice: prop<number>(),
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

// import { makeAutoObservable } from 'mobx';
//
// /** Stocks the user owns. */
// class Stock {
//   readonly ticker: string;
//   howManyShares: number;
//   averagePrice: number;
//
//   constructor(ticker: string, howManyShares: number, averagePrice: number) {
//     this.ticker = ticker;
//     this.howManyShares = howManyShares;
//     this.averagePrice = averagePrice;
//     makeAutoObservable(this);
//   }
//
//   get costBasis() {
//     return this.howManyShares * this.averagePrice;
//   }
//
//   get averagePriceStr() {
//     return `US$ ${this.averagePrice.toFixed(2)}`;
//   }
//
//   toString(): string {
//     return `${this.ticker}: ${this.howManyShares} shares`;
//   }
// }
//
// export default Stock;
