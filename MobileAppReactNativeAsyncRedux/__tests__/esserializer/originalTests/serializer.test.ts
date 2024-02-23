// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import ClassA from './fixture/ClassA.ts';
import { getSerializeValueWithClassName } from '../../../src/Esserializer/serializer.ts';

describe('Test getSerializeValueWithClassName', () => {
  test('return special object for undefined', () => {
    expect(getSerializeValueWithClassName(undefined)).toStrictEqual({ '*type': 'UD' });
  });

  test('return target as it is when it\'s not an object', () => {
    expect(getSerializeValueWithClassName(null)).toBeNull();
    expect(getSerializeValueWithClassName('TEXT')).toBe('TEXT');
  });

  test('return simple array as it is if its member is not object', () => {
    expect(getSerializeValueWithClassName([42, 88])).toStrictEqual([42, 88]);
  });

  test('return array with its member serialized', () => {
    const classAInstance = new ClassA();
    classAInstance.name = 'Tea';
    const arrayToBeSerialized = [classAInstance, 42, 'Leaf'];
    const serializeValueExpected = [{
      _name: 'Tea',
      _size: 0,
      age: 28,
      '*type': 'ClassA'
    }, 42, 'Leaf'];
    expect(getSerializeValueWithClassName(arrayToBeSerialized)).toStrictEqual(serializeValueExpected);
  });

  test('can serialize all fields of object', () => {
    const classAInstance = new ClassA();
    classAInstance.name = 'SmallTiger';
    const objectToBeSerialized = {
      name: 'Tiger',
      age: 42,
      sad: null,
      hate: undefined,
      live: true,
      son: classAInstance
    };
    const serializeValueExpected = {
      name: 'Tiger',
      age: 42,
      sad: null,
      hate: { '*type': 'UD' },
      live: true,
      son: {
        _name: 'SmallTiger',
        _size: 0,
        age: 28,
        '*type': 'ClassA'
      }
    };
    expect(getSerializeValueWithClassName(objectToBeSerialized)).toStrictEqual(serializeValueExpected);
  });

  test('will retain custom class information in serialize value', () => {
    const classAInstance = new ClassA();
    classAInstance.name = 'Water';
    expect(getSerializeValueWithClassName(classAInstance)).toStrictEqual({
      _name: 'Water',
      _size: 0,
      age: 28,
      '*type': 'ClassA'
    });
  });

  test('will not retain Object class information in serialize value', () => {
    const obj = { _name: 'Cup' };
    expect(getSerializeValueWithClassName(obj)).toStrictEqual({ _name: 'Cup' });
  });

  test('will retain date information for Date object', () => {
    const objWithDate = { id: 1, date: new Date('2021-02-19T08:24:00Z') };
    expect(getSerializeValueWithClassName(objWithDate)).toStrictEqual({
      id: 1,
      date: {
        '*type': 'Date',
        ess_ts: 1613723040000
      }
    });
  });

  test('will retain wrapper information for Boolean object', () => {
    // noinspection JSPrimitiveTypeWrapperUsage
    const objWithBoolean = { b: new Boolean(true) };
    expect(getSerializeValueWithClassName(objWithBoolean)).toStrictEqual({
      b: {
        '*type': 'Boolean',
        ess_bool: true
      }
    });
  });

  test('will retain custom name information for Error object', () => {
    const error = new Error('some error');
    error.name = 'UnexpectedError';
    delete error.stack;
    const objWithError = {
      e: error
    };
    expect(getSerializeValueWithClassName(objWithError)).toStrictEqual({
      e: {
        '*type': 'Error',
        message: 'some error',
        name: 'UnexpectedError'
      }
    });
  });
});
