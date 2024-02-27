import 'react-native';
import { expect } from '@jest/globals';
import { Bdd, Feature, FeatureFileReporter, reporter } from 'easy-bdd-tool-jest';
import { Store } from '../src/AsyncRedux/Store.tsx';
import { AsyncReducer, ReduxAction } from '../src/AsyncRedux/ReduxAction.ts';
import { delayMillis } from '../src/utils/utils.ts';
import { UserException } from '../src/AsyncRedux/UserException.ts';

reporter(new FeatureFileReporter());

const feature = new Feature('UserException');
const logger = (obj: any) => process.stdout.write(obj + '\n');

test('Test fixture', async () => {
  expect(new State(1).count).toBe(1);
});

Bdd(feature)
  .scenario('Showing a dialog (or other UI) when an action throws a UserException.')
  .given('A SYNC or ASYNC action.')
  .when('The `before` or `reduce` methods throw a UserException.')
  .then('Function `showUserException` is called.')
  .run(async (_) => {

    let result = '';

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      showUserException: (exception: UserException, count: number, next: () => void) => {
        result += 'msg: "' + exception.message + '", count: ' + count + '|';
        next();
      }
    });

    store.dispatch(new MethodBeforeThrowsSync());
    store.dispatch(new MethodReduceThrowsSync());
    await store.dispatchAndWait(new MethodBeforeThrowsAsync());
    await store.dispatchAndWait(new MethodReduceThrowsAsync());

    expect(result).toBe('' +
      'msg: "Before sync!", count: 0|' +
      'msg: "Reduce sync!", count: 0|' +
      'msg: "Before async!", count: 0|' +
      'msg: "Reduce async!", count: 0|'
    );
  });

Bdd(feature)
  .scenario('When more than one UserException is thrown.')
  .given('SYNC or ASYNC actions that throw errors.')
  .when('Multiple UserExceptions are thrown.')
  .then('Function `showUserException` is initially called only once.')
  .and('When `next` is called and there are more errors, then it calls `showUserException` again.')
  .run(async (_) => {

    let result = '';

    let _next: () => void = () => {
    };

    const store = new Store<State>({
      initialState: new State(1),
      logger: logger,
      showUserException: (exception: UserException, count: number, next: () => void) => {
        result += 'msg: "' + exception.message + '", count: ' + count + '|';
        _next = next;
      }
    });

    store.dispatch(new MethodBeforeThrowsSync());
    store.dispatch(new MethodReduceThrowsSync());
    await store.dispatchAndWait(new MethodBeforeThrowsAsync());
    await store.dispatchAndWait(new MethodReduceThrowsAsync());

    // First time it's called there is only one error, which is removed from
    // the queue and shown. So, count is 0.
    expect(result).toBe('msg: "Before sync!", count: 0|'
    );

    // Second time it's called the first error is past.
    // The second error is removed from the queue and shown.
    // At this point, there are other 2 errors already in the queue.
    _next();
    expect(result).toBe('' +
      'msg: "Before sync!", count: 0|' +
      'msg: "Reduce sync!", count: 2|'
    );

    // Third time it's called the first and second errors are past.
    // The third error is removed from the queue and shown.
    // At this point, there is another 1 error still in the queue.
    _next();
    expect(result).toBe('' +
      'msg: "Before sync!", count: 0|' +
      'msg: "Reduce sync!", count: 2|' +
      'msg: "Before async!", count: 1|'
    );

    // Fourth time it's called the first, second and third errors are past.
    // The fourth error is removed from the queue and shown.
    // At this point, there are no more errors in the queue.
    _next();
    expect(result).toBe('' +
      'msg: "Before sync!", count: 0|' +
      'msg: "Reduce sync!", count: 2|' +
      'msg: "Before async!", count: 1|' +
      'msg: "Reduce async!", count: 0|'
    );
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

