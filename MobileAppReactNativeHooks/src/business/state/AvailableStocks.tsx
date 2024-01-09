import { AvailableStock } from './AvailableStock';
import { dao } from '../../inject';
import { print } from '../utils/utils';
import React, { createContext, useContext } from 'react';

class AvailableStocks {
  readonly list: AvailableStock[];

  constructor(list: AvailableStock[]) {
    this.list = list;
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

  /** Loads the current list of available stocks from the backend. */
  static async loadAvailableStocks(): Promise<AvailableStocks> {
    const newStocks = await dao.readAvailableStocks();
    return new AvailableStocks(newStocks);
  }

  /** Continuously get stock price updates from the backend. */
  startListeningToStockPriceUpdates() {
    print('Listening to stock price updates...');

    dao.listenToStockPriceUpdates(
      (ticker: string, price: number) => {
        let availableStock = this.findBySymbolOrNull(ticker);
        if (availableStock) {

          // TODO: MARCELO use newAvailableStock here.
          let newAvailableStock = availableStock.withCurrentPrice(price);

          print('Updated ' + ticker + ' price to ' + price + '.');
        }
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

  static readonly Context = createContext<{
    availableStocks: AvailableStocks;
    setAvailableStocks: React.Dispatch<React.SetStateAction<AvailableStocks>>
  }>({
    availableStocks: new AvailableStocks([]), setAvailableStocks: () => {
    }
  });

  static use(): [AvailableStocks, React.Dispatch<React.SetStateAction<AvailableStocks>>] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { availableStocks, setAvailableStocks } = useContext(AvailableStocks.Context);
    return [availableStocks, setAvailableStocks];
  }
}

export default AvailableStocks;
