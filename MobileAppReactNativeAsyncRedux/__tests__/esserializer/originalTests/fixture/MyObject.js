// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

'use strict';

function MyObject() {
  this.init();
}

MyObject.prototype = {
  property1: '',
  property2: '',

  init: function() {
    this.property1 = 'First';
    this.property2 = 'Second';
  },

  isInitialized: function() {
    return true;
  },
};
MyObject.prototype.constructor = MyObject;

export default MyObject;
