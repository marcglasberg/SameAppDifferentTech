import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('ActionObserver');
const logger = (obj: any) => {
  process.stdout.write(obj + '\n');
};

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('ActionObserver is called when actions are dispatched.')
  .given('SYNC and ASYNC actions.')
  .when('The the actions are dispatched.')
  .then('The SYNC action starts and finishes at once.')
  .and('The ASYNC action first starts, and then finishes after the async gap.')
  .run(async (ctx) => {

    let result = '';

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      actionObserver: (action: ReduxAction<State>, dispatchCount: number, ini: boolean) => {
        result += 'action: "' + action.toString() + '", ' +
          'dispatchCount: ' + dispatchCount + ', ' +
          (ini ? 'ini' : 'end') +
          '|';
      }
    });

    // SYNC then ASYNC.

    store.dispatch(new IncrementSync());
    await store.dispatchAndWait(new IncrementAsync());

    expect(result).toBe('' +
      'action: "IncrementSync()", dispatchCount: 0, ini' +
      '|' +
      'action: "IncrementSync()", dispatchCount: 0, end' +
      '|' +
      'action: "IncrementAsync()", dispatchCount: 0, ini' +
      '|' +
      'action: "IncrementAsync()", dispatchCount: 0, end' +
      '|'
    );

    // ASYNC then SYNC.

    result = '';

    let promise = store.dispatchAndWait(new IncrementAsync());
    store.dispatch(new IncrementSync());
    await promise;

    expect(result).toBe('' +
      'action: "IncrementAsync()", dispatchCount: 0, ini' +
      '|' +
      'action: "IncrementSync()", dispatchCount: 0, ini' +
      '|' +
      'action: "IncrementSync()", dispatchCount: 0, end' +
      '|' +
      'action: "IncrementAsync()", dispatchCount: 0, end' +
      '|'
    );
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

