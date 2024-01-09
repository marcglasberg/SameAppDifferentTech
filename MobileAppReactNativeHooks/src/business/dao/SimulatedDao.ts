import { Dao } from './Dao';
import { AvailableStock } from '../state/AvailableStock';
import { print, round } from '../utils/utils';

type _Stock = {
  readonly ticker: string;
  readonly name: string;
  price: number;
};

export class SimulatedDao extends Dao {

  // We simulate that the backend has this list of available stocks.
  private stocks: _Stock[] = [
    { ticker: 'IBM', name: 'International Business Machines', price: 132.64 },
    { ticker: 'AAPL', name: 'Apple', price: 183.58 },
    { ticker: 'GOOG', name: 'Alphabet', price: 126.63 },
    { ticker: 'AMZN', name: 'Amazon', price: 125.30 },
    { ticker: 'META', name: 'Meta Platforms', price: 271.39 },
    { ticker: 'INTC', name: 'Intel', price: 29.86 }
  ];

  /**
   * Read the current list of available stocks from the backend.
   * Note: this demonstrates how to get one-off information from the backend.
   */
  async readAvailableStocks(): Promise<AvailableStock[]> {

    // TODO:
    // // Wait for 0.5 second to simulate a slow network.
    // await new Promise(resolve => setTimeout(resolve, 500));

    print(`Just read ${this.stocks.length} stocks.`);

    return this.stocks.map(stock =>
      new AvailableStock(stock.ticker, stock.name, stock.price)
    );
  }

  private static _onUpdate: ((ticker: string, price: number) => void) | null = null;
  private static _priceUpdateInterval: NodeJS.Timeout | null = null;

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

    // Simulates stock price updates, invoking the provided callback function
    // with the updated price at a regular interval. The stock price fluctuates
    // randomly within a defined range, every 250 milliseconds, selects a random
    // stock from the available stock list, simulates a price fluctuation within
    // the range of US$ 1 to US$ 1000, and invokes the onUpdate callback.

    SimulatedDao._onUpdate = onUpdate;

    // Clear previous interval.
    if (SimulatedDao._priceUpdateInterval) {
      clearInterval(SimulatedDao._priceUpdateInterval);
    }

    SimulatedDao._priceUpdateInterval = setInterval(() => {

      if (SimulatedDao._onUpdate) {
        if (this.stocks.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.stocks.length);
        const randomStock = this.stocks[randomIndex];

        // Simulates a price fluctuation.
        let newPrice = round(randomStock.price + (Math.random() * 2 - 1) / 4); // Random fluctuation

        // Limit stock price to between US$ 1 and US$ 1000.
        newPrice = Math.max(1, Math.min(newPrice, 1000));

        // Update the price in the simulated backend.
        this.stocks[randomIndex].price = newPrice;

        // Call the onUpdate callback with the new price.
        SimulatedDao._onUpdate(randomStock.ticker, newPrice);
      }
    }, 250); // Update every 250 milliseconds.
  }

  /**
   * Stop getting stock price updates.
   * Note: this demonstrates how to close websockets.
   */
  stopStockPriceUpdates(): void {

    if (SimulatedDao._priceUpdateInterval) {
      clearInterval(SimulatedDao._priceUpdateInterval);
      SimulatedDao._priceUpdateInterval = null;
    }

    SimulatedDao._onUpdate = null;
  }

  public toString(): string {
    return 'SimulatedDao';
  }
}
