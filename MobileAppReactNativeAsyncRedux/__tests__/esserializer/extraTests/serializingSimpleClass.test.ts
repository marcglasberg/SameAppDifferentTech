// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import { ESSerializer } from '../../../src/Esserializer';

test('Simple class', () => {
  let myClass = new MyClass(123, 'Lorem ipsum');
  let serialized = ESSerializer.serialize(myClass);
  let deserialized = ESSerializer.deserialize(serialized, [MyClass]);

  expect(serialized).toBe('{"' +
    'someNumber":123,' +
    '"someText":"Lorem ipsum",' +
    '"*type":"MyClass"' +
    '}');

  expect(deserialized instanceof MyClass).toBeTruthy();

  let myClassDeserialized = deserialized as MyClass;

  expect(myClassDeserialized.someNumber).toBe(123);
  expect(myClassDeserialized.someText).toBe('Lorem ipsum');
  expect(myClassDeserialized.toString()).toBe('MyClass{someNumber=123, someText=Lorem ipsum}');
  expect(myClassDeserialized.doubleNumber()).toBe(246);
  expect(myClassDeserialized.tripleNumberWithPrivateMethod()).toBe(369);
});

class MyClass {
  public someNumber: number;
  public someText: string;

  constructor(num: number, text: string) {
    this.someNumber = num;
    this.someText = text;
  }

  public doubleNumber(): number {
    return this.someNumber * 2;
  }

  public tripleNumberWithPrivateMethod(): number {
    return this._privateMethodToTripleNumber();
  }

  private _privateMethodToTripleNumber(): number {
    return this.someNumber * 3;
  }

  toString() {
    return 'MyClass{someNumber=' + this.someNumber + ', someText=' + this.someText + '}';
  }
}
