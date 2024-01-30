import 'dart:async';
import 'dart:math';

import 'package:mobile_app_flutter_redux/business/infra/dao/dao.dart';
import 'package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart';

SimBackend get sb => SimBackend.instance;

/// Simulates waiting for the demonstrating with the app.
/// For tests, will wait a very small random amount of time.
Future<void> simulatesWaiting(int millis) {
  Random _random = Random.secure();
  return (RunConfig.instance.disablePlatformChannels)
      ? Future.delayed(Duration(milliseconds: _random.nextInt(20) + 1))
      : Future.delayed(Duration(milliseconds: millis));
}

/// This is the simulated backend.
/// It can be user for tests and demonstrations.
/// It should NEVER be used for production.
class SimBackend {
  //
  static SimBackend? _instance;

  /// Returns the current Simulated-Backend instance. Throws if it's not yet defined.
  /// You can use hasInstance to check if it exists.
  static SimBackend get instance => //
      hasInstance //
          ? _instance!
          : throw BackendError("The SimBackend is not defined.");

  static bool get hasInstance => _instance != null;

  /// This will create a new Simulated-Backend, and will initialize it with some orders.
  static Future<SimBackend> init() async {
    _instance = SimBackend();
    return instance;
  }

  /// Makes sure the Simulated-Backend cannot be used anymore.
  static Future<void> destroy() async {
    _instance = null;
  }

  late Map<int, String> numberDescriptions;

  SimBackend() {
    numberDescriptions = {};
  }
}
