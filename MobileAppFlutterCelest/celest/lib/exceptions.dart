// By convention, any custom exception types thrown by an API must be defined
// in this file or exported from this file.

/// Use [CloudUserException] in Celest functions. It will be turned into a `UserException`
/// on the client, and its message shown in a dialog. This does not represent a function
/// error, but a user error (should not be logged).
///
/// Usage:
/// ```
/// throw CloudUserException('Cannot sell %d shares of stock you do not own', 3);
/// throw CloudUserException('Stock %s not found.', 'IBM');
/// ```
class CloudUserException implements Exception {
  CloudUserException(this.message);

  final String message;
}

/// Use [ValidateError] when validating input fails.
class ValidateError extends TypeError {
  String msg;

  ValidateError(this.msg);

  @override
  String toString() => 'ValidateError: $msg';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ValidateError && runtimeType == other.runtimeType && msg == other.msg;

  @override
  int get hashCode => msg.hashCode;
}

/// Use [NotYetImplementedError] when a feature is not yet implemented.
class NotYetImplementedError extends AssertionError {
  final String msg;

  NotYetImplementedError([dynamic msg])
      : msg = (msg == null) ? StackTrace.current.toString() : "$msg\n\n${StackTrace.current}";

  @override
  String toString() => "NOT YET IMPLEMENTED!\n $msg";

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is NotYetImplementedError && runtimeType == other.runtimeType;

  @override
  int get hashCode => 0;
}
