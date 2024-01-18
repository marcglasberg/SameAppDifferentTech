import { print, round } from '../utils/utils';

class CashBalance {
  readonly amount: number;

  constructor(amount: number) {
    this.amount = isNaN(amount) ? 0 : round(amount);
  }

  public withAmount(amount: number): CashBalance {
    return new CashBalance(round(amount));
  }

  public add(howMuch: number): CashBalance {
    let newAmount = round(this.amount + howMuch);
    print(`Added ${howMuch}. Cash balance is now: ${newAmount}.`);
    return new CashBalance(newAmount);
  }

  public remove(howMuch: number): CashBalance {
    let newAmount = round(this.amount - howMuch);
    if (newAmount < 0) newAmount = 0;
    print(`Removed ${howMuch}. Cash balance is now: ${newAmount}.`);
    return new CashBalance(newAmount);
  }

  public toString(): string {
    return `US$ ${this.amount.toFixed(2)}`;
  }

  public equals(other: CashBalance): boolean {
    return (this === other) || (this.amount === other.amount);
  }
}

export default CashBalance;
