import { Dao } from './Dao';
import { AvailableStock } from '../state/AvailableStock';

export class RealDao extends Dao {

  /**
   * Read the current list of available stocks from the backend.
   * Note: this demonstrates how to get one-off information from the backend.
   */
  async readAvailableStocks(): Promise<AvailableStock[]> {
    // TODO: Implement this method to fetch from the real backend.
    throw new Error('Not yet implemented');

    // Should do something like this:
    // const stocks: Stock[] = await this.fetchStocks();
    // return stocks;
  }

  /**
   * Continuously get stock price updates.
   * Note: this demonstrates how to get information from websockets.
   *
   * @param onUpdate - A callback function that gets the ticker and the new
   * price of a stock.
   *
   * Example:
   * listenToStockPriceUpdates((ticker, price) => {
   *   console.log(`The new price of ${ticker} is $${price}`);
   * });
   */
  listenToStockPriceUpdates(onUpdate: (ticker: string, price: number) => void): void {
    // TODO: Implement this method to fetch from the real backend.
    throw new Error('Not yet implemented');
  }

  /**
   * Stop getting stock price updates.
   * Note: this demonstrates how to close websockets.
   */
  stopStockPriceUpdates(): void {
    // TODO: Implement this method to fetch from the real backend.
    throw new Error('Not yet implemented');
  }
}




