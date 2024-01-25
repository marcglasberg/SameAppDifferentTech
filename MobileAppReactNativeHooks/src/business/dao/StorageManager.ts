import { dao } from '../../inject';
import { print, printError } from '../utils/utils';
import React, { createContext, useContext } from 'react';
import { Portfolio } from '../state/Portfolio';
import { Persistor } from './Persistor';
import { UseSet } from '../state/Hooks';

/**
 * The StorageManager is the high-level code that actually loads the state when the app opens,
 * and then continuously keeps track and saves the ongoing state changes.
 *
 * It uses the {@link storage} object to actually perform the load/save/delete operations,
 * which may have been set up in {@link inject} to save to disk or to memory.
 */
export class StorageManager {

  /** Null when no interval is set. */
  private intervalId: NodeJS.Timeout | null;

  readonly portfolioPersistor: Persistor<Portfolio>;

  constructor() {
    this.intervalId = null;
    this.portfolioPersistor = new Persistor<Portfolio>();
  }

  intervalIsOn(): boolean {
    return this.intervalId !== null;
  }

  /**
   * Processes the storage management of the Portfolio:
   *
   * 1. On its first invocation, loads the Portfolio from the local disk of the device.
   *
   * 2. Sets up a 2-second interval to periodically save the Portfolio, if it changed.
   *
   * 3. Concurrency Control: Uses the isBusy flag to avoid concurrent load and save
   * operations and to prevent overlapping save operations during subsequent interval triggers.
   *
   * Note: We want to avoid too many saves, which can make the app slow. So instead of saving
   * information as soon as it changes, we save periodically, every 2 seconds, and only if
   * something actually changed. This is a good compromise between saving too often and saving
   * too little. But you can change the 2 sec interval, depending on the requirements of your app.
   */
  async processPortfolio(portfolio: Portfolio,
                         setPortfolio: UseSet<Portfolio>
  ) {

    this.portfolioPersistor.current = portfolio;

    async function loadPortfolio() {
      const loaded = await dao.loadPortfolio();
      setPortfolio(loaded);
      return loaded;
    }

    // 1. On its first invocation, loads the Portfolio from the local disk of the device.
    if (this.portfolioPersistor.isFirstInvocation()) {
      await this.portfolioPersistor.loadIt(loadPortfolio, 'Portfolio');
    }

    // Note: We could have more LOAD processes here. For example:
    // if (this.otherManager.isFirstInvocation()) { this.otherManager.loadIt(loadOther, 'Other'); }

    // 2. Sets up a 2-second interval to periodically save the Portfolio, if it changed.
    if (this.intervalId == null) {

      this.intervalId = setInterval(async () => {

        this.portfolioPersistor.processSave(this.localSavePortfolio);

        // Note: We could have more SAVE processes here. For example:
        // this.otherManager.processSave(this.saveOther);

      }, 2000);
    }
  }

  private async localSavePortfolio(current: Portfolio, lastSaved: Portfolio | null) {

    // Note: Here I'm saving the entire portfolio, but in a more complex scenario I could
    // save only the diff, by comparing current to lastSaved.

    if (current !== lastSaved)
      try {
        print('Saving Portfolio...');
        await dao.savePortfolio(current);
      } catch (error) {
        // Should instead handle the error appropriately.
        printError('Failed to save portfolio', error);
      }
  }

  /**
   * Stops the periodic save interval (and saves one more time, immediately).
   *
   * It's important to call this method before shutting down the application to
   * ensure that no pending changes are left unsaved.
   */
  async stopTimerAndSave() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      print('Save interval cancelled.');
      this.intervalId = null;

      this.portfolioPersistor.processSave(this.localSavePortfolio);

      // Note: We could have more SAVE processes here. For example:
      // this.otherManager.processSave(this.saveOther);
    }
  }

  static readonly Context = createContext<{
    storageManager: StorageManager;
    setStorageManager: React.Dispatch<React.SetStateAction<StorageManager>>
  }>({
    storageManager: new StorageManager(), setStorageManager: () => {
    }
  });

  static use(): StorageManager {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { storageManager } = useContext(StorageManager.Context);
    return storageManager;
  }
}
