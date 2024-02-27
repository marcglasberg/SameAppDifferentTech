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
  abstract reduce(): ReduxReducer<St>;

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
  private _resolve: (() => void) | null = null;
  private _status = new ActionStatus();

  /**
   * Returns the Redux store. Avoid using this method directly, use `state` and `dispatch` instead.
   */
  protected get store(): Store<St> {
    if (this._store === null) throw new StoreException('Store not set in action');
    return this._store;
  }

  get status() {
    return this._status;
  }


  /**
   * Returns true if the action was already dispatched. An action cannot be dispatched
   * more than once, which means that you have to create a new action each time.
   *
   * Note this may be true even if the action has not yet FINISHED dispatching.
   * To check if it has finished, use `action.isFinished`.
   */
  get isDispatched(): boolean {
    return this._status.isDispatched;
  }

  /**
   * Returns true when the action has finished being dispatched.
   */
  get isFinished(): boolean {
    return this._status.hasFinishedMethodAfter;
  }

  /**
   * Returns true only if the action finished without errors.
   * In other words, if the methods before, reduce and after all finished executing
   * without throwing any errors.
   */
  get isFinishedWithoutErrors(): boolean {
    return this.isFinished && !this._status.hasError;
  }

  /**
   * Returns true only if the action finished with errors.
   * In other words, if one of the methods before or reduce threw an error.
   */
  get isFinishedWithErrors(): boolean {
    return this.isFinished && this._status.hasError;
  }

  /**
   * Returns the current state of the Redux store.
   */
  public get state(): St {
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
   * For AsyncRedux internal use only.
   */
  _changeStatus(params: {
    isDispatched?: boolean,
    hasFinishedMethodBefore?: boolean,
    hasFinishedMethodReduce?: boolean,
    hasFinishedMethodAfter?: boolean
    hasError?: boolean
  } = {}) {
    this._status = this._status.copy(params);
  }

  /**
   * For AsyncRedux internal use only.
   */
  _createPromise(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._resolve = resolve;
    });
  }

  _resolvePromise(): void {
    this._resolve?.();
  }

  /**
   * Prints a readable description of the action, for debugging purposes.
   */
  toString(): string {
    // Initialize an array to hold key-value pairs as strings
    const keyValuePairs: string[] = [];
    for (const key of Object.keys(this)) {
      if (!key.startsWith('_')) { // Continue to exclude base class/internal fields
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

/**
 * The `status` is a property of the action, used to keep track of the action's lifecycle.
 * If you have a reference to the action you can check its status at any time with `action.status`:
 *
 * ```ts
 * const action = new MyAction();
 *  await store.dispatchAndWait(new MyAction());
 * if (action.isFinishedWithNoErrors) { ... }
 * ```
 *
 * However, `dispatchAndWait` also returns the action status after it finishes:
 *
 * ```ts
 * const status = await store.dispatchAndWait(new MyAction());
 * if (status.isFinishedWithNoErrors) { ... }
 * ```
 */
export class ActionStatus {

  /**
   * Returns true if the action was already dispatched. An action cannot be dispatched
   * more than once, which means that you have to create a new action each time.
   *
   * Note this may be true even if the action has not yet FINISHED dispatching.
   * To check if it has finished, use `action.isFinished`.
   */
  public readonly isDispatched: boolean;

  /**
   * Returns true if the `before` method finished executing (normally or with an error).
   *
   */
  public readonly hasFinishedMethodBefore: boolean;

  /**
   * Returns true if the `reduce` method finished executing. (normally or with an error).
   */
  public readonly hasFinishedMethodReduce: boolean;

  /**
   * Returns true if the `after` method finished executing.
   */
  public readonly hasFinishedMethodAfter: boolean;

  /**
   * Returns true if the action finished with an error.
   */
  public readonly hasError: boolean;

  constructor(params: {
    isDispatched?: boolean,
    hasFinishedMethodBefore?: boolean,
    hasFinishedMethodReduce?: boolean,
    hasFinishedMethodAfter?: boolean
    hasError?: boolean
  } = {}) {
    this.isDispatched = params.isDispatched ?? false;
    this.hasFinishedMethodBefore = params.hasFinishedMethodBefore ?? false;
    this.hasFinishedMethodReduce = params.hasFinishedMethodReduce ?? false;
    this.hasFinishedMethodAfter = params.hasFinishedMethodAfter ?? false;
    this.hasError = params.hasError ?? false;
  }

  copy(params: {
    isDispatched?: boolean,
    hasFinishedMethodBefore?: boolean,
    hasFinishedMethodReduce?: boolean,
    hasFinishedMethodAfter?: boolean
    hasError?: boolean
  }) {
    return new ActionStatus({
      isDispatched: params.isDispatched ?? this.isDispatched,
      hasFinishedMethodBefore: params.hasFinishedMethodBefore ?? this.hasFinishedMethodBefore,
      hasFinishedMethodReduce: params.hasFinishedMethodReduce ?? this.hasFinishedMethodReduce,
      hasFinishedMethodAfter: params.hasFinishedMethodAfter ?? this.hasFinishedMethodAfter,
      hasError: params.hasError ?? this.hasError
    });
  }
}
