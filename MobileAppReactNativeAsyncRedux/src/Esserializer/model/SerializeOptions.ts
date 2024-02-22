// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

interface SerializeOptions {
  ignoreProperties?: Array<string>,
  interceptProperties?: Record<string, Function>
}

export default SerializeOptions;
