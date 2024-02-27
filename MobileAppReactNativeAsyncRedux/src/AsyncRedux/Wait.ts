// TODO: DONT REMOVE (This will be implemented in the future)
// /**
//  * Immutable object to keep track of boolean flags that indicate if some
//  * process is in progress (the user is "waiting").
//  *
//  * The flags and flag-references can be any immutable object.
//  * They must be immutable to make sure [Wait] is also immutable.
//  *
//  * Use it in Redux store states, like this:
//  * * To add a flag: state.copy(wait: state.wait.add(flag: myFlag));
//  * * To remove a flag: state.copy(wait: state.wait.remove(flag: myFlag));
//  * * To clear all flags: state.copy(wait: state.wait.clear());
//  *
//  * If can also use have a flag with a reference, like this:
//  * * To add a flag with reference: state.copy(wait: state.wait.add(flag: myFlag, ref:MyRef));
//  * * To remove a flag with reference: state.copy(wait: state.wait.remove(flag: myFlag, ref:MyRef));
//  * * To clear all references for a flag: state.copy(wait: state.wait.clear(flag: myFlag));
//  *
//  * In the ViewModel, you can check the flags/references, like this:
//  *
//  * * To check if there is any waiting: state.wait.isWaiting
//  * * To check if it's waiting a specific flag: state.wait.isWaitingFor(myFlag);
//  * * To check if it's waiting a specific flag/reference: state.wait.isWaitingFor(myFlag, ref: myRef);
//  *
//  */
// export class Wait {
//   private readonly _flags: FlagsMap;
//
//   constructor();
//   constructor(flags: FlagsMap);
//   constructor(flags?: FlagsMap) {
//     this._flags = flags || {};
//   }
//
//   /**
//    * Convenience flag that you can use when a `null` value means ALL.
//    * For example, suppose if you want until an async process schedules an `appointment`
//    * for specific `time`. However, if no time is selected, you want to schedule the whole
//    * day (all "times"). You can do:
//    * `dispatch(WaitAction.add(appointment, ref: time ?? Wait.ALL));`
//    *
//    * And then later check if you are waiting for a specific time:
//    * `if (wait.isWaitingFor(appointment, ref: time) { ... }`
//    *
//    * Or if you are waiting for the whole day:
//    * `if (wait.isWaitingFor(appointment, ref: Wait.ALL) { ... }`
//    *
//    */
//   static readonly ALL = {};
//
//   add(flag: any, ref: any = null): Wait {
//     const newFlags = this._deepCopy();
//
//     if (!newFlags[flag]) {
//       newFlags[flag] = new Set();
//     }
//
//     newFlags[flag].add(ref);
//
//     return new Wait(newFlags);
//   }
//
//   remove(flag: any, ref: any = null): Wait {
//     if (Object.keys(this._flags).length === 0) {
//       return this;
//     } else {
//       const newFlags = this._deepCopy();
//
//       if (ref === null) {
//         delete newFlags[flag];
//       } else {
//         newFlags[flag]?.delete(ref);
//         if (newFlags[flag]?.size === 0) {
//           delete newFlags[flag];
//         }
//       }
//
//       if (Object.keys(newFlags).length === 0) {
//         return new Wait();
//       } else {
//         return new Wait(newFlags);
//       }
//     }
//   }
//
//   clear(flag: any = null): Wait {
//     if (flag === null) {
//       return new Wait();
//     } else {
//       const newFlags = this._deepCopy();
//       delete newFlags[flag];
//       return new Wait(newFlags);
//     }
//   }
//
//   /**
//    *  Return true if there is any waiting (any flag).
//    */
//   isWaiting(): boolean {
//     return Object.keys(this._flags).length > 0;
//   }
//
//   /**
//    * Return true if is waiting for a specific flag.
//    * If [ref] is null, it returns true if it's waiting for any reference of the flag.
//    * If [ref] is not null, it returns true if it's waiting for that specific reference of the flag.
//    */
//   isWaitingFor(flag: any, ref: any = null): boolean {
//     const refs = this._flags[flag];
//
//     if (ref === null) {
//       return !!refs && refs.size > 0;
//     } else {
//       return !!refs && refs.has(ref);
//     }
//   }
//
//   /**
//    * Return true if is waiting for ANY flag of the specific type.
//    *
//    * This is useful when you want to wait for an Action to finish. For example:
//    *
//    * ```
//    * class MyAction extends ReduxAction<AppState> {
//    *   Future<AppState?> reduce() async {
//    *     await doSomething();
//    *     return null;
//    *   }
//    *
//    *   void before() => dispatch(WaitAction.add(this));
//    *   void after() => dispatch(WaitAction.remove(this));
//    * }
//    *
//    * // Then, in some widget or connector:
//    * if (wait.isWaitingForType<MyAction>()) { ... }
//    * ```
//    */
//   isWaitingForType<T>(type: { new(...args: any[]): T }): boolean {
//     return Object.keys(this._flags).some((flag) => this._flags[flag] instanceof type);
//   }
//
//   private _deepCopy(): FlagsMap {
//     const newFlags: FlagsMap = {};
//
//     Object.entries(this._flags).forEach(([flag, refs]) => {
//       newFlags[flag] = new Set(refs);
//     });
//
//     return newFlags;
//   }
//
//   process(operation: WaitOperation, flag: any, ref?: any): Wait {
//     if (operation === WaitOperation.add)
//       return this.add(flag, ref);
//     else if (operation === WaitOperation.remove)
//       return this.remove(flag, ref);
//     else if (operation === WaitOperation.clear)
//       return this.clear(flag);
//     else
//       throw new Error(`Invalid operation: ${operation}`);
//   }
//
//   toString(): string {
//     return `Wait(${JSON.stringify(this._flags)})`;
//   }
// }
//
// /**
//  * Interface for the flags storage structure
//  */
// interface FlagsMap {
//   [key: string]: Set<any>;
// }
//
// export enum WaitOperation { add = 'add', remove = 'remove', clear = 'clear' }
//
// import { ReduxAction } from './ReduxAction.ts';
// import { Wait, WaitOperation } from './Wait.ts';
//
// /**
//  * [WaitAction] and [Wait] work together to help you create boolean flags that
//  * indicate some process is currently running. For this to work your store state
//  * must have a `Wait` field named `wait`, and the state must have a `copy` or
//  * `copyWith` method that copies this field as a named parameter. For example:
//  *
//  * ```
//  * class AppState {
//  *   wait: Wait;
//  *   copy({wait :Wait}) :AppState => AppState({wait: wait});
//  *   }
//  * ```
//  */
// export class WaitAction<St> extends ReduxAction<St> {
//   reduce(): St | Promise<St | null> | null {
//     let wait: Wait = (this.state as any).wait ?? new Wait();
//     return (this.state as any).copy(
//       { wait: wait.process(this.operation, this.flag, this.ref) }
//     );
//   }
//
//   readonly operation: WaitOperation;
//   readonly flag: any;
//   readonly ref: any;
//   readonly delayMillis: number | undefined;
//
//   private constructor({ operation, flag, ref, delayMillis }: {
//     operation: WaitOperation,
//     flag: any,
//     ref: any,
//     delayMillis: number | undefined,
//   }) {
//     super();
//     this.operation = operation;
//     this.flag = flag;
//     this.ref = ref;
//     this.delayMillis = delayMillis;
//   }
//
//   /// Adds a [flag] that indicates some process is currently running.
//   /// Optionally, you can also have a flag-reference called [ref].
//   ///
//   /// Note: [flag] and [ref] must be immutable objects.
//   ///
//   /// ```
//   /// // Add a wait state, using this as the flag.
//   /// dispatch(WaitAction.add(this));
//   ///
//   /// // Add a wait state, using this as the flag, and 123 as a reference.
//   /// dispatch(WaitAction.add(this, ref: 123));
//   /// ```
//   /// Note: When the process finishes running, you will have to remove
//   /// the [flag] by using the [remove] or [clear] methods.
//   ///
//   /// If you pass a [delay], the flag will be added only after that
//   /// duration has passed, after the [add] method is called.
//   ///
//   static add<St>(flag: any, ref?: any, delayMillis?: number): WaitAction<St> {
//     return new WaitAction({
//       operation: WaitOperation.add,
//       flag: flag,
//       ref: ref,
//       delayMillis: delayMillis
//     });
//   }
//
//
//   /// Removes a [flag] previously added with the [add] method.
//   /// Removing the flag indicating some process finished running.
//   ///
//   /// If you added the flag with a reference [ref], you must also pass the
//   /// same reference here to remove it. Alternatively, if you want to
//   /// remove all references to that flag, use the [clear] method instead.
//   ///
//   /// ```
//   /// // Add and remove a wait state, using this as the flag.
//   /// dispatch(WaitAction.add(this));
//   /// dispatch(WaitAction.remove(this));
//   ///
//   /// // Adds and remove a wait state, using this as the flag, and 123 as a reference.
//   /// dispatch(WaitAction.add(this, ref: 123));
//   /// dispatch(WaitAction.remove(this, ref: 123));
//   /// ```
//   ///
//   /// If you pass a [delay], the flag will be removed only after that
//   /// duration has passed, after the [add] method is called. Example:
//   ///
//   /// ```
//   /// // Add a wait state that will be automatically removed after 3 seconds.
//   /// dispatch(WaitAction.add(this));
//   /// dispatch(WaitAction.remove(this, delay: Duration(seconds: 3)));
//   /// ```
//   ///
//   static remove<St>(flag: any, ref?: any, delayMillis?: number): WaitAction<St> {
//     return new WaitAction({
//       operation: WaitOperation.remove,
//       flag: flag,
//       ref: ref,
//       delayMillis: delayMillis
//     });
//   }
//
//   /// Clears (removes) the [flag], with all its references.
//   /// Removing the flag indicating some process finished running.
//   ///
//   /// ```
//   /// dispatch(WaitAction.add(this, flag: 123));
//   /// dispatch(WaitAction.add(this, flag: "xyz"));
//   /// dispatch(WaitAction.clear(this);
//   /// ```
//   static clear<St>(flag: any, ref?: any, delayMillis?: number): WaitAction<St> {
//     return new WaitAction({
//       operation: WaitOperation.clear,
//       flag: flag,
//       ref: ref,
//       delayMillis: delayMillis
//     });
//   }
//
//
//   toString(): string {
//     return `WaitAction.${this.operation}` +
//       `(flag: ${this.flag.toString()}, ` +
//       `ref: ${this.ref.toString()})`;
//   }
// }
//
//
//
