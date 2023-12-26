import { Model, model, modelAction, prop } from 'mobx-keystone';
import { round } from '../utils/utils';

@model('CashBalance')
export class CashBalance extends Model({
  amount: prop<number>(),
}) {

  constructor(amount: number) {
    super({ amount: isNaN(amount) ? 0 : round(amount) });
  }

  @modelAction
  setAmount(amount: number): void {
    this.amount = round(amount);
  }

  @modelAction
  add(howMuch: number): void {
    this.amount = round(this.amount + howMuch);
  }

  @modelAction
  remove(howMuch: number): void {
    this.amount = round(this.amount - howMuch);
    if (this.amount < 0) this.amount = 0;
  }

  toString(): string {
    return `US$ ${this.amount.toFixed(2)}`;
  }

  equals(other: CashBalance): boolean {
    return (this === other) || (this.amount === other.amount);
  }
}

// import { makeAutoObservable } from 'mobx';
// import { print, round } from '../utils/utils';
//
// class CashBalance {
//   public amount: number;
//
//   constructor(amount: number) {
//     if (isNaN(amount)) this.amount = 0;
//     else this.amount = round(amount);
//
//     makeAutoObservable(this);
//   }
//
//   public setAmount(amount: number): void {
//     this.amount = round(amount);
//   }
//
//   public add(howMuch: number): void {
//     this.amount = round(this.amount + howMuch);
//     print('Cash balance is now: ' + this.amount);
//   }
//
//   public remove(howMuch: number): void {
//     this.amount = round(this.amount - howMuch);
//     if (this.amount < 0) this.amount = 0;
//     print('Cash balance is now: ' + this.amount);
//   }
//
//   public toString(): string {
//     return `US$ ${this.amount.toFixed(2)}`;
//   }
//
//   public equals(other: CashBalance): boolean {
//     return (this === other) || (this.amount === other.amount);
//   }
// }
//
// export default CashBalance;
