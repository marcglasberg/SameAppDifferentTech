// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import { ESSerializer } from '../../../src/Esserializer';
import { TodoItem, Todos } from '../../../src/Todos.ts';

test('Todos class', () => {

  let todo1 = new TodoItem('First', false);
  let todo2 = new TodoItem('Second', false);
  let todo3 = new TodoItem('Third', true);
  let todos = new Todos([todo1, todo2, todo3]);

  ESSerializer.registerClasses([Todos, TodoItem]);

  let serialized = ESSerializer.serialize(todos);
  let deserialized = ESSerializer.deserialize(serialized);

  expect(serialized).toBe('{' +
    '"items":[' +
    '{"text":"First","completed":false,"*type":"TodoItem"},' +
    '{"text":"Second","completed":false,"*type":"TodoItem"},' +
    '{"text":"Third","completed":true,"*type":"TodoItem"}],' +
    '"*type":"Todos"' +
    '}');

  expect(deserialized instanceof Todos).toBeTruthy();

  let todosDeserialized = deserialized as Todos;

  expect(Array.isArray(todosDeserialized.items)).toBeTruthy();

  expect(todosDeserialized.items.toString())
    .toBe('' +
      'TodoItem{text=First, completed=false},' +
      'TodoItem{text=Second, completed=false},' +
      'TodoItem{text=Third, completed=true}');

  expect(todosDeserialized.ifExists('Second')).toBeTruthy();
  expect(todosDeserialized.ifExists('xxx')).toBeFalsy();
});

