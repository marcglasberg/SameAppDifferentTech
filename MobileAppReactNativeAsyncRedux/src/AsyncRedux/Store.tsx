import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { AsyncReducer, AsyncReducerResult, ReduxAction, ReduxReducer } from './ReduxAction.ts';
import { UserException } from './UserException.ts';
import { StoreException } from './StoreException.ts';
import { Persistor } from './Persistor.tsx';
import { ProcessPersistence } from './ProcessPersistence.ts';


export type ShowUserException = (exception: UserException, count: number, next: () => void) => void;

interface ConstructorParams<St> {

  /**
   * The initial state of the app.
   */
  initialState: St;

  /**
   * AsyncRedux calls this function automatically when actions throw `UserException`s, so that
   * they can be shown to the user. Usually, this function opens some UI like a dialog or a toast,
   * with the error message.
   *
   * The `count` parameter is the number of exceptions still in the queue.
   *
   * You should explicitly call `next` function when the user is ready to see the next exception
   * in the queue, when the user dismisses the dialog or toast. If there are no more exceptions,
   * `next` will do nothing. Otherwise, it will call `showUserException` again. Example:
   *
   * ```ts
   * const showUserException: UserExceptionDialog =
   *   (exception, count, next) => {
   *     Alert.alert(
   *       exception.title || exception.message,
   *       exception.title ? exception.message : '',
   *       [{ text: 'OK', onPress: (value?: string) => next }]
   *     );
   *   };
   * ```
   */
  showUserException?: (exception: UserException, count: number, next: () => void) => void;

  /**
   * The persistor saves and retrieves the application's state from the local device storage,
   * ensuring data persistence across app restarts. Without a defined persistor, the app's state
   * will not be saved.
   *
   * The `Persistor` is an abstract base class, allowing developers to easily craft their custom
   * persistors. AsyncRedux makes it easy, by automatically invoking the persistor upon any state
   * modification, and passing it the information that needs to be saved as well as the last saved
   * state.
   *
   * AsyncRedux also offers a built-in `ClassPersistor` that can be used to persist the state by
   * serializing it to a string and saving it to the local device storage.
   */
  persistor?: Persistor<St>;

  /**
   * A function that AsyncRedux uses to log information.
   * If not defined, the default is printing messages to the console with `console.log()`.
   * To disable it, pass it as `() => {}`.
   */
  logger?: (obj: any) => void | undefined;

  /**
   * Global function to wrap errors.
   *
   * This `globalWrapError` will be given all errors thrown in your actions, including those
   * of type `UserException`. If and action already has a `wrapError` method, that method will
   * be called first, and then the `globalWrapError` will be called with the result.
   *
   * A common use case for this is to have a global place to convert some exceptions into
   * `UserException`s. For example, Firebase may throw some `PlatformExceptions` in response to
   * a bad connection to the server. In this case, you may want to show the user a dialog
   * explaining that the connection is bad, which you can do by converting it to a `UserException`.
   * While this could also be done in the action's `wrapError`, you'd have to add it to all
   * actions that use Firebase.
   *
   * IMPORTANT: If instead of RETURNING an error you throw an error inside the `globalWrapError`
   * function, AsyncRedux will catch this error and use it instead the original error. In other
   * words, returning an error or throwing an error works the same way. But it's recommended that
   * you return the error instead of throwing it anyway.
   *
   * Note: Don't use the `globalWrapError` to log errors, as you should prefer doing that
   * in the `ErrorObserver`.
   */
  globalWrapError?: (error: any) => any;

  /**
   * An `actionObserver` can be set during the `Store` creation.
   * It's called whenever actions are dispatched, and also when they finish.
   * The action and the dispatch-count are available, as well as the `ini` parameter:
   * If `ini` is true, this is right before the action is dispatched.
   * If `ini` is false, this is right after the action finishes.
   *
   * The `actionObserver` is a good place to log which actions are dispatched by your application.
   * For example, the following code logs actions to the console in development or test mode.
   * and logs actions to Crashlytics in production mode:
   *
   * ```ts
   * actionObserver: (action, dispatchCount, ini) => {
   *   if (inDevelopment() || inTests()) {
   *      if (ini) console.log('Action dispatched: ' + action);
   *      else console.log('Action finished: ' + action);
   *   }
   *   else Crashlytics.log('Dispatched: ' + action);
   * }
   * ```
   */
  actionObserver?: (action: ReduxAction<St>, dispatchCount: number, ini: boolean) => void;

  /**
   * A `stateObserver`s can be set during the `Store` creation.
   * It's called for all dispatched actions, right after the reducer returns, before
   * the action's `after()` method, before the action's `wrapError()`, and before
   * the `globalWrapError()`.
   *
   * The parameters are:
   *
   * - action = The action itself.
   *
   * - prevState = The state right before the new state returned by the reducer is applied. Note
   *              this may be different from the state when the action was dispatched.
   *
   * - newState = The state returned by the reducer. Note: If you need to know if the state was
   *             changed or not by the reducer, you can compare both states:
   *             `let ifStateChanged = prevState !=== newState;`
   *
   * - error = Is null if the reducer completed with no error and returned. Otherwise, will be the
   *           error thrown by the reducer (before any wrapError is applied). Note that, in case
   *           of error, both `prevState` and `newState` will be the current store state when the
   *           error was thrown.
   *
   * - dispatchCount = The sequential number of the dispatch.
   *
   * <br>
   *
   * The state-observer is a good place to add an interface to the Redux DevTools.
   * It's also a good place to add METRICS to your application. For example:
   *
   * ```
   * (action, prevState, newState, error, dispatchCount) => trackMetrics(action, newState, error);
   * ```
   *
   * An interesting idea is to add a method to the Action base class called `setMetrics`, that
   * allows actions to return tailored custom metrics about the action, and then use it in the
   * state-observer to track those metrics. For example:
   *
   * ```
   * export abstract class Action extends ReduxAction<State> {
   *    let metrics: any;
   *    setMetrics(): any { return null; }
   * }
   *
   * export class AddTodoAction extends Action {
   *   reducer() { ... }
   *   setMetrics() { return <someMetrics>; }
   * }
   * ...
   *
   * stateObserver: (action, prevState, newState, error, dispatchCount) => {
   *   let metrics = (action instanceof Action) ? action.metrics: null;
   *   trackMetrics(action, metrics, newState, error);
   * }
   * ```
   */
  stateObserver?: (action: ReduxAction<St>, prevState: St, newState: St, error: any, dispatchCount: number) => void;

  /**
   * An `errorObserver` can be set during the `Store` creation.
   * This will be given all errors that survive the action's `wrapError` and the `globalWrapError`,
   * including those of type `UserException`.
   *
   * You also get the `action` and a reference to the `store`. IMPORTANT: Don't use the store to
   * dispatch any actions, as this may have unpredictable results.
   *
   * The `errorObserver` is the ideal place to log errors, as you have all the information you may
   * need, including the `action` that dispatched the error, which you can use to log the action
   * name, as well as any action properties you may find interesting.
   *
   * After you log the error, you may then return `true` to let the error throw,
   * or `false` to swallow it.
   *
   * After logging the error you may To disable the error, return `null`. For example, if you want to disable all errors
   * of type `MyException`, but log them:
   *
   * ```
   * errorObserver: (error, action) {
   *
   *    // In development, we throw the error so that we can see it in the emulator/console.
   *    if (inDevelopment() || inTests() || (error instanceof UserException)) return true;
   *
   *    // In production, we log the error, and swallow it.
   *    else {
   *       Logger.error(`Got ${error} in action ${action}.`);
   *       return false;
   *       }
   * }
   * ```
   */
  errorObserver?: (error: any, action: ReduxAction<St>, store: Store<St>) => boolean;
}

/**
 * The store holds the state of the application and allows the state to be updated
 * by dispatching actions. The store is also responsible for showing user exceptions
 * to the user, persisting the state to the local device disk, processing wait states
 * to show spinners while async operations are in progress, and more.
 */
export class Store<St> {

  public static log: (obj: any) => void;

  private _state: St;

  // A queue of errors of type UserException, thrown by actions.
  // They are shown to the user using the function `showUserException`.
  private readonly _userExceptionsQueue: UserException[];

  // Hold the wait states of async operations in progress.
  private readonly _actionsInProgress: Set<ReduxAction<St>>;

  private readonly _autoRegisterWaitStates: boolean;
  private readonly _processPersistence: ProcessPersistence<St> | null;
  private _dispatchCounter = 0;
  private _forceUpdate: Dispatch<SetStateAction<number>> | null;

  // A function that shows `UserExceptions` to the user, using some UI like a dialog or a toast.
  // This function is passed to the constructor. If not passed, the `UserException` is ignored.
  private readonly _showUserException: ShowUserException;

  private readonly _globalWrapError?: (error: any, action: ReduxAction<St>) => any;
  private readonly _actionObserver?: (action: ReduxAction<St>, dispatchCount: number, ini: boolean) => void;
  private readonly _stateObserver?: (action: ReduxAction<St>, prevState: St, newState: St, error: any, dispatchCount: number) => void;
  private readonly _errorObserver?: (error: any, action: ReduxAction<St>, store: Store<St>) => boolean;

  // The default logger prints messages to the console.
  private _defaultLogger(obj: any) {
    console.log(obj);
  };

  // The default Ui just logs all user-exceptions and removes them from the queue.
  private _defaultShowUserException(exception: UserException, count: number, next: () => void) {
    Store.log(`User got an exception: ${exception}`);
    next();
  };

  constructor({
                initialState,
                showUserException,
                persistor,
                globalWrapError,
                actionObserver,
                stateObserver,
                errorObserver,
                logger
              }: ConstructorParams<St>
  ) {
    this._state = initialState;
    this._showUserException = showUserException || this._defaultShowUserException;
    this._processPersistence = (persistor === undefined) ? null : new ProcessPersistence(persistor, initialState);
    this._globalWrapError = globalWrapError;
    this._actionObserver = actionObserver;
    this._stateObserver = stateObserver;
    this._errorObserver = errorObserver;
    Store.log = logger || this._defaultLogger;
    this._userExceptionsQueue = [];
    this._actionsInProgress = new Set();
    this._forceUpdate = null;
    this._autoRegisterWaitStates = true;

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

  /**
   * Dispatches an action and returns a promise that resolves when the action finishes.
   * While the state change from the action's reducer will have been applied when the promise
   * resolves, other independent processes that the action may have started may still be in
   * progress.
   *
   * Usage: `await store.dispatchAndWait(new MyAction())`.
   */
  dispatchAndWait(action: ReduxAction<St>): Promise<void> {
    let promise = action._createPromise();
    this.dispatch(action);
    return promise;
  }

  dispatch(action: ReduxAction<St>) {

    if (this._forceUpdate === null) Store.log('Component tree not wrapped with <StoreProvider store={store}>');

    if (action.status.isDispatched)
      throw new StoreException('The action was already dispatched. Please, create a new action each time.');

    // We inject the store so that the action can access it (and state, dispatch etc)
    // as an object property.
    action._injectStore(this);

    Store.log('Dispatched: ' + action);

    // The action is dispatched twice. This is the 1st: when the action starts (ini true).
    this._actionObserver?.(action, this._dispatchCounter, true);

    // Adds a wait state for the action in progress.
    if (this._autoRegisterWaitStates) {
      this._actionsInProgress.add(action);
      this._forceUpdate?.(++this._dispatchCounter);
    }

    this._wraps(
      action,
      () => this._runFromStart(action)
    );
  }

  // Wraps SYNC actions.
  // - Runs the before are reduce methods.
  // - Runs the state observer.
  // - Catches and processes errors.
  // - Shows some UI if there are user exceptions.
  // - Makes sure the after method runs, always.
  // - Removes the wait state for the action in progress, always.
  // - Runs the action observer.
  private _wraps(
    action: ReduxAction<St>,
    functionToRun: () => boolean
  ) {
    let ifWentAsync = false;
    try {
      ifWentAsync = functionToRun();
    } catch (error) {
      this._processWrapsError(error, action);
    } finally {
      if (!ifWentAsync) {
        this._processWrapsFinally(action);
      }
    }
  }

  // Wraps ASYNC actions.
  // - Runs the before are reduce methods.
  // - Runs the state observer.
  // - Catches and processes errors.
  // - Shows some UI if there are user exceptions.
  // - Makes sure the after method runs, always.
  // - Removes the wait state for the action in progress, always.
  // - Runs the action observer.
  private async _wrapsAsync(
    action: ReduxAction<St>,
    functionToRun: () => Promise<void>
  ) {
    try {
      await functionToRun();
    } catch (error) {
      this._processWrapsError(error, action);
    } finally {
      this._processWrapsFinally(action);
    }
  }

  private _processWrapsError(error: any, action: ReduxAction<St>) {
    //
    // Observe the state with an error here. We use the current state; no new state was applied.
    // This is before the action's `after()` and `wrapError()` and `globalWrapError`.
    this._stateObserver?.(action, this._state, this._state, error, this._dispatchCounter);

    // Any error may optionally be processed by the `wrapError` method of the action.
    // Usually this is used to wrap the error inside another that better describes the failed
    // action. It's recommended RETURNING the new error, but if `wrapError` throws an error,
    // that will be used too.
    try {
      error = action.wrapError(error);
    } catch (thrownError) {
      error = thrownError;
    }

    if (error !== null) {

      // The default wrap error does nothing (returns all errors unaltered).

      // Any error may optionally be processed by the `globalWrapError` passed to the Store
      // constructor. This is useful to wrap all errors in a common way. It's recommended
      // RETURNING the new error, but if `globalWrapError` throws an error, that will be used too.
      if (this._globalWrapError != null) {
        try {
          error = this._globalWrapError(error, action);
        } catch (thrownError) {
          error = thrownError;
        }
      }

      // To completely disable the error, `wrapError` or `globalWrapError` may return `null`.
      // But if we got an error, we deal with it here.
      if (error !== null) {

        // Errors of type `UserException` are added to the error queue,
        // and show is some Ui (usually a dialog or a toast).
        if (error instanceof UserException) {
          this._addUserException(error);
          this._openSomeUiToShowUserException();
        }

        // If an error-observer WAS NOT defined in the Store constructor, swallows errors
        // of type `UserExceptions` (which were already shown to the user in some UI)
        // and rethrows all others, after the async gap.
        if (this._errorObserver == null) {
          if (!(error instanceof UserException)) {
            queueMicrotask(() => {
              throw error;
            });
          }
        }
        // However, if as error-observer WAS defined in the Store constructor,
        else {
          // We call the error-observer.
          // If it returns `true`, the error throws.
          // If it returns `false`, the error is swallowed.
          let shouldThrow = this._errorObserver(error, action, this);

          // Other errors are thrown after the async gap, without interrupting the code flow.
          // Note: When the error-observer is defined, we don't make a distinction between
          // `UserExceptions` and other errors, anymore. We let the error-observer do
          // that if it wants.
          if (shouldThrow)
            queueMicrotask(() => {
              throw error;
            });
        }
      }
    }
  }

  private _processWrapsFinally(action: ReduxAction<St>) {
    // We run the `after` method of the action.
    try {
      action.after();
    } catch (error) {
      Store.log('The `after()` method of the action ' + action + ' threw an error: ' + error
        + '. This error will be ignored, but you should fix this, as `after()` methods should ' +
        'not throw errors.');
    }

    // Removed the wait state for the action in progress.
    if (this._autoRegisterWaitStates) {
      this._actionsInProgress.delete(action);
      this._forceUpdate?.(++this._dispatchCounter);
    }

    // The action is dispatched twice. This is the 2nd: when the action ends (ini false).
    this._actionObserver?.(action, this._dispatchCounter, false);

    // This allows us to `await dispatchAndWait(new MyAction())`
    action._resolvePromise();
  }

  private _runFromStart(action: ReduxAction<St>): boolean {

    // BEFORE

    // 1) Runs the `before` method.
    // It may be sync or async, but it doesn't return anything.
    let beforeResult: void | Promise<void> = action.before();

    // 2) If it's async, waits for the `before` method to finish.
    if (beforeResult instanceof Promise<void>) {
      this._runAsyncBeforeOnwards(action, beforeResult).then();
      return true; // Get out of here. Went ASYNC.
    }

    // REDUCE

    // 3)
    // - Runs the SYNC `reduce` method; OR
    // - Runs the initial sync part of the ASYNC `reduce` method.
    let reduceResult: ReduxReducer<St> = action.reducer();

    // 4) If the reducer returned null, or if it returned the unaltered state, we simply do nothing.
    if (reduceResult === null || reduceResult === this.state) {
      return false; // Kept SYNC.
    }
      //
    // 5) If the reducer is ASYNC, we still process the rest of the reducer to generate the new state.
    else if (reduceResult instanceof Promise<AsyncReducerResult<St>>) {
      this._runAsyncReduceOnwards(action, reduceResult);
      return true; // Get out of here. Went ASYNC.
    }
      //
    // 6) If the reducer is SYNC, we already have the new state, and we simply must apply it.
    else {
      this._registerState(action, reduceResult);
      return false; // Kept SYNC.
    }
  }

  private async _runAsyncBeforeOnwards(action: ReduxAction<St>, beforeResult: Promise<void>) {

    this._wrapsAsync(action, async () => {

      // 2.1) Method `before` is ASYNC, so we wait for it to finish.
      await beforeResult;

      // REDUCE

      // 2.2)
      // - Runs the SYNC `reduce` method; OR
      // - Runs the initial sync part of the ASYNC `reduce` method.
      let reduceResult: ReduxReducer<St> | AsyncReducerResult<St> = action.reducer();

      // 2.3) If the reducer returned null, or if it returned the unaltered state, we simply do nothing.
      if (reduceResult === null || reduceResult === this.state) {
        return; // Get out of here.
      }
        //
      // 2.4) If the reducer is ASYNC, we still process the rest of the reducer to generate the new state.
      else if (reduceResult instanceof Promise<ReduxReducer<St>>) {
        reduceResult = await reduceResult as AsyncReducerResult<St>;

        if (reduceResult !== null && reduceResult !== this.state) {
          let newAsyncState = reduceResult(this.state);
          if (newAsyncState != null) {
            this._registerState(action, newAsyncState);
          }
        }
        return; // Get out of here.
      }
        //
      // 2.5) If the reducer is SYNC, we already have the new state, and we simply must apply it.
      else {
        this._registerState(action, reduceResult);
        return; // Get out of here.
      }
    }).then();
  }

  private _runAsyncReduceOnwards(action: ReduxAction<St>, reduceResult: AsyncReducer<St>) {

    this._wrapsAsync(action, async () => {

      // 5.1) Method `reduce` is ASYNC, so we wait for it to finish.
      let functionalReduceResult: AsyncReducerResult<St> = await reduceResult;

      // 5.2) If the reducer returned null, we simply do nothing.
      if (functionalReduceResult === null) {
        return; // Get out of here.
      }
        //
        // 5.3) If the reducer returned a function `(state: St) => (St | null)`,
      // we still need to run this function to generate the new state.
      else {
        let finalReduceState = functionalReduceResult(this.state);

        if (finalReduceState != null) {
          this._registerState(action, finalReduceState);
        }

        return; // Get out of here.
      }
    }).then();
  }

  private _registerState(action: ReduxAction<St>, newState: St) {

    try {
      let stateChangeDescription = Store.describeStateChange(this.state, newState);
      if (stateChangeDescription !== '') Store.log(stateChangeDescription);
    } catch (error) {
      // Swallow error and do nothing, as this is just a debug print.
    }

    const prevState = this._state;

    if (newState !== null && newState !== this._state) {
      this._state = newState;

      // Observe the state with null error, because the reducer completed normally.
      this._stateObserver?.(action, prevState, newState, null, this._dispatchCounter);

      this._forceUpdate?.(++this._dispatchCounter);
    }

    if (this._processPersistence != null)
      this._processPersistence.process(
        action,
        newState
      );
  }

  /**
   * We check to see if any errors are in the queue and if so, we show the first one.
   * We then remove the first error from the queue and call this method again to show the next
   * error, if any. For this to work, we have to pass a function to the constructor of Store that
   * will show the error to the user. This function is called `showUserException`.
   *
   * An example using React Native:
   *
   * ```ts
   * const showUserException = (exception: UserException, next: () => void) => {
   *     Alert.alert(
   *       exception.title || exception.message,
   *       exception.title ? exception.message : '',
   *       [{ text: 'OK', onPress: (value?: string) => { next(); }]
   *     );
   *   };
   * ```
   */
  private _openSomeUiToShowUserException() {
    let currentError = this.getNextUserExceptionInQueue();
    if (currentError !== undefined) {
      let count = this._userExceptionsQueue.length;
      this._showUserException?.(currentError, count, () => {
        this._openSomeUiToShowUserException();
      });
    }
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

  isDispatching<T extends ReduxAction<St>>(type: { new(...args: any[]): T }): boolean {

    // Returns true if an action of the given type is still being executed.
    for (const action of this._actionsInProgress) {
      if (action instanceof type) {
        return true;
      }
    }
    return false;
  }

  // TODO: MARCELO Change this.
  _inject(forceUpdate: Dispatch<SetStateAction<number>>) {
    this._forceUpdate = forceUpdate;
  }

  static describeStateChange(obj1: any, obj2: any, path: string = ''): String {
    // Ensure both parameters are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
      return '';
      // Note: This method should not fail.
      // Throw new StoreException(`Type mismatch or one of the objects is null at path: ${path}`);
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

