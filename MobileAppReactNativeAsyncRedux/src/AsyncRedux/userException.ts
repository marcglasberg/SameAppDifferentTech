// This exception is meant to represent a user input error, and not a bug or
// a system error. It must not be logged as an error, but instead shown to the
// user. When dispatched inside a reducer, a dialog will be shown to the user,
// with the given message.
export class UserException extends Error {
  constructor(message: string) {
    super(message);
  }
}
