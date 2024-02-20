import { ReduxAction } from './ReduxAction.ts';
import { Wait, WaitOperation } from './Wait.ts';

/**
 * [WaitAction] and [Wait] work together to help you create boolean flags that
 * indicate some process is currently running. For this to work your store state
 * must have a `Wait` field named `wait`, and the state must have a `copy` or
 * `copyWith` method that copies this field as a named parameter. For example:
 *
 * ```
 * class AppState {
 *   wait: Wait;
 *   copy({wait :Wait}) :AppState => AppState({wait: wait});
 *   }
 * ```
 */
export class WaitAction<St> extends ReduxAction<St> {
  reducer(): St | Promise<St | null> | null {
    let wait: Wait = (this.state as any).wait ?? new Wait();
    return (this.state as any).copy(
      { wait: wait.process(this.operation, this.flag, this.ref) }
    );
  }

  readonly operation: WaitOperation;
  readonly flag: any;
  readonly ref: any;
  readonly delayMillis: number | undefined;

  private constructor({ operation, flag, ref, delayMillis }: {
    operation: WaitOperation,
    flag: any,
    ref: any,
    delayMillis: number | undefined,
  }) {
    super();
    this.operation = operation;
    this.flag = flag;
    this.ref = ref;
    this.delayMillis = delayMillis;
  }

  /// Adds a [flag] that indicates some process is currently running.
  /// Optionally, you can also have a flag-reference called [ref].
  ///
  /// Note: [flag] and [ref] must be immutable objects.
  ///
  /// ```
  /// // Add a wait state, using this as the flag.
  /// dispatch(WaitAction.add(this));
  ///
  /// // Add a wait state, using this as the flag, and 123 as a reference.
  /// dispatch(WaitAction.add(this, ref: 123));
  /// ```
  /// Note: When the process finishes running, you will have to remove
  /// the [flag] by using the [remove] or [clear] methods.
  ///
  /// If you pass a [delay], the flag will be added only after that
  /// duration has passed, after the [add] method is called.
  ///
  static add<St>(flag: any, ref?: any, delayMillis?: number): WaitAction<St> {
    return new WaitAction({
      operation: WaitOperation.add,
      flag: flag,
      ref: ref,
      delayMillis: delayMillis
    });
  }


  /// Removes a [flag] previously added with the [add] method.
  /// Removing the flag indicating some process finished running.
  ///
  /// If you added the flag with a reference [ref], you must also pass the
  /// same reference here to remove it. Alternatively, if you want to
  /// remove all references to that flag, use the [clear] method instead.
  ///
  /// ```
  /// // Add and remove a wait state, using this as the flag.
  /// dispatch(WaitAction.add(this));
  /// dispatch(WaitAction.remove(this));
  ///
  /// // Adds and remove a wait state, using this as the flag, and 123 as a reference.
  /// dispatch(WaitAction.add(this, ref: 123));
  /// dispatch(WaitAction.remove(this, ref: 123));
  /// ```
  ///
  /// If you pass a [delay], the flag will be removed only after that
  /// duration has passed, after the [add] method is called. Example:
  ///
  /// ```
  /// // Add a wait state that will be automatically removed after 3 seconds.
  /// dispatch(WaitAction.add(this));
  /// dispatch(WaitAction.remove(this, delay: Duration(seconds: 3)));
  /// ```
  ///
  static remove<St>(flag: any, ref?: any, delayMillis?: number): WaitAction<St> {
    return new WaitAction({
      operation: WaitOperation.remove,
      flag: flag,
      ref: ref,
      delayMillis: delayMillis
    });
  }

  /// Clears (removes) the [flag], with all its references.
  /// Removing the flag indicating some process finished running.
  ///
  /// ```
  /// dispatch(WaitAction.add(this, flag: 123));
  /// dispatch(WaitAction.add(this, flag: "xyz"));
  /// dispatch(WaitAction.clear(this);
  /// ```
  static clear<St>(flag: any, ref?: any, delayMillis?: number): WaitAction<St> {
    return new WaitAction({
      operation: WaitOperation.clear,
      flag: flag,
      ref: ref,
      delayMillis: delayMillis
    });
  }


  toString(): string {
    return `WaitAction.${this.operation}` +
      `(flag: ${this.flag.toString()}, ` +
      `ref: ${this.ref.toString()})`;
  }
}



