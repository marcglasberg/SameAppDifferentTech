import "dart:async";

import "package:flutter/cupertino.dart";
import "package:flutter/material.dart";
import 'package:mobile_app_flutter_redux/client/infra/basic/app_homepage.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/client.dart';
import "package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart";
import "business.dart";

Future<void> startApp(RunConfig runConfig) async {
  //
  WidgetsFlutterBinding.ensureInitialized();

  // Instantiates the Business and the Client layers.
  await Future.wait([
    Business.init(runConfig), // Business layer, like state classes, AsyncRedux/Actions.
    Client.init(), // Client layer, like Flutter widgets and screens.
  ]);

  runApp(const AppHomePage());
}
