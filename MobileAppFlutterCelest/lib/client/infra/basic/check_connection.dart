import "dart:async";

import "package:async_redux/async_redux.dart";
import "package:connectivity_plus/connectivity_plus.dart";
import 'package:flutter/cupertino.dart';

import "../run_config/run_config.dart";

Future<void> makeSureThereIsInternetConnection({
  VoidCallback? onRetry,
}) async {
  if (await ifHasNoInternetConnection()) throw ConnectionException.noConnectivityWithRetry(onRetry);
}

Future<bool> ifHasNoInternetConnection() async => !await ifHasInternetConnection();

Future<bool> ifHasInternetConnection() async {
  if (RunConfig.instance.disablePlatformChannels) return true;
  if (!RunConfig.instance.ifChecksInternetConnection) return true;
  // ---

  ConnectivityResult result = await Connectivity().checkConnectivity();
  return (result != ConnectivityResult.none);
}

/// The [ConnectionException] is a type of [UserException] that warns the user when the connection
/// is not working. Use [ConnectionException.noConnectivity] for a simple version that warns the
/// users they should check the connection. Use factory [create] to give more complete messages,
/// indicating the host that is having problems.
///
class ConnectionException extends UserException {
  //
  static const noConnectivity = ConnectionException._noConnectivity();

  final bool ifThereIsConnection;

  ConnectionException({
    required this.ifThereIsConnection,
    VoidCallback? onOk,
    required String host,
    Object? cause,
  }) : super(
          ifThereIsConnection
              ? "There is no Internet connection"
              : "It was not possible to connect to $host.",
          cause: const UserException('Please, verify your connection.'),
          onOk: onOk,
        ) {
    if (ifThereIsConnection)
      print(
        "\nHost = $host "
        "\nMsg = $msg, "
        "================================================================"
        "\nCause = $cause,"
        "================================================================"
        "\nCode = $code",
      );
  }

  /// A dialog will open. When the user presses OK or dismisses the dialog in any way,
  /// the [onRetry] callback will be called.
  ConnectionException.noConnectivityWithRetry(VoidCallback? onRetry)
      : ifThereIsConnection = false,
        super("There is no Internet connection",
            cause: UserException(
              'Please, verify your connection.',
              onOk: onRetry,
            ));

  const ConnectionException._noConnectivity()
      : ifThereIsConnection = false,
        super("There is no Internet connection",
            cause: const UserException('Please, verify your connection.'));

  /// Async factory that verifies automatically if the device is connected.
  static Future<ConnectionException> create(
    String host, {
    Object? cause,
    StackTrace? stackTrace,
  }) async {
    // TODO: MARCELO
    // if (cause != null) logs(cause, stackTrace);

    return ConnectionException(
        ifThereIsConnection: await ifHasInternetConnection(), host: host, cause: cause);
  }
}
