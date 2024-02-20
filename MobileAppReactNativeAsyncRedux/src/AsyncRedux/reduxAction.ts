import { Store } from './store.tsx';

export abstract class ReduxAction<St> {

  abstract reducer(): St | Promise<St | null> | null;

  private _store: Store<St> | null = null;

  // Returns the Redux store.
  protected get store(): Store<St> {
    if (this._store === null) throw new Error('Store not set in action');
    return this._store;
  }

  // Returns the current state of the Redux store.
  protected get state(): St {
    return this.store.state;
  }

  // Dispatches an action to the Redux store.
  protected get dispatch(): (action: ReduxAction<St>) => void {
    return this.store?.dispatch;
  }

  // For Async Redux internal use only.
  public _injectStore(_store: Store<St>) {
    this._store = _store;
  }

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

