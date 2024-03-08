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

/// The [ConnectionException] is a type of [UserException] that warns the user when the connection
/// is not working. Use [ConnectionException.noConnectivity] for a simple version that warns the
/// users they should check the connection. Use factory [create] to give more complete messages,
/// indicating the host that is having problems.
///
class ConnectionException extends AdvancedUserException {
  //
  // Usage: `throw ConnectionException.noConnectivity`;
  static const noConnectivity = ConnectionException();

  /// Usage: `throw ConnectionException.noConnectivityWithRetry(() {...})`;
  ///
  /// A dialog will open. When the user presses OK or dismisses the dialog in any way,
  /// the [onRetry] callback will be called.
  ///
  static ConnectionException noConnectivityWithRetry(void Function()? onRetry) =>
      ConnectionException(onRetry: onRetry);

  /// Creates a [ConnectionException].
  ///
  /// If you pass it an [onRetry] callback, it will call it when the user presses
  /// the "Ok" button in the dialog. Otherwise, it will just close the dialog.
  ///
  /// If you pass it a [host], it will say "It was not possible to connect to $host".
  /// Otherwise, it will simply say "There is no Internet connection".
  ///
  const ConnectionException({
    void Function()? onRetry,
    String? host,
  }) : super(
          (host != null)
              ? "There is no Internet connection"
              : "It was not possible to connect to $host.",
          reason: 'Please, verify your connection.',
          code: null,
          onOk: onRetry,
          onCancel: null,
          hardCause: null,
        );

  @override
  UserException addReason(String? reason) {
    throw UnsupportedError('You cannot use this.');
  }

  @override
  UserException mergedWith(UserException? userException) {
    throw UnsupportedError('You cannot use this.');
  }
}
