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

export type AsyncReducerResult<St> = ((state: St) => (St | null)) | null;

export abstract class ReduxAction<St> {

  /**
   * The `reduce()` method is the Reducer. It MUST be implemented by the action.
   *
   * A reducer can return:
   * - `null`: No state change
   * - `Promise<null>`: No state change
   * - `St`: A new state, changed synchronously.
   * - `Promise<(state: St) => St>`: A new state, changed asynchronously.
   */
  abstract reducer(): ReduxReducer<St>;

  /**
   * The `before()` method MAY be implemented by the action. If implemented, it runs before the
   * reducer. It may be sync or async. If it's async, the reducer will run after the before
   * resolves.
   *
   * This method is useful for actions that need to perform some checks before executing the
   * reducer. For example, if an action needs internet connection, it can check the presence of
   * the connection before executing the reducer. If the connection is not present, the before
   * method can throw a `UserException("Please, check your internet connection.");`. This will
   * prevent the reducer from running.
   *
   * Note the `after` method always runs, even if the before method throws an exception.
   */
  before(): void | Promise<void> {
  }

  /**
   * The `after()` method MAY be implemented by the action. If implemented, it runs after the
   * `before()`, after `reduce()`, and after `wrapError()`.
   *
   * The `after()` method is always synchronous, and it will always be called when the action is
   * dispatched, even if errors were thrown by `before` or `reduce`.
   */
  after(): void {
  }

  /**
   * If any error is thrown by `reduce` or `before`, you have the chance to further process it
   * by using `wrapError`. Usually this is used to wrap the error inside another that better
   * describes the failed action.
   *
   * For example, if some input validation inside your action throws a `ValidationError`,
   * then instead of throwing this error you could do:
   *
   * ```
   * wrapError(error) { return new UserException("Please enter a valid input.", {cause: error}) }
   * ```
   *
   * If you want to disable the error you can return `null`. For example, if you want
   * to disable all errors of type `MyException`:
   *
   * ```
   * wrapError(error) { return (error instanceof MyException) ? null : error }
   * ```
   *
   * IMPORTANT: If instead of RETURNING an error you throw an error inside the `wrapError` method,
   * AsyncRedux will catch this error and use it instead the original error. In other words,
   * returning an error or throwing an error works the same way. But it's recommended that you
   * return the error instead of throwing it anyway.
   *
   * IMPORTANT: Apart from defining `wrapError()` methods per action, you can also define a
   * global `wrapError` as a store parameter when you create the Store.
   */
  wrapError(error: any): any {
    return error;
  };

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

  /**
   * For AsyncRedux internal use only.
   */
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

