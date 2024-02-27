import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter, val } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { UserException } from '../src/AsyncRedux/UserException.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('State change and actions');
const logger = (obj: any) => process.stdout.write(obj + '\n');

test('Test fixture', async () => {
  expect(1).toBe(1); // No fixture.
});

Bdd(feature)
  .scenario('Action status when dispatching a SYNC action.')
  .given('A newly created action to change the state to [new state].')
  .when('The action is dispatched.')
  .and('The [before method throws error] or not')
  .and('The [reduce method throws error] or not')
  .then('The action [runs methods].')
  .and('The state is [result state].')
  .and('The action status indicates if errors where throw or not.')
  .and('The action status indicates the action has finished or not.')
  //
  // NO ERRORS
  .example(
    val('new state', null),
    val('result state', 123), // Returning null should not change the state.
    val('before method throws error', false),
    val('reduce method throws error', false),
    val('runs methods', 'before,reduce,after')
  )
  .example(
    val('new state', 123),
    val('result state', 123), // Returning the same state should not change the state.
    val('before method throws error', false),
    val('reduce method throws error', false),
    val('runs methods', 'before,reduce,after')
  )
  .example(
    val('new state', 456),
    val('result state', 456), // Should change the state.
    val('before method throws error', false),
    val('reduce method throws error', false),
    val('runs methods', 'before,reduce,after')
  )
  //
  // BEFORE THROWS ERRORS
  .example(
    val('new state', null),
    val('result state', 123), // Should NOT change the state because of error.
    val('before method throws error', true),
    val('reduce method throws error', false),
    val('runs methods', 'after')
  )
  .example(
    val('new state', 123),
    val('result state', 123), // Should NOT change the state because of error.
    val('before method throws error', true),
    val('reduce method throws error', false),
    val('runs methods', 'after')
  )
  .example(
    val('new state', 456), // should change the state.
    val('result state', 123), // Should NOT change the state because of error.
    val('before method throws error', true),
    val('reduce method throws error', false),
    val('runs methods', 'after')
  )
  //
  // REDUCER THROWS ERRORS
  .example(
    val('new state', null),
    val('result state', 123), // Should NOT change the state because of error.
    val('before method throws error', false),
    val('reduce method throws error', true),
    val('runs methods', 'before,after')
  )
  .example(
    val('new state', 123),
    val('result state', 123), // Should NOT change the state because of error.
    val('before method throws error', false),
    val('reduce method throws error', true),
    val('runs methods', 'before,after')
  )
  .example(
    val('new state', 456),
    val('result state', 123), // Should NOT change the state because of error.
    val('before method throws error', false),
    val('reduce method throws error', true),
    val('runs methods', 'before,after')
  )
  .run(async (ctx) => {

    // Read example values.
    const newState: number = ctx.example.val('new state');
    const resultState: number = ctx.example.val('result state');
    const beforeThrows: boolean = ctx.example.val('before method throws error');
    const reduceThrows: boolean = ctx.example.val('reduce method throws error');
    const runsMethods: string = ctx.example.val('runs methods');

    const store = new Store<number>({
      initialState: 123,
      logger: logger
    });

    let action
      = new RecordActionSyncNoErrors(newState, beforeThrows, reduceThrows);

    expect(action.isDispatched).toBeFalsy();
    expect(action.isFinished).toBeFalsy();

    expect(action.status.isDispatched).toBeFalsy();
    expect(action.status.hasFinishedMethodBefore).toBeFalsy();
    expect(action.status.hasFinishedMethodReduce).toBeFalsy();
    expect(action.status.hasFinishedMethodAfter).toBeFalsy();
    expect(action.status.hasError).toBeFalsy();

    await store.dispatchAndWait(action);
    expect(action.record).toBe(runsMethods);
    expect(store.state).toBe(resultState);

    expect(action.status.isDispatched).toBeTruthy();
    expect(action.status.hasFinishedMethodBefore).toBe(!beforeThrows);
    expect(action.status.hasFinishedMethodReduce).toBe(!beforeThrows && !reduceThrows);
    expect(action.status.hasFinishedMethodAfter).toBeTruthy();
    expect(action.status.hasError).toBe(beforeThrows || reduceThrows);

    expect(action.isDispatched).toBeTruthy();
    expect(action.isFinished).toBeTruthy();
    expect(action.isFinishedWithErrors).toBe(beforeThrows || reduceThrows);
    expect(action.isFinishedWithoutErrors).toBe(!beforeThrows && !reduceThrows);
  });

class RecordActionSyncNoErrors extends ReduxAction<number> {
  constructor(
    readonly newState: number | null,
    readonly beforeThrows: boolean,
    readonly reduceThrows: boolean
  ) {
    super();
  }

  record = '';

  before() {
    if (this.beforeThrows) throw new UserException('Before error');
    this.record += 'before,';
  }

  reduce() {
    if (this.reduceThrows) throw new UserException('Reducer error');
    this.record += 'reduce,';
    return this.newState;
  }

  after() {
    this.record += 'after';
  }
}
