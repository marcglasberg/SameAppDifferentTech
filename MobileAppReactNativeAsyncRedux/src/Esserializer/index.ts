// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

import DeserializeOptions from './model/DeserializationOptions';
import SerializeOptions from './model/SerializeOptions';

import { getSerializeValueWithClassName } from './utils/serializer';
import { deserializeFromParsedObj } from './utils/deserializer';

export type ClassOrEnum = { new(...args: any[]): any } | object;

export class ESSerializer {

  private static registeredClasses: Array<ClassOrEnum> = [];

  /**
   * Globally register classes or enums.
   */
  public static registerClasses(classesOrEnums: Array<ClassOrEnum>) {
    this.registeredClasses = this.registeredClasses.concat(classesOrEnums);
  }

  public static registerClass(classOrEnum: ClassOrEnum) {
    this.registeredClasses.push(classOrEnum);
  }

  /**
   * Clear all registered classes.
   */
  public static clearRegisteredClasses() {
    this.registeredClasses = [];
  }

  /**
   * @param target
   * @param options Serialization options
   */
  public static serialize(target: any, options: SerializeOptions = {}): string {
    return JSON.stringify(getSerializeValueWithClassName(target, options));
  }

  /**
   * @param serializedText
   * @param classes
   * because there is no TypeScript type definition for Class.
   * @param options Deserialization options
   */
  public static deserialize(
    serializedText: string,
    classes: Array<ClassOrEnum> = [],
    options: DeserializeOptions = {}): any {
    //
    return deserializeFromParsedObj(
      JSON.parse(serializedText),
      Object.values(this.registeredClasses).concat(classes),
      options
    );
  }
}


