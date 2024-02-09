import "dart:io";

import "package:async_redux/async_redux.dart";

import "connectivity.dart";

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

/// An [InternetException] is a type of [UserException] that alerts the user when the connection is
/// having issues. Use [InternetException.noInternet] for a simple version that advises the
/// user to check their connection. Use the factory [newInstance] to give more complete messages,
/// indicating which host (Google, Apple etc) is having problems.
class InternetException extends UserException {
  //
  static const noInternet = InternetException._noInternet();

  final bool ifDeviceHasInternet;

  InternetException({
    required this.ifDeviceHasInternet,
    Object? cause,
  }) : super(
            ifDeviceHasInternet ? "There is no Internet" : "We couldn't connect to the our server.",
            cause: const UserException('Please, check your Internet connection.')) {
    if (ifDeviceHasInternet)
      print(
        "\nMsg = $msg, "
        "================================================================"
        "\nCause = $cause,"
        "================================================================"
        "\nCode = $code",
      );
  }

  const InternetException._noInternet()
      : ifDeviceHasInternet = false,
        super("There is no Internet",
            cause: const UserException('Please, check your Internet connection.'));

  /// Async Factory that verifies if the device has Internet.
  static Future<InternetException> newInstance({
    Object? cause,
    StackTrace? stackTrace,
  }) async {
    // TODO: Add logger here.
    // if (cause != null) await log(cause, stackTrace);

    return InternetException(ifDeviceHasInternet: await ifThereIsInternet(), cause: cause);
  }
}
