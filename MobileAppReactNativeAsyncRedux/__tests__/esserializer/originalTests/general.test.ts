// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import {
  getValueFromToStringResult,
  isClass,
  notObject
} from '../../../src/Esserializer/general.ts';
import ClassA from './fixture/ClassA.ts';

describe('Test getValueFromToStringResult', () => {
  test('can get Infinity as expected', () => {
    expect(getValueFromToStringResult('Infinity')).toBe(Infinity);
  });

  test('can get -Infinity as expected', () => {
    expect(getValueFromToStringResult('-Infinity')).toBe(-Infinity);
  });

  test('can get NaN as expected', () => {
    expect(getValueFromToStringResult('NaN')).toBe(NaN);
  });

  test('can get null as expected', () => {
    expect(getValueFromToStringResult('unexpected')).toBe(null);
  });
});

describe('Test notObject', () => {
  test('null is not object', () => {
    expect(notObject(null)).toBe(true);
  });

  test('number is not object', () => {
    expect(notObject(42)).toBe(true);
  });

  test('boolean is not object', () => {
    expect(notObject(false)).toBe(true);
  });

  test('undefined is not object', () => {
    expect(notObject(undefined)).toBe(true);
  });

  test('string is not object', () => {
    expect(notObject('TEXT')).toBe(true);
  });

  test('object is object', () => {
    expect(notObject({ name: 'Mike' })).toBe(false);
  });
});

describe('Test isClass', () => {
  test('builtin class is class', () => {
    expect(isClass(Date)).toBe(true);
  });

  test('imported class variable is class', () => {
    expect(isClass(ClassA)).toBe(true);
  });

  test('plain object is not class', () => {

    let target = { name: 'Mike' };

    expect(isClass(target)).toBe(false);
  });

  test('plain function is not class', () => {

    let target1 = (x: any, y: any) => {
      return x + y;
    };

    expect(isClass(target1)).toBe(false);
  });
});
