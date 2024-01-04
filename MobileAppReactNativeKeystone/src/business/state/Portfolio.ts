import { Model, model, modelAction, prop } from 'mobx-keystone';
import { computed } from 'mobx';
import { AvailableStock } from './AvailableStock';
import { CashBalance } from './CashBalance';
import { Stock } from './Stock';
import { round } from '../utils/utils';
import { BuyOrSell } from './BuyOrSell';

@model('Portfolio')
export class Portfolio extends Model({
  stocks: prop<Stock[]>(() => []),
  cashBalance: prop<CashBalance>(() => new CashBalance({}))
}) {

  // constructor(stocks?: Stock[], cashBalance?: CashBalance) {
  //   super({ stocks: stocks ?? [], cashBalance: cashBalance ?? new CashBalance(0) });
  //
  //   // When the Portfolio changes, mark it for later saving to the local disk.
  //   reaction(
  //     () => [
  //       this.stocks.map(stock => stock),
  //       this.cashBalance,
  //       this.cashBalance.amount],
  //     () => StorageManager.markPortfolioChanged(),
  //     {
  //       // Prevents the reaction from running immediately.
  //       fireImmediately: false,
  //     },
  //   );
  // }

  @computed
  get isEmpty(): boolean {
    return this.stocks.length === 0;
  }

  @modelAction
  clearStock(ticker: string) {
    this.setStockInPortfolio(ticker, 0, 0);
  }

  /**
   * Adds {@link howMany} shares of the given {@link availableStock}.
   * Will not chance the cash balance.
   */
  @modelAction
  addStock(availableStock: AvailableStock, howMany: number) {

    let pos = this.getStockPositionInList(availableStock);

    if (pos === -1) {
      this.stocks.push(availableStock.toStock(howMany));
    } else {
      let stock = this.stocks[pos];

      const newShares = stock.howManyShares + howMany;

      stock.averagePrice = round(
        ((stock.howManyShares * stock.averagePrice) +
          (howMany * availableStock.currentPrice)) /
        newShares);

      stock.howManyShares = newShares;
    }
  }

  @modelAction
  clearAll() {
    this.stocks.length = 0;
  }

  @modelAction
  setStockInPortfolio(ticker: string,
                      quantity: number,
                      averagePrice: number) {

    this.stocks = this.stocks.filter(stock => stock.ticker !== ticker);

    if (quantity > 0) {
      const newStock = new Stock({ ticker, howManyShares: quantity, averagePrice });
      this.stocks.push(newStock);
    }
  }

  @modelAction
  howManyStocks(ticker: string): number {
    const stock = this.getStockOrNull(ticker);
    return stock ? stock.howManyShares : 0;
  }

  @modelAction
  getStock(ticker: string): Stock {
    let stock = this.getStockOrNull(ticker);
    if (!stock) throw new Error(`Stock '${ticker}' not found.`);
    return stock;
  }

  @modelAction
  getStockOrNull(ticker: string): Stock | null {
    return this.stocks.find(stock => stock.ticker === ticker) ?? null;
  }

  @modelAction
  hasStock(availableStock: AvailableStock): boolean {
    return this.getStockPositionInList(availableStock) !== -1;
  }

  /** Returns true if the portfolio contains the given stock. */
  @modelAction
  hasMoneyToBuyStock(availableStock: AvailableStock): boolean {
    return this.cashBalance.amount >= availableStock.currentPrice;
  }

  /** Will {@link buyOrSell} the amount of {@link howMany} shares of the given {@link availableStock}. */
  @modelAction
  buyOrSell(buyOrSell: BuyOrSell,
            availableStock: AvailableStock,
            howMany: number
  ) {
    if (buyOrSell === BuyOrSell.BUY) {
      this.buy(availableStock, howMany);
    } else {
      this.sell(availableStock, howMany);
    }
  }

  /**
   * Buy {@link howMany} shares of the given {@link availableStock}].
   * Will reduce the cash balance accordingly.
   * Throws an exception if there is not enough money.
   */
  @modelAction
  buy(availableStock: AvailableStock, howMany: number) {

    if (this.cashBalance.amount < availableStock.currentPrice * howMany) {
      throw new Error('Not enough money to buy stock');
    }
    //
    else {
      this.cashBalance.remove(availableStock.currentPrice * howMany);
      this.addStock(availableStock, howMany);
    }
  }

  /**
   * Sell {@link howMany} shares of the given {@link availableStock}.
   * Will increase the cash balance accordingly.
   * Throws an exception if you do not own the stock.
   */
  @modelAction
  sell(availableStock: AvailableStock, howMany: number) {
    const pos = this.getStockPositionInList(availableStock);

    if (pos === -1) {
      throw new Error('Cannot sell stock you do not own');
    }
    //
    else {
      let stock = this.stocks[pos];

      if (stock.howManyShares < howMany) {
        throw new Error(`Cannot sell ${howMany} shares of stock you do not own`);
      }
      // Remove the stock entirely if all shares are sold.
      else if (stock.howManyShares === howMany) {
        this.stocks.splice(pos, 1);
      }
      //
      else {
        const newShares = stock.howManyShares - howMany;

        // Recalculate the averagePrice. As mentioned, this would be unusual in a real-world scenario.
        stock.averagePrice = round(
          ((stock.howManyShares * stock.averagePrice) -
            (howMany * availableStock.currentPrice)) /
          newShares);

        stock.howManyShares = newShares;
      }

      // Increase the cash balance.
      this.cashBalance.add(availableStock.currentPrice * howMany);
    }
  }

  private getStockPositionInList(availableStock: AvailableStock): number {
    return this.stocks.findIndex(stock => stock.ticker === availableStock.ticker);
  }

  @computed
  get totalCostBasis(): number {
    return this.stocks.reduce((sum, stock) => sum + stock.costBasis, 0)
      + this.cashBalance.amount;
  }

  @modelAction
  copyFrom(other: Portfolio) {
    this.stocks = other.stocks.map(stock => stock);
    this.cashBalance = other.cashBalance;
  }

  toString(): string {
    return `
        stocks: ${this.stocks}
        cashBalance: ${this.cashBalance}
        `;
  }
}

