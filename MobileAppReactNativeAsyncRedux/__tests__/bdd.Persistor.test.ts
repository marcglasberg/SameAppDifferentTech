import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { AsyncReducer, ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';
import { UserException } from '../src/AsyncRedux/UserException.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('Persistor  ');
const logger = (obj: any) => {
  process.stdout.write(obj + '\n');
};

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('When the state changes, it is persisted.')
  .given('An action that changes the state.')
  .when('The action is dispatched.')
  .then('The new state is persisted.')
  .run(async (ctx) => {

    fail('Test not yet implemented');
  });

class State {
  constructor(readonly count: number) {
  }
}

class MethodBeforeThrowsSync extends ReduxAction<State> {

  before() {
    throw new UserException('Before sync!');
  }

  reduce() {
    return new State(this.state.count + 1);
  }
}

class MethodBeforeThrowsAsync extends ReduxAction<State> {

  async before() {
    await delayMillis(50);
    throw new UserException('Before async!');
  }

  reduce() {
    return new State(this.state.count + 1);
  }
}

class MethodReduceThrowsSync extends ReduxAction<State> {

  reduce(): State {
    throw new UserException('Reduce sync!');
  }
}

class MethodReduceThrowsAsync extends ReduxAction<State> {

  async reduce(): AsyncReducer<State> {
    await delayMillis(50);
    throw new UserException('Reduce async!');
  }
}

