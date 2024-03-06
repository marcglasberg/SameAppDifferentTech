// By convention, any custom exception types thrown by an API must be defined
// in this file or exported from this file.

export 'package:async_redux_core/async_redux_core.dart';

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

class NotYetImplementedError implements Exception {
  final String msg;

  NotYetImplementedError([Object? msg]) : msg = msg.toString();

  // DON'T REMOVE:
  // NotYetImplementedError([Object? msg])
  //     : msg = (msg == null) ? StackTrace.current.toString() : "$msg\n\n${StackTrace.current}";

  @override
  String toString() => "NOT YET IMPLEMENTED!\n $msg";

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is NotYetImplementedError && runtimeType == other.runtimeType;

  @override
  int get hashCode => 0;
}
