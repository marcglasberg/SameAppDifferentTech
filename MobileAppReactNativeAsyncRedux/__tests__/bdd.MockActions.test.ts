import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('Mock action');
const logger = (obj: any) => process.stdout.write(obj + '\n');

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('Mocking action.')
  .given('An original action.')
  .and('The action is mocked with a mock-action.')
  .when('The action is dispatched.')
  .then('The mock-action is dispatched instead.')
  .run(async (_) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    // Increment works, by adding 1: 1+1 = 2
    expect(store.state.count).toBe(1);
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(2);

    // Now we mock Increment with Add20, which will add 20: 2+20 = 22
    store.mocks.add(IncrementAction, (_) => new AddAction(20));
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(22);

    // Now we mock Increment with null, meaning the dispatch will be disabled: 22+0 = 23
    store.mocks.add(IncrementAction, (_) => null);
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(22);

    // Now we mock Increment with Add20 again, which will add 20: 22+20 = 42
    store.mocks.add(IncrementAction, (_) => new AddAction(20));
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(42);

    // We remove the mock with the `remove()` method, so Increment works again: 42+1 = 43
    store.mocks.remove(IncrementAction);
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(43);

    // Now we mock Increment with Add20 again, which will add 20:
    store.mocks.add(IncrementAction, (_) => new AddAction(20));
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(63);

    // We remove all mocks with the `clear()` method, so Increment works again: 63+1 = 64
    store.mocks.clear();
    store.dispatch(new IncrementAction());
    expect(store.state.count).toBe(64);

    // We can mock an action with itself. It works and won't create any loops.
    store.mocks.add(AddAction, (_) => new AddAction(1000));
    store.dispatch(new AddAction(20));
    expect(store.state.count).toBe(1064);
  });

Bdd(feature)
  .scenario('Mock action may use the original action.')
  .given('An original action.')
  .and('The action is mocked by an action that user the original action.')
  .when('The action is dispatched.')
  .then('The mock-action has access to the original action, to access its fields.')
  .run(async (_) => {

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger
    });

    // This is a mock action that subtracts the value from the original action, instead of adding
    // it. It's an example of a mock action that uses the original action.
    store.mocks.add(AddAction, (action) => new SubtractAction(action));

    // It will subtract 20 from the original action, instead of adding it.
    store.dispatch(new AddAction(20));
    expect(store.state.count).toBe(-19);

    // It will subtract 5 from the original action, instead of adding it.
    store.dispatch(new AddAction(5));
    expect(store.state.count).toBe(-24);

    // Now it will add double the value. Note we mock an action with the same action.
    store.mocks.add(AddAction, (action) => new AddAction(action.valueToAdd * 2));
    store.dispatch(new AddAction(100));
    expect(store.state.count).toBe(200 - 24);
  });

class State {
  constructor(readonly count: number) {
  }
}

class IncrementAction extends ReduxAction<State> {

  reduce() {
    return new State(this.state.count + 1);
  }
}

class AddAction extends ReduxAction<State> {
  constructor(public valueToAdd: number) {
    super();
  }

  reduce() {
    return new State(this.state.count + this.valueToAdd);
  }
}

/**
 * This is a mock action that subtracts the value from the original action, instead of adding it.
 * It's an example of a mock action that uses the original action.
 */
class SubtractAction extends ReduxAction<State> {

  constructor(public mockedAction: AddAction) {
    super();
  }

  reduce() {
    return new State(this.state.count - this.mockedAction.valueToAdd);
  }
}
