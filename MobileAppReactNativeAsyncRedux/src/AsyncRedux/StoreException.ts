/**
 All exceptions thrown by AsyncRedux are of type StoreException.
 */
export class StoreException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'StoreException';

    // Maintains proper stack trace for where our error was thrown (only available on V8).
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StoreException);
    }
  }
}

export class ExceptionUtils {

  /**
   Cuts the stack trace at the given string, to avoid showing internal AsyncRedux lines,
   which are not interesting to the user.

   IMPORTANT: This should only be called during development. V8 only computes it if someone
   actually reads the property, which improves performance dramatically for handable errors.
   When you use this, you'll pay the cost even if your caller doesn't need the stack.

   The given text will be found at the start of the line, like this: `    at ${text} `
   */
  static sanitizedStackTrace<T extends Error>(error: T, text: string): T {
    const stack = error.stack;
    if (stack === undefined) return error;

    const stackLines = stack.split('\n');
    let newStackStartIndex = -1;

    // Be aware that `constructor.name` cannot be used with bundlers that mangle
    // class or function names, because the error class name in the minified code
    // might be shortened.
    const errorLine = `    at ${text} `;

    // Find the index where the exception was dispatched.
    for (let i = 0; i < stackLines.length - 1; i++) {
      if (stackLines[i].startsWith(errorLine)) {
        newStackStartIndex = i + 1;
        break;
      }
    }

    if (newStackStartIndex !== -1) {
      // Reconstruct the stack trace from the desired start point
      // Also, include the error name and message as the first line
      const newStack = [
        `${error.name}: ${error.message}`,
        ...stackLines.slice(newStackStartIndex)
      ].join('\n');

      error.stack = newStack;
    }

    return error;
  }
}
