import { Todos } from './todos.ts';
import { Filter } from './filter.ts';

export class State {

  readonly todos: Todos;
  readonly filter: Filter;

  static initialState: State =
    new State({
      todos: Todos.empty,
      filter: Filter.showAll
    });

  constructor({ todos, filter }: { todos: Todos, filter: Filter }) {

    this.todos = todos;
    this.filter = filter;
  }

  copy({ todos, filter }: {
    todos?: Todos,
    filter?: Filter
  } = {}): State {
    return new State({
      todos: todos || this.todos,
      filter: filter || this.filter
    });
  }

  withTodos(todos: Todos): State {
    return this.copy({ todos: todos });
  }

  withFilter(filter: Filter): State {
    return this.copy({ filter: filter });
  }
}
