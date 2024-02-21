import React, { createContext, useContext, useState } from 'react';
import { ReduxAction } from './ReduxAction.ts';
import { UserException } from './UserException.ts';
import { StoreException } from './StoreException.ts';

export type UserExceptionDialog = (exception: UserException, next: () => void) => void;

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
  readonly _userExceptionDialog: UserExceptionDialog;

  // A queue of errors of type UserException, thrown by actions.
  // They are shown to the user using the function `userExceptionDialog`.
  readonly _userExceptionsQueue: UserException[];

  // Hold the wait states of async operations in progress.
  private readonly _actionsInProgress: Set<ReduxAction<St>>;

  private _setState: ((state: St) => void) | null;
  private _forceUpdate: (() => void) | null;
  readonly _autoRegisterWaitStates: boolean;

  public constructor({
                       initialState,
                       userExceptionDialog
                     }: {
    initialState: St,
    userExceptionDialog?: (exception: UserException, next: () => void) => void,
  }) {
    this._state = initialState;
    this._userExceptionsQueue = [];
    this._userExceptionDialog = userExceptionDialog || this._noopExceptionDialog;
    this._actionsInProgress = new Set();
    this._setState = null;
    this._forceUpdate = null;
    this._autoRegisterWaitStates = true;
  }

  // This just removes all exceptions from the queue.
  private _noopExceptionDialog: UserExceptionDialog = (error, next) => next;

  public get state(): St {
    return this._state;
  }

  public dispatch(action: ReduxAction<St>) {

    if (this._setState === null) throw new StoreException('Store not set in dispatch');

    action._injectStore(this);
    console.log('Dispatched: ' + action);

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
      this._applySyncReducerResult(reducerResult);
    }
  }

  private async _runRestOfTheAsyncReducerAndApplyResult(action: ReduxAction<St>, reducerResult: Promise<St | null>) {

    if (this._autoRegisterWaitStates) {
      this._actionsInProgress.add(action);
      this._forceUpdate?.();
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
        this._forceUpdate?.();
      }
    }

    if (asyncResult !== null) {
      let stateChangeDescription = Store.describeStateChange(this.state, asyncResult);
      if (stateChangeDescription !== '') console.log(stateChangeDescription);

      if (this._setState === null) throw new StoreException('Store not set');
      this._setState(asyncResult);
    }
  }

  private _applySyncReducerResult(reducerResult: St) {

    let stateChangeDescription = Store.describeStateChange(this.state, reducerResult);
    if (stateChangeDescription !== '') console.log(stateChangeDescription);

    this._setState?.(reducerResult);
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

  public getNextUserExceptionInQueue(): UserException | undefined {
    return this._userExceptionsQueue.shift();
  }

  public hasUserExceptionInQueue(): boolean {
    return this._userExceptionsQueue.length > 0;
  }

  private _addUserException(error: UserException) {
    this._userExceptionsQueue.push(error);
  }

  isInProgress<T extends ReduxAction<St>>(type: { new(...args: any[]): T }): boolean {

    console.log('1. ACTIONS (' + this._actionsInProgress.size + '): ' + Array.from(this._actionsInProgress).join(', '));

    // Returns true if an action of the given type is in progress.
    for (const action of this._actionsInProgress) {
      if (action instanceof type) {
        return true;
      }
    }
    return false;
  }

  // TODO: MARCELO Hide this internally.
  _mutateState(state: St) {
    this._state = state;
  }

  // TODO: MARCELO Hide this internally.
  _inject(setStore: (state: St) => void, forceUpdate: () => void) {
    this._setState = setStore;
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
}

interface StoreProviderProps<St> {
  store: Store<St>;
  children: React.ReactNode;
}

interface StoreContextType<St> {
  store: Store<St> | null;
  setState: (state: St | null) => void;
}

const StoreContext = createContext<StoreContextType<any>>({
  store: null,
  setState: () => {
  } // Dummy function
});

export function useStore<St>(): Store<St> {
  const context = useContext<StoreContextType<St>>(StoreContext) as StoreContextType<St>;
  if (context === undefined) {
    throw new StoreException('useStore must be used within a StoreProvider');
  }
  return context.store as Store<St>;
}

let dispatchCounter = 0;

export function StoreProvider<St>({ store, children }: StoreProviderProps<St>): JSX.Element {
  const [_store] = useState<Store<St>>(store);
  const [, _forceUpdate] = useState(dispatchCounter);

  const setState = (state: St | null) => {
    if (state !== null && state !== store.state) {
      _store?._mutateState(state);
      _forceUpdate(++dispatchCounter);
    }
  };

  const forceUpdate = () => {
    console.log('Force update ' + dispatchCounter);
    _forceUpdate(++dispatchCounter);
  };

  _store?._inject(setState, forceUpdate);

  return (
    <StoreContext.Provider value={{ store: _store, setState }}>
      {children}
    </StoreContext.Provider>
  );
}

