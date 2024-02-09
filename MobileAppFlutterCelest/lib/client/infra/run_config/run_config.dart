import 'package:flutter/foundation.dart';
import 'package:i18n_extension/i18n_extension.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/simulated_dao.dart';

import 'ab_testing.dart';

@immutable
class RunConfig {
  static RunConfig? _instance;

  final Dao dao;

  /// If true, PlatformChannels will not be called.
  /// Recommended default: true, for the real and demo; False for tests.
  final bool disablePlatformChannels;

  /// If true, the app may show error dialogs when there is no internet connection.
  /// Recommended default: true, for the real app; false, for demo and tests.
  /// Note: When false, checking if there is internet connection will always return true.
  /// Note: You can also disable this check by doing [disablePlatformChannels] true.
  final bool ifChecksInternetConnection;

  final bool ifShowRunConfigInTheConfigScreen;

  final AbTesting abTesting;

  /// If true, the missing translations will be logged to the console. Default is false.
  /// Note: This is specific to the `i18n_extension` package we use for translations.
  final bool ifLogsMissingTranslations;

  /// 1) Null: The default. Does not simulate. Get the real connection status from the plugin.
  /// 2) True: Simulates the connection status, stating that there is a connection.
  /// 3) False: Simulates the connection status, stating that there is NO connection.
  final bool? internetOnOffSimulation;

  RunConfig({
    required this.dao,
    this.ifLogsMissingTranslations = false,
    this.disablePlatformChannels = false,
    this.ifChecksInternetConnection = true,
    this.ifShowRunConfigInTheConfigScreen = true,
    this.abTesting = AbTesting.A,
    this.internetOnOffSimulation,
  });

  /// Return true if the DAO is a SimulatedDao.
  bool get isSimulatingTheDao => dao is SimulatedDao;

  RunConfig copy({
    Dao? dao,
    bool? ifLogsMissingTranslations,
    bool? disablePlatformChannels,
    bool? ifChecksInternetConnection,
    bool? ifShowRunConfigInTheConfigScreen,
    AbTesting? abTesting,
    bool? internetOnOffSimulation,
  }) =>
      RunConfig(
        dao: dao ?? this.dao,
        ifLogsMissingTranslations: ifLogsMissingTranslations ?? this.ifLogsMissingTranslations,
        disablePlatformChannels: disablePlatformChannels ?? this.disablePlatformChannels,
        ifChecksInternetConnection: ifChecksInternetConnection ?? this.ifChecksInternetConnection,
        ifShowRunConfigInTheConfigScreen:
            ifShowRunConfigInTheConfigScreen ?? this.ifShowRunConfigInTheConfigScreen,
        abTesting: abTesting ?? this.abTesting,
        internetOnOffSimulation: internetOnOffSimulation ?? this.internetOnOffSimulation,
      );

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

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RunConfig &&
          runtimeType == other.runtimeType &&
          dao == other.dao &&
          ifLogsMissingTranslations == other.ifLogsMissingTranslations &&
          disablePlatformChannels == other.disablePlatformChannels &&
          ifChecksInternetConnection == other.ifChecksInternetConnection &&
          ifShowRunConfigInTheConfigScreen == other.ifShowRunConfigInTheConfigScreen &&
          abTesting == other.abTesting &&
          internetOnOffSimulation == other.internetOnOffSimulation;

  @override
  int get hashCode =>
      dao.hashCode ^
      ifLogsMissingTranslations.hashCode ^
      disablePlatformChannels.hashCode ^
      ifChecksInternetConnection.hashCode ^
      ifShowRunConfigInTheConfigScreen.hashCode ^
      abTesting.hashCode ^
      internetOnOffSimulation.hashCode;
}
