import { Todos } from './Todos.ts';
import { Filter } from './Filter.ts';

export class State {

  readonly todos: Todos;
  readonly filter: Filter;

  static initialState: State =
    new State({ todos: Todos.empty, filter: Filter.showAll });

  constructor({ todos, filter }: { todos: Todos, filter: Filter }) {
    this.todos = todos;
    this.filter = filter;
  }

  withTodos(todos: Todos): State {
    return new State({ todos: todos || this.todos, filter: this.filter });
  }

  /**
   * You can pass one or two filters here.
   * If the current filter in the state is already on one of those filters, keeps the
   * state unaltered. Otherwise, change the state to the first filter listed here:
   *
   * ```
   * // If the current filter is Filter.showCompleted, nothing changes.
   * // Otherwise, changes the filter to Filter.showCompleted.
   * state.withFilter(Filter.showCompleted);
   *
   * // If the current filter is Filter.showAll or Filter.showActive, nothing changes.
   * // Otherwise, changes the filter to Filter.showAll.
   * state.withFilter(Filter.showAll, Filter.showActive)
   * ```
   */
  withFilter(filter1: Filter, filter2?: Filter): State {
    if ((this.filter != filter1) && (this.filter != filter2))
      return new State({ todos: this.todos, filter: filter1 });
    else return this;
  }

  hasTodos(): boolean {
    return !this.todos.isEmpty();
  }

  toString() {
    return `State{todos=${this.todos}, filter=${this.filter}}`;
  }
}
