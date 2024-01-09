import { dao } from '../../inject';
import { print, printError } from '../utils/utils';

/**
 * The StorageManager is the high-level code that actually loads the state when the app opens,
 * and then continuously keeps track and saves the ongoing state changes.
 *
 * It uses the {@link storage} object to actually perform the load/save/delete operations,
 * which may have been set up in {@link inject} to save to disk or to memory.
 */
export class StorageManager {

  /** True when the storage manager is busy saving or loading information. */
  private static isBusy: boolean = false;

  /** True means the Portfolio changed, and must be saved. */
  static ifPortfolioChanged: boolean = false;

  /** Null when no interval is set. */
  private static intervalId: NodeJS.Timeout | null = null;

  /**
   * Inits the storage management process. This method is idempotent, ensuring that
   * repeated calls do not lead to redundant operations.
   *
   * What it does:
   *
   * 1. Load information: On its first invocation, the method loads the portfolio data.
   *   In the future, when more information needs to be loaded, it can be added here.
   *
   * 2. Periodic check and save: Sets up a 2-second interval to periodically check if the
   *   portfolio has been modified. If a change is detected and the manager is not busy,
   *   it triggers a save operation. In the future, when more information needs to be saved,
   *   it can be added here.
   *
   * 3. Concurrency Control: Utilizes the isBusy flag to avoid concurrent load and save
   *   operations and to prevent overlapping save operations during subsequent interval
   *   triggers.
   *
   * Note it's safe to call init multiple times, as subsequent calls will be ignored if an
   * initialization process is already underway or completed. The method ensures that
   * only one instance of the interval for checking and saving portfolio data is active
   * at any time.
   *
   * Why don't we save changed information as soon as it changes? We want to avoid
   * too many saves, which can make the app slow. Instead, we save periodically, every 2
   * seconds, if something actually changed. This is a good compromise between saving
   * too often and saving too little. Of course, this depends on the requirements of
   * your app. Change, if necessary.
   */
  static async init() {
    print('Initializing the storage manager.');

    if ((StorageManager.intervalId !== null) || (StorageManager.isBusy)) {
      print('Was already initialized.');
      return;
    }

    StorageManager.isBusy = true;

    try {
      await StorageManager.loadPortfolio();
      StorageManager.ifPortfolioChanged = false;
    } catch (error) {
      // Should instead handle the error appropriately. Is the local information
      // corrupted? We should probably delete the local information and recreate
      // it. If the saved info is versioned, and the version is old, this is the
      // moment to upgrade it.
      print('Failed to load initial information.');
    } finally {
      StorageManager.isBusy = false;
    }

    // Set up the saving interval.
    StorageManager.intervalId = setInterval(async () => {
      await StorageManager.checkAndSavePortfolio();
    }, 2000); // 2 seconds interval.
  }

  private static async checkAndSavePortfolio() {
    if (StorageManager.ifPortfolioChanged && !StorageManager.isBusy) {
      print('Saved changes to the local drive.');
      StorageManager.isBusy = true;
      try {
        await StorageManager.savePortfolio();
        StorageManager.ifPortfolioChanged = false;
      } finally {
        StorageManager.isBusy = false;
      }
    }
  }

  /**
   * Stops the periodic save interval (and saves one more time, immediately).
   *
   * It's important to call this method before shutting down the application to
   * ensure that no pending operations are left uncompleted.
   *
   * This method is idempotent, ensuring that repeated calls do not lead to
   * redundant operations.
   */
  static async stopTimerAndSaves() {
    if (StorageManager.intervalId !== null) {
      clearInterval(StorageManager.intervalId);
      StorageManager.intervalId = null;
      await StorageManager.checkAndSavePortfolio();
      print('Save interval cancelled.');

      StorageManager.ifPortfolioChanged = false;
    }
  }

  static async savePortfolio(): Promise<void> {
    try {
      print('Saving Portfolio...');
      // TODO: MARCELO Uncomment and implement.
      // await dao.savePortfolio(store.portfolio);
    } catch (error) {
      // Should instead handle the error appropriately.
      printError('Failed to save portfolio', error);
    }
  }

  static async loadPortfolio(): Promise<void> {

    try {
      print('Loading Portfolio...');
      let loadedPortfolio = await dao.loadPortfolio();
      // TODO: MARCELO Uncomment and implement.
      // store.portfolio.copyFrom(loadedPortfolio);
    } catch (error) {
      // Should instead handle the error appropriately.
      printError('Failed to load portfolio', error);
    }
  }

  static markPortfolioChanged() {
    StorageManager.ifPortfolioChanged = true;
  }
}
