import AvailableStock from './AvailableStock';
import { dao } from '../../inject';
import { makeAutoObservable, runInAction } from 'mobx';
import { print } from '../utils/utils';

class AvailableStocks {
  list: AvailableStock[];

  constructor(list: AvailableStock[]) {
    this.list = list;
    makeAutoObservable(this);
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
  async loadAvailableStocks(): Promise<void> {
    const newStocks = await dao.readAvailableStocks();

    // Note: runInAction is needed here in strict-mode. When we have an asynchronous method,
    // the action only applies to the synchronous part of that method. In other words, the
    // action decorator wraps the entire method, but it doesn't automatically apply to any
    // async operations that happen within it, such as promises or setTimeouts.
    runInAction(() => {
      // Alternatively could do: this.list.splice(0, this.list.length, ...newStocks);
      this.list = newStocks;
    });
  }

  /** Continuously get stock price updates from the backend. */
  startListeningToStockPriceUpdates() {
    print('Listening to stock price updates...');

    dao.listenToStockPriceUpdates(
      (ticker: string, price: number) => {
        let availableStock = this.findBySymbolOrNull(ticker);
        if (availableStock) {
          availableStock.setCurrentPrice(price);
          print('Updated ' + ticker + ' price to ' + price + '.');
        }
      },
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

export default AvailableStocks;
