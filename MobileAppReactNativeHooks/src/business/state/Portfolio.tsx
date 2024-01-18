import React, { createContext, useContext } from 'react';
import { AvailableStock } from './AvailableStock';
import CashBalance from './CashBalance';
import Stock from './Stock';
import { print, round } from '../utils/utils';
import { BuyOrSell } from './BuyOrSell';

class Portfolio {
  readonly stocks: Stock[];
  readonly cashBalance: CashBalance;

  constructor({
                stocks = [],
                cashBalance = new CashBalance(0)
              }: {
    stocks?: Stock[],
    cashBalance?: CashBalance
  } = {}) {
    this.stocks = stocks;
    this.cashBalance = cashBalance;

    // TODO: MARCELO
    // // When the Portfolio changes, mark it for later saving to the local disk.
    // reaction(
    //   () => [
    //     this.stocks.map(stock => stock),
    //     this.cashBalance,
    //     this.cashBalance.amount],
    //   () => StorageManager.markPortfolioChanged(),
    //   {
    //     // Prevents the reaction from running immediately.
    //     fireImmediately: false,
    //   },
    // );
  }

  copyWith({
             stocks = this.stocks,
             cashBalance = this.cashBalance
           }: {
    stocks?: Stock[],
    cashBalance?: CashBalance
  } = {}): Portfolio {
    return new Portfolio({
      stocks,
      cashBalance
    });
  }

  get isEmpty(): boolean {
    return this.stocks.length === 0;
  }

  public addCashBalance(howMuch: number): Portfolio {
    const newCashBalance = this.cashBalance.add(howMuch);
    return this.withCashBalance(newCashBalance);
  }

  public removeCashBalance(howMuch: number): Portfolio {
    const newCashBalance = this.cashBalance.remove(howMuch);
    return this.withCashBalance(newCashBalance);
  }

  withCashBalance(newCashBalance: CashBalance): Portfolio {
    return this.copyWith({ cashBalance: newCashBalance });
  }

  withoutStock(ticker: string): Portfolio {
    return this.withStock(ticker, 0, 0);
  }

  /**
   * Adds {@link howMany} shares of the given {@link availableStock}.
   * Will not chance the cash balance.
   */
  withAddedStock(availableStock: AvailableStock, howMany: number): Portfolio {
    const pos = this.getStockPositionInList(availableStock);
    let newStocks: Stock[];

    if (pos === -1) {
      newStocks = [...this.stocks, availableStock.toStock(howMany)];
    } else {
      let stock = this.stocks[pos];
      const newShares = stock.howManyShares + howMany;
      const newAveragePrice = round(
        ((stock.howManyShares * stock.averagePrice) +
          (howMany * availableStock.currentPrice)) /
        newShares);

      newStocks = [...this.stocks];
      newStocks[pos] = new Stock(stock.ticker, newShares, newAveragePrice);
    }

    return this.copyWith({ stocks: newStocks });
  }

  withoutStocks(): Portfolio {
    return this.copyWith({ stocks: [] });
  }

  withStock(ticker: string,
            quantity: number,
            averagePrice: number): Portfolio {

    const newStocks = this.stocks.filter(stock => stock.ticker !== ticker);

    if (quantity > 0) {
      const newStock = new Stock(ticker, quantity, averagePrice);
      newStocks.push(newStock);
    }

    return this.copyWith({ stocks: newStocks });
  }

  howManyStocks(ticker: string): number {
    const stock = this.getStockOrNull(ticker);
    return stock ? stock.howManyShares : 0;
  }

  getStock(ticker: string): Stock {
    let stock = this.getStockOrNull(ticker);
    if (!stock) throw new Error(`Stock '${ticker}' not found.`);
    return stock;
  }

  getStockOrNull(ticker: string): Stock | null {
    return this.stocks.find(stock => stock.ticker === ticker) ?? null;
  }

  hasStock(availableStock: AvailableStock): boolean {
    return this.getStockPositionInList(availableStock) !== -1;
  }

  /** Returns true if the portfolio contains the given stock. */
  hasMoneyToBuyStock(availableStock: AvailableStock): boolean {
    return this.cashBalance.amount >= availableStock.currentPrice;
  }

  /** Will {@link buyOrSell} the amount of {@link howMany} shares of the given {@link availableStock}. */
  buyOrSell(buyOrSell: BuyOrSell,
            availableStock: AvailableStock,
            howMany: number
  ) {
    if (buyOrSell === BuyOrSell.BUY) {
      return this.buy(availableStock, howMany);
    } else {
      return this.sell(availableStock, howMany);
    }
  }

  /**
   * Buy {@link howMany} shares of the given {@link availableStock}].
   * Will reduce the cash balance accordingly.
   * Throws an exception if there is not enough money.
   */
  buy(availableStock: AvailableStock, howMany: number): Portfolio {
    if (this.cashBalance.amount < availableStock.currentPrice * howMany) {
      throw new Error('Not enough money to buy stock');
    } else {
      const newCashBalance = new CashBalance(this.cashBalance.amount - availableStock.currentPrice * howMany);
      const newPortfolio = this.withAddedStock(availableStock, howMany);
      return newPortfolio.copyWith({ cashBalance: newCashBalance });
    }
  }

  /**
   * Sell {@link howMany} shares of the given {@link availableStock}.
   * Will increase the cash balance accordingly.
   * Throws an exception if you do not own the stock.
   */
  sell(availableStock: AvailableStock, howMany: number): Portfolio {
    const pos = this.getStockPositionInList(availableStock);

    if (pos === -1) {
      throw new Error('Cannot sell stock you do not own');
    } else {
      let stock = this.stocks[pos];

      if (stock.howManyShares < howMany) {
        throw new Error(`Cannot sell ${howMany} shares of stock you do not own`);
      } else {
        const newShares = stock.howManyShares - howMany;
        const newAveragePrice = round(
          ((stock.howManyShares * stock.averagePrice) -
            (howMany * availableStock.currentPrice)) /
          newShares);

        let newStocks = [...this.stocks];
        newStocks[pos] = new Stock(stock.ticker, newShares, newAveragePrice);

        if (newShares === 0) {
          newStocks = newStocks.filter(_stock => _stock.ticker !== availableStock.ticker);
        }

        const newCashBalance = new CashBalance(this.cashBalance.amount + availableStock.currentPrice * howMany);
        return this.copyWith({ stocks: newStocks, cashBalance: newCashBalance });
      }
    }
  }

  private getStockPositionInList(availableStock: AvailableStock): number {
    return this.stocks.findIndex(stock => stock.ticker === availableStock.ticker);
  }

  get totalCostBasis(): number {
    return this.stocks.reduce((sum, stock) => sum + stock.costBasis, 0)
      + this.cashBalance.amount;
  }

  toString(): string {
    return `                   
        stocks: ${this.stocks}    
        cashBalance: ${this.cashBalance}    
        `;
  }

  static readonly Context = createContext<{
    portfolio: Portfolio;
    setPortfolio: React.Dispatch<React.SetStateAction<Portfolio>>
  }>({
    portfolio: new Portfolio(), setPortfolio: () => {
    }
  });

  static use(): [Portfolio, React.Dispatch<React.SetStateAction<Portfolio>>] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { portfolio, setPortfolio } = useContext(Portfolio.Context);
    return [portfolio, setPortfolio];
  }

}

export default Portfolio;
