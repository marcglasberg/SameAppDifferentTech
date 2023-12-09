export class BuyOrSell {
  private readonly value: boolean;

  private constructor(value: boolean) {
    this.value = value;
  }

  static BUY = new BuyOrSell(true);
  static SELL = new BuyOrSell(false);

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

