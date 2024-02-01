import "dart:io";

import "package:async_redux/async_redux.dart";

/// Used for Bugs.
class AppError extends AssertionError {
  //
  final Object? error;

  AppError([
    Object? msg,
    this.error,
  ]) : super(msg?.toString());

  @override
  String toString() {
    String errorStr = "";

    if (error is Error) {
      Error errorObj = error as Error;
      errorStr = '\n\n\n\n' +
          errorObj.toString() +
          '\n\n\n\n' +
          errorObj.stackTrace.toString() +
          '\n\n\n\n';
    } else if (error != null) errorStr = " Error: " + error.toString();

    return "Assertion failed with message:\n>>> ${message.toString() + errorStr} <<<";
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppError && runtimeType == other.runtimeType && message == other.message;

  @override
  int get hashCode => message.hashCode;
}

/// Used when something failed but its is NOT an error, and can be recovered from.
class AppException implements Exception {
  //
  final Object? error;
  final Object? msg;

  AppException([this.msg, this.error]);

  @override
  String toString() => msg.toString();
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

/// Used to stop the control flow, interrupting a process and breaking out of the current code.
/// This shouldn't be logged nor show any error messages. It also has no stacktrace.
/// Use with care, only if you know what you are doing, because that's generally an anti-pattern.
class InterruptControlFlowException {
  const InterruptControlFlowException();

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is InterruptControlFlowException && runtimeType == other.runtimeType;

  @override
  int get hashCode => 0;
}

/// This should be used when validating input.
class ValidateError extends TypeError {
  String msg;

  ValidateError(this.msg);

  ValidateError.semCrashlytics(this.msg);

  @override
  String toString() => 'ValidateError: $msg';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ValidateError && runtimeType == other.runtimeType && msg == other.msg;

  @override
  int get hashCode => msg.hashCode;
}

/// UserException that shows in the console.
/// Used for debugging reasons only, for short periods of time.
/// It is marked as [deprecated] so that you don't forget to remove it.
/// Note: To remove it, just remove the "_ShowInConsole" part.
@deprecated
class UserException_ShowInConsole extends UserException {
  //
  UserException_ShowInConsole(
    String msg, {
    Object? cause,
    ExceptionCode? code,
  }) : super(msg, cause: cause, code: code) {
    stderr.writeln(
      '\nMsg = $msg, '
      '================================================================'
      '\nCause = $cause,'
      '================================================================'
      '\nCode = $code',
    );
  }
}
