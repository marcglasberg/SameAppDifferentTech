import { print, printError } from '../utils/utils';

/**
 * This class is used to manage the state of some specific information being saved to the local device disk.
 * It keeps track of the last saved state, the current state, and whether a load or save operation is in progress.
 * It also provides methods to check if the state has changed, if it's the first invocation, and to process save and load operations.
 */
export class Persistor<T> {
  lastSaved: T | null = null;
  current: T | null = null;
  isBusy: boolean = false;

  /** Returns True if the state has changed, false otherwise. */
  hasChanged() {
    return this.lastSaved !== this.current;
  }

  /** Returns true if the state has changed and a load/save operation is not in progress. */
  hasChangedAndIsNotBusy() {
    return this.hasChanged() && !this.isBusy;
  }

  /** Returns true only the first time this method is called. */
  isFirstInvocation() {
    return (this.lastSaved == null) && !this.isBusy;
  }

  /**
   * Processes a save operation.
   * If the state has changed and a save operation is not in progress, it updates the last saved state to the
   * current state, sets the isBusy flag to true, and executes the save function.
   * @param {() => Promise<void>} saveFunction - The function that saves the state.
   */
  processSave(saveFunction: (current: T, lastSaved: T | null) => Promise<void>) {
    if (this.hasChangedAndIsNotBusy()) {
      this.lastSaved = this.current;
      this.isBusy = true;
      (async () => {
        try {
          if (this.current != null) {
            await saveFunction(this.current, this.lastSaved);
          }
        } finally {
          this.isBusy = false;
        }
      })();
    }
  }

  async loadIt(loadFunction: () => Promise<T>, name: String) {
    try {
      this.isBusy = true;
      print(`Loading ${name}...`);

      let loaded = await loadFunction();

      this.lastSaved = loaded;
      this.current = loaded;
      this.isBusy = false;

    } catch (error) {
      // Should instead handle the error appropriately. If the local information
      // is corrupted, delete the local information and recreate it. If the
      // saved info is versioned, and the version is old, upgrade it.
      printError(`Failed to load ${name}`, error);
    } finally {
      this.isBusy = false;
    }
  }
}

