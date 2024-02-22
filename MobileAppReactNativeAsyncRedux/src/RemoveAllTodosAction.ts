import { State } from './State.ts';
import { Action } from './action.ts';
import { RemoveTodoAction } from './RemoveTodoAction.ts';
import { SetFilterAction } from './NextFilterAction.ts';
import { Filter } from './Filter.ts';

export class RemoveAllTodosAction extends Action {

  async reducer(): Promise<State | null> {

    // When there is more than 1 todo, show them all, just so we can see their removal.
    if (this.state.todos.count() > 1) this.dispatch(new SetFilterAction(Filter.showAll));

    // For each item, waits for 300 milliseconds and remove it, one by one.
    for (let todo of this.state.todos) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.dispatch(new RemoveTodoAction(todo));
    }

    return null;
  }
}
