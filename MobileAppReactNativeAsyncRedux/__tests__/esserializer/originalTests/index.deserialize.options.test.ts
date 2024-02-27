// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import User from './fixture/User';
import { ESSerializer } from '../../../src/Esserializer';

describe('Test special object properties', () => {

  //
  test('can serialize and deserialize getter/setter defined in class constructor', () => {
    const user = new User('P123456', 'Mike');
    // @ts-ignore
    user.location = 'Zhejiang_Ningbo';
    const serializedString = ESSerializer.serialize(user);
    const deserializedObj = ESSerializer.deserialize(serializedString, [User]);
    expect(deserializedObj.location).toBe('Zhejiang : Ningbo');
    // @ts-ignore
    expect(typeof Object.getOwnPropertyDescriptor(deserializedObj, 'location').get).toBe('function');
    // @ts-ignore
    expect(typeof Object.getOwnPropertyDescriptor(deserializedObj, 'location').set).toBe('function');
  });

  // TODO: This test is from the original Esserializer, and it's not working.
  // test('can serialize and deserialize read only property defined in class constructor', () => {
  //   const user = new User('P123456', 'Mike');
  //   const serializedString = ESSerializer.serialize(user);
  //   const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
  //     fieldsForConstructorParameters: ['idNum', 'name']
  //   });
  //   expect(deserializedObj.displayName).toBe('P123456_Mike');
  //   expect(deserializedObj.displayObject).toStrictEqual({
  //     identity: 'P123456',
  //     nickname: 'Mike'
  //   });
  // });

  // TODO: This test is from the original Esserializer, and it's not working.
  // test('can deal with invalid field that is passed to class constructor', () => {
  //   const user = new User('P123456', 'Mike');
  //   const serializedString = ESSerializer.serialize(user);
  //   const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
  //     fieldsForConstructorParameters: ['notExistedField', 'name']
  //   });
  //   expect(deserializedObj.displayName).toBe('[object Object]_Mike');
  // });

  // TODO: This test is from the original Esserializer, and it's not working.
  // test('can deal with redundant field that is passed to class constructor', () => {
  //   const user = new User('P123456', 'Mike');
  //   const serializedString = ESSerializer.serialize(user);
  //   const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
  //     fieldsForConstructorParameters: ['idNum', 'name', 'redundantField']
  //   });
  //   expect(deserializedObj.displayName).toBe('P123456_Mike');
  // });

  // TODO: This test is from the original Esserializer, and it's not working.
  // test('can deal with missing field that is passed to class constructor', () => {
  //   const user = new User('P123456', 'Mike');
  //   const serializedString = ESSerializer.serialize(user);
  //   const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
  //     fieldsForConstructorParameters: ['idNum']
  //   });
  //   expect(deserializedObj.displayName).toBe('P123456_[object Object]');
  // });

  test('can retain raw property text value during deserialization', () => {
    const text = '{"user":"Alice","data":{"row":1234,"column":21,"url":"https://example.com"}}';
    const deserializedObj = ESSerializer.deserialize(text, [], {
      rawProperties: ['data']
    });
    expect(deserializedObj.data).toBe('{"row":1234,"column":21,"url":"https://example.com"}');
  });

  test('can ignore properties during deserialization', () => {
    const text = '{"user":"Alice","data":{"row":1234,"column":21,"url":"https://example.com"}}';
    const deserializedObj = ESSerializer.deserialize(text, [], {
      ignoreProperties: ['data']
    });
    expect(deserializedObj.data).toBeUndefined();
  });
});
