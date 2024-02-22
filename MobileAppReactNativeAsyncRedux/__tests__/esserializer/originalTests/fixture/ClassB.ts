// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import ClassC from './ClassC.ts';

class ClassB {
  private _hobby: string | null;
  public toy: ClassC;

  constructor() {
    this._hobby = null;
    this.toy = new ClassC();
  }

  get hobby(): string | null {
    return this._hobby;
  }

  set hobby(value: string | null) {
    this._hobby = value;
  }
}

export default ClassB;
