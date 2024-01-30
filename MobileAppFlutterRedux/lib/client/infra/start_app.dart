import "dart:async";

import "package:flutter/cupertino.dart";
import "package:flutter/material.dart";
import "package:mobile_app_flutter_redux/business/infra/basic/business.dart";
import "package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart";
import "package:mobile_app_flutter_redux/client/infra/app_homepage.dart";
import "package:mobile_app_flutter_redux/client/infra/client.dart";

Future<void> startApp(RunConfig runConfig) async {
  //
  WidgetsFlutterBinding.ensureInitialized();

  await Future.wait([
    Business.init(runConfig), // Business classes, immutable state classes, AsyncRedux/Actions.
    Client.init(), // Flutter widgets and screens.
  ]);

  runApp(const AppHomePage());
}
