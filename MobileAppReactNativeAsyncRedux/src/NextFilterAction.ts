import { State } from './State.ts';
import { Action } from './action.ts';
import { Filter } from './Filter.ts';

export class NextFilterAction extends Action {

  reducer(): State {

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

  constructor(private newFilter: Filter) {
    super();
  }

  reducer(): State {
    return this.state.withFilter(this.newFilter);
  }
}
