import { Model, model, prop } from 'mobx-keystone';

@model('BuyOrSell')
export class BuyOrSell extends Model({
  value: prop<boolean>()
}, {
  valueType: true
}) {
  static BUY: BuyOrSell;
  static SELL: BuyOrSell;

  get isBuy(): boolean {
    return this.value;
  }

  get isSell(): boolean {
    return !this.value;
  }

  toString(): string {
    return this.value ? 'BUY' : 'SELL';
  }
}

BuyOrSell.BUY = new BuyOrSell({ value: true });
BuyOrSell.SELL = new BuyOrSell({ value: false });
