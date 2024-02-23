import { Action } from './action.ts';
import { RemoveTodoAction } from './RemoveTodoAction.ts';
import { SetFilterAction } from './NextFilterAction.ts';
import { Filter } from './Filter.ts';
import { delayMillis } from './utils/utils.ts';

/**
 * Remove all completed items. Waits 300 milliseconds for each item removed,
 * just to visually animate it to the user.
 *
 * Note: If necessary, we set the filter so that the completed items are visible.
 * After all completed items are removed, we return the filter to its previous state.
 */
export class RemoveCompletedTodosAction extends Action {

  async reducer() {

    // If there are no completed items, do nothing.
    if (this.state.todos.isEmpty(Filter.showCompleted)) return null;

    else {

      const currentFilter = this.state.filter;

      // Sets the filter to make the completed items visible.
      if (currentFilter == Filter.showActive) {
        this.dispatch(new SetFilterAction(Filter.showCompleted));
        await delayMillis(500);
      }

      // For each completed item, wait for 250 milliseconds and remove it, one by one.
      for (let todo of this.state.todos) {
        if (todo.completed) {
          this.dispatch(new RemoveTodoAction(todo));

          // If there are still completed items to delete, wait for 250 milliseconds.
          if (!(this.state.todos.isEmpty(Filter.showCompleted)))
            await delayMillis(250);
        }
      }

      // Return the filter to its previous state.
      this.dispatch(new SetFilterAction(currentFilter));

      return null;
    }
  }
}
