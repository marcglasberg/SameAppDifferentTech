import 'dart:async';

import "package:connectivity/connectivity.dart";
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_celest/client/utils/errors_and_exceptions.dart';

/// Throws [InternetException.noInternet] if there is no internet.
Future<void> checkInternet() async {
  if (await ifNoInternet()) throw InternetException.noInternet;
}

/// Returns true if there is internet.
/// Note: This can be used to check if there is internet before making a request to the server.
/// However, it only checks if the internet is on or off on the device, not if the internet
/// provider is really providing the service or if the server is available. So, it is possible that
/// this function returns true and the request still fails.
Future<bool> ifThereIsInternet() async {
  if (RunConfig.instance.isSimulatingTheDao && RunConfig.instance.internetOnOffSimulation != null)
    return RunConfig.instance.internetOnOffSimulation!;
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
