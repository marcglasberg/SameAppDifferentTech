import 'react-native';
import { beforeEach, describe, expect, it } from '@jest/globals';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from '../../src/business/dao/Storage';

describe('Storage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new Storage();
    AsyncStorage.clear();
  });

  it('stores and retrieves a value.', async () => {
    await storage.setItem('key', 'value');
    const retrievedValue = await storage.getItem('key');
    expect(retrievedValue).toEqual('value');
  });

  it('removes a value.', async () => {
    await storage.setItem('key', 'value');
    await storage.removeItem('key');
    const retrievedValue = await storage.getItem('key');
    expect(retrievedValue).toBeNull();
  });

  it('clears the storage.', async () => {
    await storage.setItem('key1', 'value1');
    await storage.setItem('key2', 'value2');
    await storage.clear();
    const retrievedValue1 = await storage.getItem('key1');
    const retrievedValue2 = await storage.getItem('key2');
    expect(retrievedValue1).toBeNull();
    expect(retrievedValue2).toBeNull();
  });
});

describe('InMemoryStorage', () => {
  let inMemoryStorage: Storage;

  beforeEach(() => {
    inMemoryStorage = Storage.newInMemoryInstance();
  });

  it('stores and retrieves a value.', async () => {
    await inMemoryStorage.setItem('key', 'value');
    const retrievedValue = await inMemoryStorage.getItem('key');
    expect(retrievedValue).toEqual('value');
  });

  it('removes a value.', async () => {
    await inMemoryStorage.setItem('key', 'value');
    await inMemoryStorage.removeItem('key');
    const retrievedValue = await inMemoryStorage.getItem('key');
    expect(retrievedValue).toBeNull();
  });

  it('clears the storage.', async () => {
    await inMemoryStorage.setItem('key1', 'value1');
    await inMemoryStorage.setItem('key2', 'value2');
    await inMemoryStorage.clear();
    const retrievedValue1 = await inMemoryStorage.getItem('key1');
    const retrievedValue2 = await inMemoryStorage.getItem('key2');
    expect(retrievedValue1).toBeNull();
    expect(retrievedValue2).toBeNull();
  });
});
