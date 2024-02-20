/**
 * Immutable object to keep track of boolean flags that indicate if some
 * process is in progress (the user is "waiting").
 *
 * The flags and flag-references can be any immutable object.
 * They must be immutable to make sure [Wait] is also immutable.
 *
 * Use it in Redux store states, like this:
 * * To add a flag: state.copy(wait: state.wait.add(flag: myFlag));
 * * To remove a flag: state.copy(wait: state.wait.remove(flag: myFlag));
 * * To clear all flags: state.copy(wait: state.wait.clear());
 *
 * If can also use have a flag with a reference, like this:
 * * To add a flag with reference: state.copy(wait: state.wait.add(flag: myFlag, ref:MyRef));
 * * To remove a flag with reference: state.copy(wait: state.wait.remove(flag: myFlag, ref:MyRef));
 * * To clear all references for a flag: state.copy(wait: state.wait.clear(flag: myFlag));
 *
 * In the ViewModel, you can check the flags/references, like this:
 *
 * * To check if there is any waiting: state.wait.isWaiting
 * * To check if is waiting a specific flag: state.wait.isWaitingFor(myFlag);
 * * To check if is waiting a specific flag/reference: state.wait.isWaitingFor(myFlag, ref: myRef);
 *
 */
export class Wait {
  private readonly _flags: FlagsMap;

  constructor();
  constructor(flags: FlagsMap);
  constructor(flags?: FlagsMap) {
    this._flags = flags || {};
  }

  /**
   * Convenience flag that you can use when a `null` value means ALL.
   * For example, suppose if you want until an async process schedules an `appointment`
   * for specific `time`. However, if no time is selected, you want to schedule the whole
   * day (all "times"). You can do:
   * `dispatch(WaitAction.add(appointment, ref: time ?? Wait.ALL));`
   *
   * And then later check if you are waiting for a specific time:
   * `if (wait.isWaitingFor(appointment, ref: time) { ... }`
   *
   * Or if you are waiting for the whole day:
   * `if (wait.isWaitingFor(appointment, ref: Wait.ALL) { ... }`
   *
   */
  static readonly ALL = {};

  add(flag: any, ref: any = null): Wait {
    const newFlags = this._deepCopy();

    if (!newFlags[flag]) {
      newFlags[flag] = new Set();
    }

    newFlags[flag].add(ref);

    return new Wait(newFlags);
  }

  remove(flag: any, ref: any = null): Wait {
    if (Object.keys(this._flags).length === 0) {
      return this;
    } else {
      const newFlags = this._deepCopy();

      if (ref === null) {
        delete newFlags[flag];
      } else {
        newFlags[flag]?.delete(ref);
        if (newFlags[flag]?.size === 0) {
          delete newFlags[flag];
        }
      }

      if (Object.keys(newFlags).length === 0) {
        return new Wait();
      } else {
        return new Wait(newFlags);
      }
    }
  }

  clear(flag: any = null): Wait {
    if (flag === null) {
      return new Wait();
    } else {
      const newFlags = this._deepCopy();
      delete newFlags[flag];
      return new Wait(newFlags);
    }
  }

  /**
   *  Return true if there is any waiting (any flag).
   */
  isWaiting(): boolean {
    return Object.keys(this._flags).length > 0;
  }

  /**
   * Return true if is waiting for a specific flag.
   * If [ref] is null, it returns true if it's waiting for any reference of the flag.
   * If [ref] is not null, it returns true if it's waiting for that specific reference of the flag.
   */
  isWaitingFor(flag: any, ref: any = null): boolean {
    const refs = this._flags[flag];

    if (ref === null) {
      return !!refs && refs.size > 0;
    } else {
      return !!refs && refs.has(ref);
    }
  }

  /**
   * Return true if is waiting for ANY flag of the specific type.
   *
   * This is useful when you want to wait for an Action to finish. For example:
   *
   * ```
   * class MyAction extends ReduxAction<AppState> {
   *   Future<AppState?> reduce() async {
   *     await doSomething();
   *     return null;
   *   }
   *
   *   void before() => dispatch(WaitAction.add(this));
   *   void after() => dispatch(WaitAction.remove(this));
   * }
   *
   * // Then, in some widget or connector:
   * if (wait.isWaitingForType<MyAction>()) { ... }
   * ```
   */
  isWaitingForType<T>(type: { new(...args: any[]): T }): boolean {
    return Object.keys(this._flags).some((flag) => this._flags[flag] instanceof type);
  }

  private _deepCopy(): FlagsMap {
    const newFlags: FlagsMap = {};

    Object.entries(this._flags).forEach(([flag, refs]) => {
      newFlags[flag] = new Set(refs);
    });

    return newFlags;
  }

  process(operation: WaitOperation, flag: any, ref?: any): Wait {
    if (operation === WaitOperation.add)
      return this.add(flag, ref);
    else if (operation === WaitOperation.remove)
      return this.remove(flag, ref);
    else if (operation === WaitOperation.clear)
      return this.clear(flag);
    else
      throw new Error(`Invalid operation: ${operation}`);
  }

}

/**
 * Interface for the flags storage structure
 */
interface FlagsMap {
  [key: string]: Set<any>;
}

export enum WaitOperation { add = 'add', remove = 'remove', clear = 'clear' }
