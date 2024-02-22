// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import SuperClassA from './SuperClassA.ts';

class ClassA extends SuperClassA {
  private _name: string | null;
  public age: number;

  constructor() {
    super();
    this._name = null;
    this.age = 28;
  }

  get name(): string | null {
    return this._name;
  }

  set name(value: string | null) {
    this._name = value;
  }

  static sayHello() {
    console.log('Hello');
  }

  getAge() {
    return this.age;
  }
}

export default ClassA;
