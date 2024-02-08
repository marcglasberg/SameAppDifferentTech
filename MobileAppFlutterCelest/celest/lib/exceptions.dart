// By convention, any custom exception types thrown by an API must be defined
// in this file or exported from this file.

/// This will be turned into a `UserException` on the client, and its message
/// will be translated to the user language, and shown in a dialog.
///
/// Usage:
/// ```
/// throw TranslatableUserException('Cannot sell %d shares of stock you do not own', 3);
/// throw TranslatableUserException('Stock %s not found.', 'IBM');
/// ```
class TranslatableUserException implements Exception {
  const TranslatableUserException(this.message, {this.s, this.d});

  final String message;
  final String? s;
  final int? d;
}

/// This should be used when validating input.
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

/// Used when something will be implemented in the future.
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
