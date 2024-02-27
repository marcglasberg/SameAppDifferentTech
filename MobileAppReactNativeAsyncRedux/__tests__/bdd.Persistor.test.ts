import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { Persistor } from '../src/AsyncRedux/Persistor.tsx';

reporter(new FeatureFileReporter());

const feature = new Feature('Persistor  ');
const logger = (obj: any) => process.stdout.write(obj + '\n');

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('There is no persisted state. ' +
    'State changes are persisted by a SYNC persistor.')
  .given('There is no persisted state when the store is created.')
  .and('The persistor works SYNC when called (like localStorage).')
  .and('An action that changes the state.')
  .when('The store is created.')
  .and('The action is dispatched.')
  .then('The initial-state is initially in the store.')
  .and('The initial-state in the store is persisted.')
  .and('The new state created by the dispatched action is persisted.')
  .run(async (ctx) => {

    let persistor = new MyPersistor();

    let store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      persistor: persistor
    });

    // When the store is created:
    // - The store state is initialState.
    // - There is no state persisted.
    expect(store.state.count).toBe(1);
    expect(persistor.savedState).toBeNull();

    // However, creating the store will tell the Persistor to read the state.
    // In this case, there is no state persisted, so the Persistor will persist the initialState.
    await delayMillis(10);
    expect(store.state.count).toBe(1);
    expect(persistor.savedState?.count).toBe(1);

    // We now dispatch an action that increments the state.
    // The persistor saves it too.
    store.dispatch(new Increment());
    expect(store.state.count).toBe(2);
    expect(persistor.savedState?.count).toBe(2);
  });

Bdd(feature)
  .scenario('The persisted state is read when the Store is created. ' +
    'State changes are persisted by a SYNC persistor.')
  .given('There is some state already persisted when the store is created.')
  .and('The persistor works SYNC when called (like localStorage).')
  .and('An action that changes the state.')
  .when('The store is created.')
  .and('The action is dispatched.')
  .then('The initial-state is initially in the store.')
  .and('The persisted state is read into the store.')
  .and('The new state created by the dispatched action is persisted.')
  .run(async (ctx) => {

    // There is some state already persisted when the store is created.
    let persistor = new MyPersistor();
    persistor.savedState = new State(42);

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      persistor: persistor
    });

    // When the store is created:
    // - The store state is initialState.
    // - There is a state persisted as `42`.
    expect(store.state.count).toBe(1);
    expect(persistor.savedState?.count).toBe(42);

    // Creating the store will tell the Persistor to read the state.
    // This time there is a state persisted, so the Persistor will read it.
    await delayMillis(10);
    expect(store.state.count).toBe(42);
    expect(persistor.savedState?.count).toBe(42);

    // We now dispatch an action that increments the state.
    // The persistor saves it too.
    store.dispatch(new Increment());
    expect(store.state.count).toBe(43);
    expect(persistor.savedState?.count).toBe(43);
  });

Bdd(feature)
  .scenario('There is no persisted state. ' +
    'State changes are persisted by an ASYNC persistor.')
  .given('There is no persisted state when the store is created.')
  .and('The persistor works SYNC when called (like localStorage).')
  .and('An action that changes the state.')
  .when('The store is created.')
  .and('The action is dispatched.')
  .then('The initial-state is initially in the store.')
  .and('The initial-state in the store is persisted.')
  .and('The new state created by the dispatched action is persisted.')
  .run(async (ctx) => {

    let persistor = new MyPersistorSlow();

    let store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      persistor: persistor
    });

    // When the store is created:
    // - The store state is initialState.
    // - There is no state persisted.
    expect(store.state.count).toBe(1);
    expect(persistor.savedState).toBeNull();

    // However, creating the store will tell the Persistor to read the state.
    // In this case, there is no state persisted, so the Persistor will persist the initialState.
    // However, it takes 250 millis to do so. So after 10 millis, the state is not yet persisted.
    await delayMillis(10);
    expect(store.state.count).toBe(1);
    expect(persistor.savedState?.count).toBe(undefined);

    // Waiting more than 150 millis, the state is finally persisted.
    await delayMillis(300);
    expect(store.state.count).toBe(1);
    expect(persistor.savedState?.count).toBe(1);

    // We now dispatch an action that increments the state.
    // The persistor saves it too.
    // However, it takes 150 millis to do so. So after 10 millis, the state is not yet persisted.
    store.dispatch(new Increment());
    expect(store.state.count).toBe(2);
    expect(persistor.savedState?.count).toBe(1);

    // Waiting more than 150 millis, the state is finally persisted.
    await delayMillis(300);
    expect(store.state.count).toBe(2);
    expect(persistor.savedState?.count).toBe(2);
  });

Bdd(feature)
  .scenario('The persisted state is read when the Store is created. ' +
    'State changes are persisted by an ASYNC persistor.')
  .given('There is some state already persisted when the store is created.')
  .and('The persistor works SYNC when called (like localStorage).')
  .and('An action that changes the state.')
  .when('The store is created.')
  .and('The action is dispatched.')
  .then('The initial-state is initially in the store.')
  .and('The persisted state is read into the store.')
  .and('The new state created by the dispatched action is persisted.')
  .run(async (ctx) => {

    // There is some state already persisted when the store is created.
    let persistor = new MyPersistorSlow();
    persistor.savedState = new State(42);

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      persistor: persistor
    });

    // When the store is created:
    // - The store state is initialState.
    // - There is a state persisted as `42`.
    expect(store.state.count).toBe(1);
    expect(persistor.savedState?.count).toBe(42);

    // Creating the store will tell the Persistor to read the state.
    // This time there is a state persisted, so the Persistor will read it.
    // However, it takes 150 millis to do so. So after only 10 millis, the state is not yet read.
    await delayMillis(10);
    expect(store.state.count).toBe(1);
    expect(persistor.savedState?.count).toBe(42);

    // Waiting more than 150 millis, the state is finally read.
    await delayMillis(300);
    expect(store.state.count).toBe(42);
    expect(persistor.savedState?.count).toBe(42);

    // We now dispatch an action that increments the state.
    // The persistor saves it too, but not immediately.
    store.dispatch(new Increment());
    expect(store.state.count).toBe(43);
    expect(persistor.savedState?.count).toBe(42);

    // Waiting more than 150 millis, the state is finally persisted.
    await delayMillis(300);
    expect(store.state.count).toBe(43);
    expect(persistor.savedState?.count).toBe(43);
  });

Bdd(feature)
  .scenario('State changes are only persisted when the previous state finished persisting.')
  .given('The persistor is async and slow, taking 150 millis to read/write/delete the state.')
  .and('An action that changes the state.')
  .when('The action is dispatched twice.')
  .then('The second state is only persisted when the first one finishes.')
  .run(async (ctx) => {

    let persistor = new MyPersistorSlow();
    persistor.savedState = new State(123);

    let store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      persistor: persistor
    });

    // When the store is created:
    expect(store.state.count).toBe(1);
    expect(persistor.savedState.count).toBe(123);

    // We allow time for the persistor to read the persisted state.
    await delayMillis(600);
    expect(store.state.count).toBe(123);
    expect(persistor.savedState?.count).toBe(123);

    expect(persistor.record).toBe('' +
      'Creating persistor.' +
      'Persistor reading state: 123.' +
      'Finished reading state: 123.'
    );

    // Clear the recording.
    persistor.record = '';

    // Now we dispatch two actions that increment the state.
    store.dispatch(new Increment());
    store.dispatch(new Increment());

    // We allow time for both to end, and then check the recording.
    await delayMillis(600);
    expect(persistor.record).toBe('' +
      'Persisting difference: 123 → 124.' + // First persistence starts.
      'Finished persisting difference: 123 → 124.' +
      'Persisting difference: 124 → 125.' + // Second only starts after the first ends.
      'Finished persisting difference: 124 → 125.'
    );
  });

class State {
  constructor(readonly count: number) {
  }
}

class Increment extends ReduxAction<State> {

  reduce() {
    return new State(this.state.count + 1);
  }
}

export class MyPersistor extends Persistor<State> {

  constructor(
    public savedState: State | null = null
  ) {
    logger('Creating persistor');
    super();
  }

  async readState(): Promise<State | null> {
    logger('Persistor reading state: ' + this.savedState?.count);
    return this.savedState;
  }

  async saveInitialState(state: State) {
    logger('Persistor saving state: ' + this.savedState?.count);
    this.savedState = state;
  }

  async deleteState() {
    logger('Persistor deleting state');
    this.savedState = null;
  }

  async persistDifference(
    lastPersistedState: State | null,
    newState: State
  ) {
    logger('Persisting difference: ' + lastPersistedState?.count + ' → ' + newState.count);
    this.savedState = newState;
  }

  get throttle(): number | null {
    return null; // Throttle is off.
  }
}

export class MyPersistorSlow extends Persistor<State> {

  constructor(
    public savedState: State | null = null,
    public record = ''
  ) {
    super();
    this.record += 'Creating persistor.';
  }

  async readState(): Promise<State | null> {
    this.record += 'Persistor reading state: ' + this.savedState?.count + '.';
    await delayMillis(150);
    this.record += 'Finished reading state: ' + this.savedState?.count + '.';
    return this.savedState;
  }

  async saveInitialState(state: State) {
    this.record += 'Persistor saving state: ' + this.savedState?.count + '.';
    await delayMillis(150);
    this.record += 'Finished saving state: ' + this.savedState?.count + '.';
    this.savedState = state;
  }

  async deleteState() {
    this.record += 'Persistor deleting state.';
    await delayMillis(150);
    this.record += 'Persistor finished deleting state.';
    this.savedState = null;
  }

  async persistDifference(
    lastPersistedState: State | null,
    newState: State
  ) {
    this.record += 'Persisting difference: ' + lastPersistedState?.count + ' → ' + newState.count + '.';
    await delayMillis(150);
    this.record += 'Finished persisting difference: ' + lastPersistedState?.count + ' → ' + newState.count + '.';
    this.savedState = newState;
  }

  get throttle(): number | null {
    return null; // Throttle is off.
  }
}
