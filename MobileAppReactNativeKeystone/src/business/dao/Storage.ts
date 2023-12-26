import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * This class provides a wrapper around AsyncStorage from @react-native-async-storage/async-storage,
 * allowing for the local storage and retrieval of string data. It also includes a
 * static method to create an in-memory instance of storage, useful for developing
 * and testing.
 *
 * To really persist information to the local device, do this in the app initialization:
 * inject({ storage: new Storage(), ... });
 *
 * To save information to memory only, simply omit the storage parameter, or do this:
 * inject({ storage: Storage.newInMemoryInstance(), ... });
 *
 * Then, use it like this:
 * import { storage } from '.../init';
 * await storage.setItem('portfolio', serializedPortfolio);
 * let serializedPortfolio = storage.getItem('portfolio');
 */
export class Storage {

  constructor() {
  }

  /**
   *  Creates and returns a new instance of InMemoryStorage, which is an in-memory
   *  version of the Storage class. The instance is empty (has no data).
   */
  static newInMemoryInstance(): Storage {
    return new InMemoryStorage();
  }

  /** Asynchronously stores a string value under a specified key in the storage. */
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  /** Asynchronously retrieves the value associated with a given key. */
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  /** Asynchronously removes the value associated with the given key. */
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  /** Asynchronously clears the storage (removes ALL the information). */
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}

class InMemoryStorage implements Storage {
  private memoryStorage: Record<string, string> = {};

  async setItem(key: string, value: string): Promise<void> {
    await this.simulateAsyncProcess();
    this.memoryStorage[key] = value;
  }

  async getItem(key: string): Promise<string | null> {
    await this.simulateAsyncProcess();
    return this.memoryStorage[key] || null;
  }

  async removeItem(key: string): Promise<void> {
    await this.simulateAsyncProcess();
    delete this.memoryStorage[key];
  }

  async clear(): Promise<void> {
    await this.simulateAsyncProcess();
    this.memoryStorage = {};
  }

  /** Wait for 0.1 second to simulate an async process. */
  private async simulateAsyncProcess() {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}



