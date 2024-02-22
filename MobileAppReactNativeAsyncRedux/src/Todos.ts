import { Filter } from './Filter.ts';

export class TodoItem {
  constructor(
    public text: string,
    public completed: boolean = false) {
  }

  // Returns a new item with the same text, but with the opposite completed status.
  toggleCompleted() {
    return new TodoItem(this.text, !this.completed);
  }

  showsWhenFilterIs(filter: Filter) {
    switch (filter) {
      case Filter.showCompleted:
        return this.completed;
      case Filter.showActive:
        return !this.completed;
      case Filter.showAll:
      default:
        return true;
    }
  }

  toString() {
    return `TodoItem{text=${this.text}, completed=${this.completed}}`;
  }
}

export class Todos {

  // The list of items.
  readonly items: TodoItem[];

  static empty: Todos = new Todos();

  constructor(items?: TodoItem[]) {
    this.items = items ?? [];
  }

  addTodoFromText(text: string): Todos {
    const trimmedText = text.trim();
    const capitalizedText = trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
    return this.addTodo(new TodoItem(capitalizedText));
  }

  // If the item already exists, don't add it again.
  // Otherwise, add it to the top of the list.
  // If the text of the item is empty, don't add it.
  addTodo(newItem: TodoItem): Todos {
    if ((newItem.text === '') || this.ifExists(newItem.text))
      return this;
    else
      return new Todos([newItem, ...this.items]);
  }

  // Returns true if the given text is already in the list.
  ifExists(text: string): boolean {
    return this.items.some(todo => todo.text === text);
  }

  // Remove the given item from the list.
  removeTodo(item: TodoItem): Todos {
    return new Todos(this.items.filter(todo => todo !== item));
  }

  // Toggle the completed status of the given item.
  toggleTodo(item: TodoItem): Todos {
    const newTodos = this.items.map(itemInList =>
      (itemInList === item) ? item.toggleCompleted() : itemInList
    );
    return new Todos(newTodos);
  }

  // Count the number of todos that appear when the given filter is applied.
  // If no filter is given, count all todos.
  count(filter?: Filter) {
    return this.items.filter(item => item.showsWhenFilterIs(filter ?? Filter.showAll)).length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  * [Symbol.iterator]() {
    for (let i = 0; i < this.items.length; i++) {
      yield this.items[i];
    }
  }

  toString() {
    return `Todos{${this.items.join(',')}}`;
  }


}
