// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

interface DeserializeOptions {
  fieldsForConstructorParameters?: Array<string>,
  ignoreProperties?: Array<string>,
  rawProperties?: Array<string>
}

export default DeserializeOptions;
