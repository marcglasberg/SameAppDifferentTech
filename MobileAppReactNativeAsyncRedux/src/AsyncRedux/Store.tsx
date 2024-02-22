import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { ReduxAction } from './ReduxAction.ts';
import { UserException } from './UserException.ts';
import { StoreException } from './StoreException.ts';
import { Persistor } from './Persistor.tsx';
import { ProcessPersistence } from './ProcessPersistence.ts';

export type UserExceptionDialog = (exception: UserException, next: () => void) => void;

export function print(obj: any): void {
  _print(obj);
}

let _print = (obj: any) => {
  console.log(obj);
};

/**
 * The store holds the state of the application and allows the state to be updated
 * by dispatching actions. The store is also responsible for showing user exceptions
 * to the user, persisting the state to the local device disk, processing wait states
 * to show spinners while async operations are in progress, and more.
 */
export class Store<St> {

  private _state: St;

  // A function that shows UserExceptions to the user, using some UI like a dialog or a toast.
  // This function is passed to the constructor. If not passed, the UserException is ignored.
  private readonly _userExceptionDialog: UserExceptionDialog;

  // A queue of errors of type UserException, thrown by actions.
  // They are shown to the user using the function `userExceptionDialog`.
  private readonly _userExceptionsQueue: UserException[];

  // Hold the wait states of async operations in progress.
  private readonly _actionsInProgress: Set<ReduxAction<St>>;

  private _forceUpdate: Dispatch<SetStateAction<number>> | null;
  private readonly _autoRegisterWaitStates: boolean;
  private readonly _processPersistence: ProcessPersistence<St> | null;

  private _dispatchCounter = 0;

  constructor({
                       initialState,
                       userExceptionDialog,
                       persistor,
                       print
                     }: {
    initialState: St,
    userExceptionDialog?: (exception: UserException, next: () => void) => void,
    persistor?: Persistor<St>,
    print?: (obj: any) => void | undefined,
  }) {
    this._state = initialState;
    this._userExceptionsQueue = [];
    this._userExceptionDialog = userExceptionDialog || this._noopExceptionDialog;
    this._actionsInProgress = new Set();
    this._forceUpdate = null;
    this._autoRegisterWaitStates = true;
    this._processPersistence = (persistor === undefined) ? null : new ProcessPersistence(persistor, initialState);

    if (print) _print = print;

    if (this._processPersistence != null) {
      this._processPersistence.readInitialState(this, initialState).then();
    }
  }

  get state(): St {
    return this._state;
  }

  get dispatchCounter() {
    return this._dispatchCounter;
  }

  // Removes all user-exceptions from the queue.
  private _noopExceptionDialog: UserExceptionDialog = (error, next) => next;


  dispatch(action: ReduxAction<St>) {

    if (this._forceUpdate === null) throw new StoreException('Store not set in dispatch');

    action._injectStore(this);
    print('Dispatched: ' + action);

    let reducerResult: St | Promise<St | null> | null = null;

    try {
      // - Runs the sync reducer; OR
      // - Runs the initial sync part of the async reducer
      reducerResult = action.reducer();
    }
      //
    catch (error) {

      // Errors of type UserException are added to the error queue, not thrown.
      if (error instanceof UserException) {
        this._addUserException(error);
        this._showUserExceptionDialog();
      }
      //
      else throw error;
    }

    // If the reducer returned null, or if it returned the unaltered state, we simply do nothing.
    if (reducerResult === null || reducerResult === this.state) {
      return;
    }
    // If the reducer is ASYNC, we still have to process the rest of the reducer to generate the new state.
    else if (reducerResult instanceof Promise<St>) {
      this._runRestOfTheAsyncReducerAndApplyResult(action, reducerResult).then();
    }
    // If the reducer is SYNC, we already have the new state, and we simply must apply it.
    else {
      this._applySyncReducerResult(action, reducerResult);
    }
  }

  private async _runRestOfTheAsyncReducerAndApplyResult(action: ReduxAction<St>, reducerResult: Promise<St | null>) {

    if (this._autoRegisterWaitStates) {
      this._actionsInProgress.add(action);
      this._forceUpdate?.(++this._dispatchCounter);
    }

    let asyncResult: St | null = null;

    try {
      asyncResult = await reducerResult;
    }
      //
    catch (error) {
      // Errors of type UserException are added to the error queue, not thrown.
      if (error instanceof UserException) {
        this._addUserException(error);
        this._showUserExceptionDialog();
      }
      //
      else throw error;
    }
      //
    finally {
      if (this._autoRegisterWaitStates) {
        this._actionsInProgress.delete(action);
        this._forceUpdate?.(++this._dispatchCounter);
      }
    }

    if (asyncResult !== null) {
      let stateChangeDescription = Store.describeStateChange(this.state, asyncResult);
      if (stateChangeDescription !== '') print(stateChangeDescription);
      this._registerState(action, asyncResult);
    }
  }

  private _applySyncReducerResult(action: ReduxAction<St>, reducerResult: St) {

    let stateChangeDescription = Store.describeStateChange(this.state, reducerResult);
    if (stateChangeDescription !== '') print(stateChangeDescription);
    this._registerState(action, reducerResult);
  }

  //
  private _registerState(action: ReduxAction<St>, stateEnd: St) {
    if (this._forceUpdate === null) throw new StoreException('Store not set');

    if (stateEnd !== null && stateEnd !== this._state) {
      this._state = stateEnd;
      this._forceUpdate(++this._dispatchCounter);
    }

    if (this._processPersistence != null)
      this._processPersistence.process(
        action,
        stateEnd
      );
  }

  /**
   * We check to see if any errors are in the queue and if so, we show the first one.
   * We then remove the first error from the queue and call this method again to show the next
   * error, if any. For this to work, we have to pass a function to the constructor of Store that
   * will show the error to the user. This function is called `userExceptionDialog`.
   *
   * An example using React Native:
   *
   * ```ts
   * const userExceptionDialog = (error: UserException, next: () => void) => {
   *     Alert.alert(
   *       error.title || error.message,
   *       error.title ? error.message : '',
   *       [{ text: 'OK', onPress: (value?: string) => { next(); }]
   *     );
   *   };
   * ```
   */
  private _showUserExceptionDialog() {
    let currentError = this.getNextUserExceptionInQueue();
    if (currentError !== undefined)
      this._userExceptionDialog?.(currentError, () => {
        this._showUserExceptionDialog();
      });
  };

  getNextUserExceptionInQueue(): UserException | undefined {
    return this._userExceptionsQueue.shift();
  }

  hasUserExceptionInQueue(): boolean {
    return this._userExceptionsQueue.length > 0;
  }

  private _addUserException(error: UserException) {
    this._userExceptionsQueue.push(error);
  }

  isInProgress<T extends ReduxAction<St>>(type: { new(...args: any[]): T }): boolean {

    // Returns true if an action of the given type is in progress.
    for (const action of this._actionsInProgress) {
      if (action instanceof type) {
        return true;
      }
    }
    return false;
  }

  // TODO: MARCELO Hide this internally.
  _inject(forceUpdate: Dispatch<SetStateAction<number>>) {
    this._forceUpdate = forceUpdate;
  }

  static describeStateChange(obj1: any, obj2: any, path: string = ''): String {
    // Ensure both parameters are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
      throw new StoreException(`Type mismatch or one of the objects is null at path: ${path}`);
    }

    let differences = '';
    // Combine keys from both objects
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of allKeys) {
      const val1 = obj1[key];
      const val2 = obj2[key];
      const newPath = path === '' ? key : `${path}.${key}`;

      // If both values are objects, recurse
      if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
        Store.describeStateChange(val1, val2, newPath);
      } else {
        // If values are different, log the difference
        if (val1 !== val2) {
          differences += `State ${newPath}: ${val1} → ${val2}`;
        }
      }
    }
    return differences;
  }

  /**
   * Pause the Persistor temporarily.
   *
   * When pausePersistor is called, the Persistor will not start a new persistence process, until method
   * resumePersistor is called. This will not affect the current persistence process, if one is currently
   * running.
   *
   * Note: A persistence process starts when the Persistor.persistDifference method is called,
   * and finishes when the future returned by that method completes.
   */
  pausePersistor(): void {
    this._processPersistence?.pause();
  }

  /**
   * Persists the current state (if it's not yet persisted), then pauses the Persistor temporarily.
   *
   * When persistAndPausePersistor is called, this will not affect the current persistence
   * process, if one is currently running. If no persistence process was running, it will
   * immediately start a new persistence process (ignoring Persistor.throttle).
   *
   * Then, the Persistor will not start another persistence process, until method
   * resumePersistor is called.
   *
   * Note: A persistence process starts when the Persistor.persistDifference method is called,
   * and finishes when the future returned by that method completes.
   */
  persistAndPausePersistor(): void {
    this._processPersistence?.persistAndPause();
  }

  /**
   * Resumes persistence by the Persistor,
   * after calling pausePersistor or persistAndPausePersistor.
   */
  resumePersistor(): void {
    this._processPersistence?.resume();
  }

  /**
   * Asks the Persistor to save the initialState in the local persistence.
   */
  async saveInitialStateInPersistence(initialState: St): Promise<void> {
    return this._processPersistence?.saveInitialState(initialState);
  }

  /**
   * Asks the Persistor to read the state from the local persistence.
   * Important: If you use this, you MUST put this state into the store.
   * The Persistor will assume that's the case, and will not work properly otherwise.
   */
  async readStateFromPersistence(): Promise<St | null> {
    return this._processPersistence?.readState() || null;
  }

  /**
   * Asks the Persistor to delete the saved state from the local persistence.
   */
  async deleteStateFromPersistence(): Promise<void> {
    return this._processPersistence?.deleteState();
  }

  /**
   * Gets, from the Persistor, the last state that was saved to the local persistence.
   */
  getLastPersistedStateFromPersistor(): St | null {
    return this._processPersistence?.lastPersistedState || null;
  }
}

interface StoreProviderProps<St> {
  store: Store<St>;
  children: React.ReactNode;
}

interface StoreContextType<St> {
  store: Store<St> | null;
}

const StoreContext = createContext<StoreContextType<any>>({
  store: null
});

export function useStore<St>(): Store<St> {
  const context = useContext<StoreContextType<St>>(StoreContext) as StoreContextType<St>;
  if (context === undefined) {
    throw new StoreException('useStore must be used within a StoreProvider');
  }
  return context.store as Store<St>;
}

export function StoreProvider<St>({ store, children }: StoreProviderProps<St>): JSX.Element {
  const [_store] = useState<Store<St>>(store);
  const [_, forceUpdate] = useState(store.dispatchCounter);

  _store?._inject(forceUpdate);

  return (
    <StoreContext.Provider value={{ store: _store }}>
      {children}
    </StoreContext.Provider>
  );
}

