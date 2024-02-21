import { State } from './State.ts';
import { Action } from './action.ts';
import { RemoveTodoAction } from './RemoveTodoAction.ts';

export class RemoveAllTodosAction extends Action {

  async reducer(): Promise<State | null> {

    // For each item, waits for 350 milliseconds and remove it, one by one.
    for (let todo of this.state.todos) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      this.dispatch(new RemoveTodoAction(todo));
    }

    return null;
  }
}
