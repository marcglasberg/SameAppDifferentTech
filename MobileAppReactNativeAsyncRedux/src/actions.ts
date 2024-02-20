import { ReduxAction } from './AsyncRedux/reduxAction.ts';
import { State } from './state.ts';
import { TodoItem } from './todos.ts';

export abstract class Action extends ReduxAction<State> {
}

export class AddTodoAction extends Action {

  constructor(readonly text: string) {
    super();
  }

  reducer(): State {
    let newTodos = this.state.todos.addTodoFromText(this.text);
    return this.state.withTodos(newTodos);
  }
}

export class RemoveTodoAction extends Action {

  constructor(readonly item: TodoItem) {
    super();
  }

  reducer(): State {
    let newTodos = this.state.todos.removeTodo(this.item);
    return this.state.withTodos(newTodos);
  }
}

export class ToggleTodoAction extends Action {

  constructor(readonly item: TodoItem) {
    super();
  }

  reducer(): State {
    let newTodos = this.state.todos.toggleTodo(this.item);
    return this.state.withTodos(newTodos);
  }
}

