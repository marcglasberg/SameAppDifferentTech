import { TodoItem } from './Todos.ts';
import { State } from './State.ts';
import { Action } from './action.ts';

export class RemoveTodoAction extends Action {

  constructor(readonly item: TodoItem) {
    super();
  }

  reducer(): State {
    let newTodos = this.state.todos.removeTodo(this.item);
    return this.state.withTodos(newTodos);
  }
}