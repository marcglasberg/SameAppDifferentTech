import { State } from './State.ts';
import { Action } from './action.ts';
import { UserException } from './AsyncRedux/UserException';
import { Filter } from './Filter.ts';

export class AddTodoAction extends Action {

  constructor(readonly text: string) {
    super();
  }

  reducer(): State {

    if (this.state.todos.ifExists(this.text)) {
      throw new UserException('The item already exists.');
    }

    let newTodos = this.state.todos.addTodoFromText(this.text);

    // If the filter won't show the added item, change the filter.
    let newFilter = this.state.filter;
    if (newFilter == Filter.showCompleted) newFilter = Filter.showActive;

    return this.state
      .withTodos(newTodos)
      .withFilter(newFilter);
  }
}
