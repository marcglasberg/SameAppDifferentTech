import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('State change and actions');
const logger = (obj: any) => {
  process.stdout.write(obj + '\n');
};

test('Test fixture', async () => {
  expect(1).toBe(1); // No fixture.
});

Bdd(feature)
  .scenario('Action status when dispatching a SYNC action that doesnt change the state.')
  .given('A newly created action.')
  .when('The action is dispatched.')
  .and('Its reducer returns null.')
  .and('Finishes without errors.')
  .then('The action status evolves to record methods before, reduce, after.')
  .and('If errors where throw.')
  .and('If the action has finished or not, with errors or not.')
  .run(async (ctx) => {

    const store = new Store<number>({
      initialState: 123,
      logger: logger
    });

    let action = new RecordActionSyncNoErrors(null);
    expect(action.isDispatched).toBeFalsy();
    expect(action.isFinished).toBeFalsy();
    expect(action.status.hasError).toBeFalsy();

    await store.dispatchAndWait(action);
    expect(action.record).toBe('|before||reducer||after|');
    expect(store.state).toBe(123);

    expect(action.isDispatched).toBeTruthy();
    expect(action.isFinished).toBeTruthy();
    expect(action.isFinishedWithErrors).toBeFalsy();
    expect(action.isFinishedWithoutErrors).toBeTruthy();
  });

Bdd(feature)
  .scenario('Action status when dispatching a SYNC action that changes the state.')
  .given('A newly created action.')
  .when('The action is dispatched.')
  .and('Its reducer returns null.')
  .and('Finishes without errors.')
  .then('The action status evolves to record methods before, reduce, after.')
  .and('If errors where throw.')
  .and('If the action has finished or not, with errors or not.')
  .run(async (ctx) => {

    const store = new Store<number>({
      initialState: 123,
      logger: logger
    });

    let action = new RecordActionSyncNoErrors(456);
    expect(action.isDispatched).toBeFalsy();
    expect(action.isFinished).toBeFalsy();
    expect(action.status.hasError).toBeFalsy();

    await store.dispatchAndWait(action);
    expect(action.record).toBe('|before||reducer||after|');
    expect(store.state).toBe(456);

    expect(action.isDispatched).toBeTruthy();
    expect(action.isFinished).toBeTruthy();
    expect(action.isFinishedWithErrors).toBeFalsy();
    expect(action.isFinishedWithoutErrors).toBeTruthy();
  });

class RecordActionSyncNoErrors extends ReduxAction<number> {
  constructor(readonly result: number | null) {
    super();
  }

  record = '';

  before() {
    this.record += '|before|';
  }

  reducer() {
    this.record += '|reducer|';
    return this.result;
  }

  after() {
    this.record += '|after|';
  }
}
