import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';
import { UserException } from '../src/AsyncRedux/UserException.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('StateObserver');
const logger = (obj: any) => {
  process.stdout.write(obj + '\n');
};

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('StateObserver is called when the state changes.')
  .given('SYNC and ASYNC actions.')
  .when('The the actions are dispatched.')
  .then('The SYNC action starts and finishes at once.')
  .and('The ASYNC action first starts, and then finishes after the async gap.')
  .run(async (ctx) => {

    let result = '';

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      stateObserver: (action: ReduxAction<State>, prevState: State, newState: State, error: any, dispatchCount: number) => {
        result += 'action: "' + action.toString() + '", ' +
          'prevState: ' + prevState + ', ' +
          'newState: ' + newState + ', ' +
          'error: ' + error + ', ' +
          'dispatchCount: ' + dispatchCount +
          '|';
      }
    });

    // SYNC then ASYNC.

    store.dispatch(new IncrementSync());
    await store.dispatchAndWait(new IncrementAsync());

    expect(result).toBe('' +
      'action: "IncrementSync()", prevState: State(1), newState: State(2), error: null, dispatchCount: 0' +
      '|' +
      'action: "IncrementAsync()", prevState: State(2), newState: State(3), error: null, dispatchCount: 0' +
      '|'
    );

    // ASYNC then SYNC.

    result = '';

    let promise = store.dispatchAndWait(new IncrementAsync());
    store.dispatch(new IncrementSync());
    await promise;

    expect(result).toBe('' +
      'action: "IncrementSync()", prevState: State(3), newState: State(4), error: null, dispatchCount: 0' +
      '|' +
      'action: "IncrementAsync()", prevState: State(4), newState: State(5), error: null, dispatchCount: 0' +
      '|'
    );
  });

Bdd(feature)
  .scenario('StateObserver when actions throw errors.')
  .given('SYNC and ASYNC actions that throw errors.')
  .when('The the actions are dispatched.')
  .then('The SYNC action starts and finishes at once.')
  .and('The ASYNC action first starts, and then finishes after the async gap.')
  .run(async (ctx) => {

    let result = '';

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      stateObserver: (action: ReduxAction<State>, prevState: State, newState: State, error: any, dispatchCount: number) => {
        result += 'action: "' + action.toString() + '", ' +
          'prevState: ' + prevState + ', ' +
          'newState: ' + newState + ', ' +
          'error: ' + error + ', ' +
          'dispatchCount: ' + dispatchCount +
          '|';
      }
    });

    // SYNC then ASYNC.

    store.dispatch(new IncrementSyncWithError());
    await store.dispatchAndWait(new IncrementAsyncWithError());

    expect(result).toBe('' +
      'action: "IncrementSyncWithError()", prevState: State(1), newState: State(1), error: UserException: Error in before., dispatchCount: 0' +
      '|' +
      'action: "IncrementAsyncWithError()", prevState: State(1), newState: State(1), error: UserException: Error in before., dispatchCount: 0' +
      '|'
    );

    // ASYNC then SYNC.

    result = '';

    let promise = store.dispatchAndWait(new IncrementAsyncWithError());
    store.dispatch(new IncrementSyncWithError());
    await promise;

    expect(result).toBe('' +
      'action: "IncrementSyncWithError()", prevState: State(1), newState: State(1), error: UserException: Error in before., dispatchCount: 0' +
      '|' +
      'action: "IncrementAsyncWithError()", prevState: State(1), newState: State(1), error: UserException: Error in before., dispatchCount: 0' +
      '|'
    );
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

class IncrementSyncWithError extends ReduxAction<State> {

  before() {
    throw new UserException('Error in before.');
  }

  reduce() {
    return new State(this.state.count + 1);
  }
}

class IncrementAsyncWithError extends ReduxAction<State> {

  async before() {
    await delayMillis(50);
    throw new UserException('Error in before.');
  }

  reduce() {
    return new State(this.state.count + 1);
  }
}

