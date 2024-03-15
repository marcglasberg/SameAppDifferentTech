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
