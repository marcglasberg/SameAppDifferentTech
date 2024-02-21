// Assuming the existence of a Redux-like store and state management system in your TypeScript project

import { ReduxAction } from './ReduxAction.ts';

/**
 * Use it like this:
 *
 * ```typescript
 * const persistor = new MyPersistor();
 *
 * let initialState = await persistor.readState();
 *
 * if (initialState === null) {
 *   initialState = AppState.initialState();
 *   await persistor.saveInitialState(initialState);
 * }
 *
 * const store = createStore<AppState>({
 *   initialState: initialState,
 *   persistor: persistor,
 * });
 * ```
 *
 * IMPORTANT: When the store is created with a Persistor, it assumes
 * the provided initial state was already persisted. Ensure this is the case.
 */
export abstract class Persistor<St> {

  /**
   * Read the saved state from the persistence. Should return null if the state is not yet
   * persisted. This method should be called only once, when the app starts, before the store
   * is created. The state it returns may become the store's initial-state. If some error
   * occurs while loading the info, we have to deal with it by fixing the problem. In the worse
   * case, if we think the state is corrupted and cannot be fixed, one alternative is deleting
   * all persisted files and returning null.
   */
  abstract readState: () => Promise<St | null>;

  /**
   * Delete the saved state from the persistence.
   */
  abstract deleteState: () => Promise<void>;

  /**
   * Save the new state to the persistence.
   */
  abstract persistDifference: (params: {
    lastPersistedState: St | null;
    newState: St
  }) => Promise<void>;

  /**
   * Save an initial-state to the persistence.
   */
  abstract saveInitialState: (state: St) => Promise<void>;

  /**
   * The default throttle is 2 seconds. Pass null to turn off throttle.
   */
  get throttle(): number | null {
    return 2000; // Default throttle is 2 seconds
  }
}

/**
 * A decorator to print persistor information to the console.
 * Use it like this:
 *
 * ```typescript
 * const store = createStore<AppState>({
 *   ...otherOptions,
 *   persistor: new PersistorPrinterDecorator<AppState>(persistor),
 * });
 * ```
 */
export class PersistorPrinterDecorator<St> implements Persistor<St> {
  private _persistor: Persistor<St>;

  constructor(persistor: Persistor<St>) {
    this._persistor = persistor;
  }

  async readState(): Promise<St | null> {
    console.log('Persistor: read state.');
    return this._persistor.readState();
  }

  async deleteState(): Promise<void> {
    console.log('Persistor: delete state.');
    return this._persistor.deleteState();
  }

  async persistDifference({ lastPersistedState, newState }: {
    lastPersistedState: St | null;
    newState: St
  }): Promise<void> {
    console.log(`Persistor: persist difference:
      lastPersistedState = ${lastPersistedState}
      newState = ${newState}`);
    return this._persistor.persistDifference({ lastPersistedState, newState });
  }

  async saveInitialState(state: St): Promise<void> {
    console.log('Persistor: save initial state.');
    return this._persistor.saveInitialState(state);
  }

  get throttle(): number | null {
    return this._persistor.throttle;
  }
}

/**
 * A dummy persistor.
 */
export class PersistorDummy<St> implements Persistor<St | null> {
  async readState(): Promise<St | null> {
    return null;
  }

  async deleteState(): Promise<void> {
    return;
  }

  async persistDifference({ lastPersistedState, newState }: {
    lastPersistedState: St | null;
    newState: St | null
  }): Promise<void> {
    return;
  }

  async saveInitialState(state: St | null): Promise<void> {
    return;
  }

  get throttle(): number | null {
    return null;
  }
}

export class PersistException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'PersistException';

    // Maintains proper stack trace for where our error was thrown (only available on V8).
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PersistException);
    }
  }
}

export class PersistAction<St> extends ReduxAction<St> {
  reducer(): null {
    return null;
  }
}
