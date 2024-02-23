import { Action } from './action.ts';
import { UserException } from './AsyncRedux/UserException';
import { Filter } from './Filter.ts';

export class AddTodoAction extends Action {

  constructor(readonly text: string) {
    super();
  }

  reducer() {

    if (this.state.todos.ifExists(this.text)) {
      throw new UserException('The item already exists.');
    }

    let newTodos = this.state.todos.addTodoFromText(this.text);

    return this.state
      .withTodos(newTodos)
      .withFilter(Filter.showActive, Filter.showAll);
  }
}
