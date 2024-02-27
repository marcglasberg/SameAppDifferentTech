// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import { ESSerializer } from '../../../src/Esserializer';
import { TodoItem, Todos } from '../../../src/Todos.ts';
import { Filter } from '../../../src/Filter.ts';
import { State } from '../../../src/State.ts';

test('State class', () => {

  let todo1 = new TodoItem('First', false);
  let todo2 = new TodoItem('Second', false);
  let todo3 = new TodoItem('Third', true);
  let todos = new Todos([todo1, todo2, todo3]);
  let filter = Filter.showActive;

  let state = new State({ todos, filter });

  ESSerializer.registerClasses([State, Todos, TodoItem, Filter]);

  let serialized = ESSerializer.serialize(state);
  let deserialized = ESSerializer.deserialize(serialized);

  expect(serialized).toBe('' +
    '{' +
    '"todos":' +
    /*  */'{' +
    /*  */'"items":' +
    /*      */'[' +
    /*      */'{"text":"First","completed":false,"*type":"TodoItem"},' +
    /*      */'{"text":"Second","completed":false,"*type":"TodoItem"},' +
    /*      */'{"text":"Third","completed":true,"*type":"TodoItem"}' +
    /*      */'],' +
    /*  */'"*type":"Todos"' +
    /*  */'},' +
    '"filter":"Showing ACTIVE",' +
    '"*type":"State"' +
    '}');

  expect(deserialized instanceof State).toBeTruthy();

  let stateDeserialized = deserialized as State;

  expect(stateDeserialized.toString())
    .toBe('' +
      'State{' +
      'todos=Todos{TodoItem{text=First, completed=false},TodoItem{text=Second, completed=false},TodoItem{text=Third, completed=true}}, ' +
      'filter=Showing ACTIVE' +
      '}');

  expect(stateDeserialized.hasTodos()).toBeTruthy();

  let deserializedTodos = stateDeserialized.todos;

  expect(deserializedTodos.isEmpty()).toBeFalsy();
  expect(deserializedTodos.ifExists('xxx')).toBeFalsy();
  expect(deserializedTodos.ifExists('Second')).toBeTruthy();
});

