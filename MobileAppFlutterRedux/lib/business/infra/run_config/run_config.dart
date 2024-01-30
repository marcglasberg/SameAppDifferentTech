import 'package:flutter/foundation.dart';
import 'package:i18n_extension/i18n_extension.dart';
import 'package:mobile_app_flutter_redux/business/infra/dao/dao.dart';

import 'ab_testing.dart';

@immutable
class RunConfig {
  //
  static RunConfig? _instance;

  final Dao dao;

  /// If true, the missing translations will be logged to the console. Default is false.
  final bool ifLogsMissingTranslations;

  /// If true, PlatformChannels will not be called.
  /// Recommended default: true, for the real and demo; False for tests.
  final bool disablePlatformChannels;

  /// If true, the app may show error dialogs when there is no internet connection.
  /// Recommended default: true, for the real app; false, for demo and tests.
  /// Note: When false, checking if there is internet connection will always return true.
  /// Note: You can also disable this check by doing [disablePlatformChannels] true.
  final bool ifChecksInternetConnection;

  final bool ifShowRunConfigInTheConfigScreen;

  final bool ifPrintsDebugInfoToConsole;

  final AbTesting abTesting;

  RunConfig({
    required this.dao,
    this.ifLogsMissingTranslations = false,
    this.disablePlatformChannels = false,
    this.ifChecksInternetConnection = true,
    this.ifShowRunConfigInTheConfigScreen = true,
    this.ifPrintsDebugInfoToConsole = true,
    this.abTesting = AbTesting.A,
  });

  /// This will turn the given runConfig into a singleton, accessible statically.
  /// It will also apply the RunConfiguration, injecting its parts where necessary.
  static void setInstance(RunConfig runConfig) {
    _instance = runConfig;

    if (!RunConfig.instance.ifLogsMissingTranslations) {
      Translations.missingKeyCallback = (_, __) {};
      Translations.missingTranslationCallback = (_, __) {};
    }
  }

  /// Returns the current RunConfig instance.
  /// Throws if that instance is not yet defined.
  static RunConfig get instance => (_instance != null)
      ? _instance!
      : throw AssertionError("A RunConfig instance is not defined.");
}
