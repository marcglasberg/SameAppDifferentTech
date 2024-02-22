// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

function Person(age) {
  this.age = age;
  this.isOld = function() {
    return this.age > 60;
  };
}

export default Person;
