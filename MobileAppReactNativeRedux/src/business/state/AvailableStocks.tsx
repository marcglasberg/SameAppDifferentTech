import { AvailableStock } from './AvailableStock';
import { dao } from '../../inject';
import { print } from '../utils/utils';
import { Dispatch } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { updateAvailableStocks } from '../../avbStocksSlice.ts';

export class AvailableStocks {
  readonly list: AvailableStock[];

  constructor(list: AvailableStock[]) {
    this.list = list;
  }

  /** Loads the current list of available stocks from the backend. */
  static async loadAvailableStocks(): Promise<AvailableStocks> {
    const newStocks = await dao.readAvailableStocks();
    return new AvailableStocks(newStocks);
  }

  findBySymbolOrNull(ticker: string): AvailableStock | null {
    const stock = this.list.find(s => s.ticker === ticker);
    return !stock ? null : stock;
  }

  findBySymbol(ticker: string): AvailableStock {
    const stock = this.findBySymbolOrNull(ticker);
    if (!stock) throw new Error('Stock not found: ' + ticker);
    return stock;
  }

  /** Applies the given callback function to each element in the list. */
  forEach(callback: (availableStock: AvailableStock) => void): void {
    this.list.forEach(callback);
  }

  withAvailableStock(newAvailableStock: AvailableStock): AvailableStocks {
    let newList = this.list.map(s => s.ticker === newAvailableStock.ticker ? newAvailableStock : s);
    return new AvailableStocks(newList);
  }

  /** Continuously get stock price updates from the backend. */
  startListeningToStockPriceUpdates() {
    print('Listening to stock price updates...');

    dao.listenToStockPriceUpdates(
      (ticker: string, price: number) => {
        updateAvailableStocks({ ticker: ticker, price: price });
      }
    );
  }

  /** Stop getting stock price updates from the backend. */
  stopListeningToStockPriceUpdates() {
    print('Stopped listening to stock price updates.');

    dao.stopStockPriceUpdates();
  }

  toString(): string {
    return `AvailableStocks: ${this.list.length === 0 ? 'empty' : this.list}`;
  }
}
