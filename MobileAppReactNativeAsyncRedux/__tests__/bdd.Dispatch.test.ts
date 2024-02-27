import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('Dispatch');
const logger = (obj: any) => {
  process.stdout.write(obj + '\n');
};

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('Waiting for a dispatch to end.')
  .given('A SYNC or ASYNC action.')
  .when('The action is dispatched with `dispatchAndWait(action)`.')
  .then('It returns a `Promise` that resolves when the action finishes.')
  .run(async (ctx) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    expect(store.state.count).toBe(1);
    await store.dispatchAndWait(new IncrementSync());
    expect(store.state.count).toBe(2);

    await store.dispatchAndWait(new IncrementAsync());
    expect(store.state.count).toBe(3);
  });

Bdd(feature)
  .scenario('Knowing when some dispatched action is being processed.')
  .given('A SYNC or ASYNC action.')
  .when('The action is dispatched.')
  .then('We can check if the action is processing with `Store.isDispatching(action)`.')
  .run(async (ctx) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    // ---

    // SYNC ACTION: isDispatching is always false.

    expect(store.isDispatching(IncrementSync)).toBe(false);
    expect(store.state.count).toBe(1);

    let actionSync = new IncrementSync();
    expect(actionSync.status.isDispatched).toBe(false);

    let promise1 = store.dispatchAndWait(actionSync);
    expect(actionSync.status.isDispatched).toBe(true);

    expect(store.isDispatching(IncrementSync)).toBe(false);
    expect(store.state.count).toBe(2);

    await promise1; // Since it's SYNC, it's already finished when dispatched.

    expect(store.isDispatching(IncrementSync)).toBe(false);
    expect(store.state.count).toBe(2);

    // ---

    // ASYNC ACTION: isDispatching is true while we wait for it to finish.

    expect(store.isDispatching(IncrementAsync)).toBe(false);
    expect(store.state.count).toBe(2);

    let actionAsync = new IncrementAsync();
    expect(actionAsync.status.isDispatched).toBe(false);

    let promise2 = store.dispatchAndWait(actionAsync);
    expect(actionAsync.status.isDispatched).toBe(true);

    expect(store.isDispatching(IncrementAsync)).toBe(true); // True!
    expect(store.state.count).toBe(2);

    await promise2; // Since it's ASYNC, it really waits until it finishes.

    expect(store.isDispatching(IncrementAsync)).toBe(false);
    expect(store.state.count).toBe(3);
  });

class State {
  constructor(readonly count: number) {
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

