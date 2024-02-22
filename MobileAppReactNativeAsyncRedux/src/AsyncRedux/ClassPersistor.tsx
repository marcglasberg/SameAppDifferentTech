// Assuming the existence of a Redux-like store and state management system in your TypeScript project

import { Persistor } from './Persistor.tsx';

import { State } from '../State.ts';
import { TodoItem, Todos } from '../Todos.ts';
import { Filter } from '../Filter.ts';
import { ESSerializer } from '../Esserializer';

/**
 * Use it like this:
 *
 * ```typescript
 * const persistor = new MyPersistor();
 *
 * let initialState = await persistor.readState();
 *
 * if (initialState === null) {
 *   initialState = AppState.initialState();
 *   await persistor.saveInitialState(initialState);
 * }
 *
 * const store = createStore<AppState>({
 *   initialState: initialState,
 *   persistor: persistor,
 * });
 * ```
 *
 * IMPORTANT: When the store is created with a Persistor, it assumes
 * the provided initial state was already persisted. Ensure this is the case.
 */
export class ClassPersistor<St> extends Persistor<St> {

  constructor(
    /**
     * Loads from localStorage (React), AsyncStorage (React Native) or other.
     */
    public loadJson: () => Promise<string | null>,
    /**
     * Saves to localStorage (React), AsyncStorage (React Native) or other.
     */
    public saveJson: (json: string) => Promise<void>,
    /**
     * Deletes from localStorage (React), AsyncStorage (React Native) or other.
     */
    public deleteJson: () => Promise<void>
    /**
     * Given the JavaScript Object, returns the state.
     */
    // public jsObjToState: (jsObj: any) => St
  ) {
    super();
  }

  /**
   * Read the saved state from the persistence. Should return null if the state is not yet
   * persisted. This method should be called only once, when the app starts, before the store
   * is created. The state it returns may become the store's initial-state. If some error
   * occurs while loading the info, we have to deal with it by fixing the problem. In the worse
   * case, if we think the state is corrupted and cannot be fixed, one alternative is deleting
   * all persisted files and returning null.
   */
  async readState(): Promise<St | null> {

    // Reads the JSON file as a string.
    const serializedString = await this.loadJson();
    if (serializedString === null) return null;

    ESSerializer.registerClasses([
      State,
      Todos,
      TodoItem,
      Filter,
    ]);

    // TODO: MARCELO move this to the Store constructor.
    const state = ESSerializer.deserialize(serializedString,
      [
        State,
        Todos,
        TodoItem,
        // Filter
      ]);

    // TODO: REMOVE
    // // Reads the JSON file as a string.
    // const json = await this.loadJson();
    // if (json === null) return null;
    //
    // // Converts the JSON string into a JavaScript Object value
    // // (Object, Array, string, number, boolean, or null) corresponding to
    // // the given JSON text. Throws SyntaxError if the string to parse fails.
    // const jsObj: any = JSON.parse(json);
    //
    // // Converts the JavaScript Object value into State.
    // const state = this.jsObjToState(jsObj);

    return state;
  }

  /**
   * Save an initial-state to the persistence.
   */
  async saveInitialState(state: St) {
    // let json = JSON.stringify(state);
    const serializedString = ESSerializer.serialize(state);
    await this.saveJson(serializedString);
  }

  /**
   * Delete the saved state from the persistence.
   */
  async deleteState() {
    return this.deleteJson();
  }

  /**
   * We assume the state is small, and we save `newState` everytime, ignoring `lastPersistedState`.
   */
  async persistDifference(stateChange: {
    lastPersistedState: St | null;
    newState: St
  }) {
    let json = JSON.stringify(stateChange.newState);
    await this.saveJson(json);
  }
}

