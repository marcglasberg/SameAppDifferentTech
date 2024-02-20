import { State } from './state.ts';
import { Action } from './action.ts';
import { UserException } from './AsyncRedux/UserException';

export class AddTodoAction extends Action {

  constructor(readonly text: string) {
    super();
  }

  reducer(): State {

    if (this.state.todos.ifExists(this.text)) {
      throw new UserException('The item already exists.');
    }

    let newTodos = this.state.todos.addTodoFromText(this.text);
    return this.state.withTodos(newTodos);
  }
}
