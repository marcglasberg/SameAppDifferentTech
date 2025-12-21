import AvailableStock from '../state/AvailableStock';
import Portfolio from '../state/Portfolio';
import { storage } from '../../inject';
/**
 * The Data Access Object lets the app communicate with the backend.
 * You may access the Dao methods directly like so: `dao.readStocks();`
 * Typically the dao is {@link RealDao} or {@link SimulatedDao}.
 */
export abstract class Dao {

  /**
   * Read the current list of available stocks from the backend.
   * Note: this demonstrates how to get one-off information from the backend.
   */
  abstract readAvailableStocks(): Promise<AvailableStock[]>;

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
  abstract listenToStockPriceUpdates(onUpdate: (ticker: string, price: number) => void): void;

  /**
   * Stop getting stock price updates.
   * Note: this demonstrates how to close websockets.
   */
  abstract stopStockPriceUpdates(): void;

  /**
   * Save the user's portfolio to the local disk of the device.
   * Throws an exception if the portfolio cannot be saved.
   *
   * Note: this demonstrates how to save changing state to the local disk.
   */
  async savePortfolio(portfolio: Portfolio): Promise<void> {
    const serializedPortfolio = JSON.stringify(portfolio);
    await storage.setItem('portfolio', serializedPortfolio);
  }

  /**
   * Load the user's portfolio from the local disk of the device.
   * If there's no saved Portfolio, returns a new empty PortfolioDTO.
   * Throws an exception if the portfolio cannot be loaded.
   *
   * Note: this demonstrates how to load some local state from the device
   * when the app opens.
   */
  async loadPortfolio(): Promise<PortfolioDTO> {
    const serialized = await storage.getItem('portfolio');
    if (!serialized) {
      return { stocks: [], cashBalance: { amount: 0 } };
    }
    return JSON.parse(serialized) as PortfolioDTO;
  }
}

export type PortfolioDTO = {
  stocks: { ticker: string; howManyShares: number; averagePrice: number }[];
  cashBalance: { amount: number };
};


