/**
 This exception is meant to represent a user input error, and not a bug or
 a system error. It must not be logged as an error, but instead shown to the
 user. When dispatched inside a reducer, a dialog will be shown to the user,
 with the given message.

 Usage:

 ```ts
 // Throws an exception with the given message.
 throw new UserException('The item already exists');

 // Throws an exception with the given message and title.
 throw new UserException('The item already exists', { title: 'Could not add' });
 ```

 You can also define a cause for the exception:
 ```ts
 // Throws an exception with the given message.
 throw new UserException('The item already exists', {cause: someError}});
 ```
 */
export class UserException extends Error {
  title: string;
  cause: any;

  constructor(
    message: string,
    { title, cause }: { title?: string, cause?: any } = {}) {

    super(message);

    this.name = 'UserException';
    this.title = title || '';

    // Maintains proper stack trace for where our error was thrown (only available on V8).
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserException);
    }
  }

  /**
   Adds a title to the exception. Keeps the message unaltered.

   Usage:

   ```ts
   // Throws an exception with the given message and title.
   throw new UserException('The item already exists').withTitle('Could not add');
   ```
   */
  withTitle(title: string): UserException {
    return new UserException(this.message, { title: title, cause: this.cause });
  }

  /**
   Adds a message to the exception. Keeps the title unaltered, if it exists.

   Usage:

   ```ts
   // Throws an exception with the given message and title.
   throw new UserException('The item already exists').withTitle('Could not add');
   ```
   */
  withMessage(message: string): UserException {
    return new UserException(message, { title: this.title, cause: this.cause });
  }

  /**
   Adds a cause to the exception. Keeps the message and title unaltered.

   Usage:

   ```ts
   throw new UserException('The item already exists').withCause(someError);
   ```
   */
  withCause(cause: any): UserException {
    return new UserException(this.message, { title: this.title, cause: cause });
  }
}
