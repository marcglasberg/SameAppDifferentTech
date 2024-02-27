import { State } from './State.ts';
import { Action } from './action.ts';
import { Filter } from './Filter.ts';

export class NextFilterAction extends Action {

  reduce() {

    let newFilter = this.state.filter;

    switch (newFilter) {
      case Filter.showActive:
        newFilter = Filter.showCompleted;
        break;
      case Filter.showCompleted:
        newFilter = Filter.showAll;
        break;
      case Filter.showAll:
        newFilter = Filter.showActive;
        break;
      default:
        throw new Error('Unknown filter: ' + newFilter);
    }

    return this.state.withFilter(newFilter);
  }
}

export class SetFilterAction extends Action {

  constructor(readonly newFilter: Filter) {
    super();
  }

  reduce() {
    return this.state.withFilter(this.newFilter);
  }
}
