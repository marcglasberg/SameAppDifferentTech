import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('Testing features');
const logger = (obj: any) => process.stdout.write(obj + '\n');

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('We can test the result of an action, by waiting until it finishes.')
  .given('A SYNC or ASYNC action.')
  .when('We dispatch and action and wait for it.')
  .then('We can expect the correct state change.')
  .run(async (_) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    await store.dispatchAndWait(new IncrementSync());
    expect(store.state.count).toBe(2);

    await store.dispatchAndWait(new IncrementAsync());
    expect(store.state.count).toBe(3);
  });

Bdd(feature)
  .scenario('We can test the result of multiple actions and async processes, by waiting until the state meets some condition.')
  .given('State starts equal to 1.')
  .and('An action dispatches async processes that last after that action finishes.')
  .and('At some point after the action finishes the state will be 42.')
  .when('We dispatch this action.')
  .then('We can wait for state to become 42.')
  .and('We can expect the correct state change.')
  .run(async (_) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    // Dispatch and wait doesn't wait for async processes that are dispatched after the action finishes.
    await store.dispatchAndWait(new StartAddingAsync());
    store.dispatch(new IncrementSync());
    store.dispatch(new IncrementAsync());

    // The only state change above was from the sync action. So the result went from 1 to 2.
    expect(store.state.count).toBe(2);

    // However, we now wait for the state to become 42, no matter how many async processes
    // are dispatched after the action finishes, or how long it takes to get there.
    let state = await store.waitCondition((state: State) => state.count === 42);

    expect(state.count).toBe(42);
    expect(store.state.count).toBe(42);
  });

Bdd(feature)
  .scenario('Test dispatching an action as soon as the state meets certain condition.')
  .given('State starts equal to 1.')
  .and('An action dispatches async processes that last after that action finishes.')
  .and('At some point after the action finishes the state will be 42.')
  .and('But we set up an action that reset the state to zero to dispatch as soon as the state is 42.')
  .when('We dispatch this action.')
  .then('When the state becomes 42, the reset action is dispatched.')
  .and('The state becomes zero.')
  .run(async (_) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    // We set up an action that reset the state to zero to dispatch as soon as the state is 42.
    store.dispatchWhen(new ResetSync(), (state: State) => state.count === 42);

    // Dispatch and wait doesn't wait for async processes that are dispatched after the action finishes.
    await store.dispatchAndWait(new StartAddingAsync());
    store.dispatch(new IncrementSync());
    store.dispatch(new IncrementAsync());

    // Wait for the state to become 42. It was 42 when the condition was reached.
    let state = await store.waitCondition((state: State) => state.count === 42);
    expect(state.count).toBe(42);

    // But it immediately became 0, because the reset action was dispatched.
    expect(store.state.count).toBe(0);
  });

Bdd(feature)
  .scenario('It is possible to record all state changes, dispatched actions and errors thrown by actions.')
  .given('State starts equal to 1.')
  .and('We asked the store to start recording.')
  .and('An action dispatches async processes that last after that action finishes.')
  .and('At some point after the action finishes the state will be 42.')
  .and('But we asked the store to start recording.')
  .when('We dispatch this action.')
  .then('When the state becomes 42.')
  .and('We have the record of everything that happened up until this point.')
  .run(async (_) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    store.record.start();

    // We set up an action that reset the state to zero to dispatch as soon as the state is 42.
    store.dispatchWhen(new ResetSync(), (state: State) => state.count === 42);

    // Dispatch and wait doesn't wait for async processes that are dispatched after the action finishes.
    await store.dispatchAndWait(new StartAddingAsync());
    store.dispatch(new IncrementSync());
    store.dispatch(new IncrementAsync());

    // Wait for the state to become 42.
    await store.waitCondition((state: State) => state.count === 42);

    // Stop recording.
    store.record.stop();

    // Check the record.
    expect(store.record.toString()).toBe('[\n' +
      '0. StartAddingAsync ini-1: State(1)\n' +
      '1. Add20Async ini-2: State(1)\n' +
      '2. StartAddingAsync end: State(1) → State(1)\n' +
      '3. IncrementSync ini-3: State(1)\n' +
      '4. IncrementSync end: State(1) → State(2)\n' +
      '5. IncrementAsync ini-4: State(2)\n' +
      '6. IncrementAsync end: State(2) → State(3)\n' +
      '7. Add19Sync ini-5: State(3)\n' +
      '8. Add19Sync end: State(3) → State(22)\n' +
      '9. Add20Async end: State(22) → State(42)\n' +
      '10. ResetSync ini-6: State(42)\n' +
      '11. ResetSync end: State(42) → State(0)\n' +
      ']');

    let result = store.record.result()[9];
    expect(result.action instanceof Add20Async).toBeTruthy();
    expect(result.prevState.count).toBe(22);
    expect(result.newState.count).toBe(42);
  });

class State {
  constructor(readonly count: number) {
  }

  toString() {
    return 'State(' + this.count + ')';
  }
}

class IncrementSync extends ReduxAction<State> {

  reduce() {
    return new State(this.state.count + 1);
  }
}

class IncrementAsync extends ReduxAction<State> {

  async reduce() {
    await delayMillis(50);
    return (state: State) => new State(this.state.count + 1);
  }
}

class StartAddingAsync extends ReduxAction<State> {

  async reduce() {
    await delayMillis(50);
    this.dispatch(new Add20Async());
    return null;
  }
}

class Add20Async extends ReduxAction<State> {

  async reduce() {
    await delayMillis(150);
    this.dispatch(new Add19Sync());
    return (state: State) => new State(this.state.count + 20);
  }
}

class Add19Sync extends ReduxAction<State> {

  reduce() {
    return new State(this.state.count + 19);
  }
}

class ResetSync extends ReduxAction<State> {

  reduce() {
    return new State(0);
  }
}
