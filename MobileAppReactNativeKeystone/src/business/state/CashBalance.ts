import { Model, model, modelAction, prop } from 'mobx-keystone';
import { round } from '../utils/utils';

@model('CashBalance')
export class CashBalance extends Model({
  amount: prop<number>(() => 0)
}) {

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

