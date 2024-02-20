import { State } from './state.ts';
import { TodoItem } from './todos.ts';
import { Action } from './action.ts';

export class ToggleTodoAction extends Action {

  constructor(readonly item: TodoItem) {
    super();
  }

  reducer(): State {
    let newTodos = this.state.todos.toggleTodo(this.item);
    return this.state.withTodos(newTodos);
  }
}

