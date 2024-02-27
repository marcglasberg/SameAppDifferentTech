import { Action } from './action.ts';
import { Filter } from './Filter.ts';
import { State } from './State.ts';
import { UserException } from './AsyncRedux/UserException.ts';

/**
 * Add a random item to the list. The item is a random fact from the NumbersAPI.
 * If the item already exists, try again until it gets a new one (unlikely, but possible).
 * If the API fails, shows an error dialog to the user.
 */
export class AddRandomTodoAction extends Action {

  async reduce() {

    let text = await this.getTextFromTheNumbersAPI();

    return (state: State) => state
      .withTodos(this.state.todos.addTodoFromText(text))
      .withFilter(Filter.showActive, Filter.showAll);
  }

  private async getTextFromTheNumbersAPI() {

    let text: string;

    do {
      // Connect with the NumbersAPI to get a random fact.
      let response = await fetch('http://numbersapi.com/random/trivia');

      // If the connection failed, throw an exception.
      if (!response.ok) throw new UserException('Failed to connect to the NumbersAPI.');

      // Get the response text.
      text = await response.text();

      // If the response is empty, throw an exception.
      if (text === '') throw new UserException('Failed to get text from the NumbersAPI.');

    }
      // Repeat the process if the item already exists in the todos (unlikely, but possible).
    while (this.state.todos.ifExists(text));

    return text;
  }
}
