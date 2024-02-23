import { Store } from './Store.tsx';
import { StoreException } from './StoreException.ts';

/**
 * A SYNC reducer can return:
 * - `St`: A new state, changed synchronously.
 * - `null`: No state change
 *
 * An ASYNC reducer can return:
 * - `Promise<(state: St) => St>`: A new state, changed asynchronously.
 * - `Promise<(state: St) => null>`: No state change
 * - `Promise<null>`: No state change
 */
export type ReduxReducer<St> = SyncReducer<St> | AsyncReducer<St>;

/**
 * A SYNC reducer can return:
 * - `St`: A new state, changed synchronously
 * - `null`: No state change
 */
export type SyncReducer<St> = St | null;

/**
 * An ASYNC reducer can return:
 * - `Promise<(state: St) => St>`: A new state, changed asynchronously
 * - `Promise<(state: St) => null>`: No state change
 * - `Promise<null>`: No state change
 */
export type AsyncReducer<St> = Promise<AsyncReducerResult<St>>;

export type AsyncReducerResult<St> = ((state: St) => St | null) | null;

export abstract class ReduxAction<St> {

  /**
   * Reducer function to be implemented by the action.
   *
   * A reducer can return:
   * - `null`: No state change
   * - `Promise<null>`: No state change
   * - `St`: A new state, changed synchronously.
   * - `Promise<(state: St) => St>`: A new state, changed asynchronously.
   */
  abstract reducer(): ReduxReducer<St>;

  private _store: Store<St> | null = null;

  /**
   * Returns the Redux store. Avoid using this method directly, use `state` and `dispatch` instead.
   */
  protected get store(): Store<St> {
    if (this._store === null) throw new StoreException('Store not set in action');
    return this._store;
  }

  /**
   * Returns the current state of the Redux store.
   */
  protected get state(): St {
    return this.store.state;
  }

  /**
   * Dispatches an action to the Redux store.
   */
  protected dispatch(action: ReduxAction<St>): void {
    return this.store.dispatch(action);
  }

  // For Async Redux internal use only.
  _injectStore(_store: Store<St>) {
    this._store = _store;
  }

  /**
   * Prints a readable description of the action, for debugging purposes.
   */
  toString(): string {
    // Initialize an array to hold key-value pairs as strings
    const keyValuePairs: string[] = [];
    for (const key of Object.keys(this)) {
      if (key !== '_store') { // Continue to exclude base class/internal fields
        // For each property, push "key:value" string to the array
        // Note: This simple line assumes that `value` can be meaningfully represented as a string.
        // You might need a more complex handling for objects, arrays, etc.
        const value = (this as any)[key];
        keyValuePairs.push(`${key}:${JSON.stringify(value)}`);
      }
    }
    // Join all key-value pairs with a comma and space, and format it according to your requirements
    return `${this.constructor.name}(${keyValuePairs.join(', ').replace(/\"/g, '')})`;
  }
}

