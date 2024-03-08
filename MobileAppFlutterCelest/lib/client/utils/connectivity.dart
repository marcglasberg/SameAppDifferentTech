import 'dart:async';

import "package:connectivity_plus/connectivity_plus.dart";
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_celest/client/utils/errors_and_exceptions.dart';

/// Throws a [ConnectionException] if there is no internet.
Future<void> checkInternet({
  void Function()? onRetry,
}) async {
  if (await ifNoInternet()) throw ConnectionException.noConnectivityWithRetry(onRetry);
}

/// Returns true if there is internet.
/// Note: This can be used to check if there is internet before making a request to the server.
/// However, it only checks if the internet is on or off on the device, not if the internet
/// provider is really providing the service or if the server is available. So, it is possible that
/// this function returns true and the request still fails.
Future<bool> ifThereIsInternet() async {
  if (RunConfig.instance.internetOnOffSimulation != null)
    return RunConfig.instance.internetOnOffSimulation!;
  else if (RunConfig.instance.disablePlatformChannels)
    return true;
  else if (!RunConfig.instance.ifChecksInternetConnection)
    return true;
  else {
    ConnectivityResult result = await Connectivity().checkConnectivity();
    return (result != ConnectivityResult.none);
  }
}

/// Returns true if there is no internet.
/// Note: This can be used to check if there is internet before making a request to the server.
/// However, it only checks if the internet is on or off on the device, not if the internet
/// provider is really providing the service or if the server is available. So, it is possible that
/// this function returns true and the request still fails.
Future<bool> ifNoInternet() async => !await ifThereIsInternet();
