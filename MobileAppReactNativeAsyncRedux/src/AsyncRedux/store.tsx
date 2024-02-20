import React, { createContext, useContext, useState } from 'react';
import { ReduxAction } from './reduxAction.ts';

export class Store<St> {
  // static instantiated: boolean = false;
  private _state: St;
  private _setState: ((state: St) => void) | null;

  public constructor({
                       initialState
                     }: {
    initialState: St,
  }) {
    this._state = initialState;
    this._setState = null;
  }

  public get state(): St {
    return this._state;
  }

  public dispatch(action: ReduxAction<St>) {  //
    if (this._setState === null) throw new Error('Store not set in dispatch');

    action._injectStore(this);
    console.log('Dispatched: ' + action);
    const reducerResult = action.reducer();

    if (reducerResult instanceof Promise) {
      reducerResult.then((asyncResult) => {
        if (asyncResult !== null) {
          if (this._setState === null) throw new Error('Store not set');
          let stateChangeDescription = Store.describeStateChange(this.state, asyncResult);
          if (stateChangeDescription !== '') console.log(stateChangeDescription);
          this._setState(asyncResult);
        }
      });
    } else if (reducerResult !== null) {
      let stateChangeDescription = Store.describeStateChange(this.state, reducerResult);
      if (stateChangeDescription !== '') console.log(stateChangeDescription);

      this._setState(reducerResult);
    }
  }

  // TODO: MARCELO Hide this internally.
  _mutateState(state: St) {
    this._state = state;
  }

  // TODO: MARCELO Hide this internally.
  _inject(setStore: (state: St) => void) {
    this._setState = setStore;
  }

  static describeStateChange(obj1: any, obj2: any, path: string = ''): String {
    // Ensure both parameters are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
      throw Error(`Type mismatch or one of the objects is null at path: ${path}`);
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
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context.store as Store<St>;
}

let dispatchCounter = 0;

export function StoreProvider<St>({ store, children }: StoreProviderProps<St>): JSX.Element {
  const [_store] = useState<Store<St>>(store);
  const [, forceUpdate] = useState(dispatchCounter);

  const setState = (state: St | null) => {
    if (state !== null && state !== store.state) {
      _store?._mutateState(state);
      forceUpdate(++dispatchCounter);
    }
  };

  _store?._inject(setState);

  return (
    <StoreContext.Provider value={{ store: _store, setState }}>
      {children}
    </StoreContext.Provider>
  );
}

