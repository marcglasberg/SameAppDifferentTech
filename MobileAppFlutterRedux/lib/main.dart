import 'package:mobile_app_flutter_redux/business/infra/dao/simulated_dao/simulated_dao.dart';
import 'package:mobile_app_flutter_redux/business/infra/run_config/ab_testing.dart';
import 'package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/client/infra/start_app.dart';

void main() async {
  //

  /// A run-configuration let's us change some of the app characteristics at compile time.
  /// We can have multiple main methods with different run-configurations, or we can create
  /// the run-configuration programmatically.
  var runConfig = RunConfig(
    //
    /// If we inject the REAL dao, it will connect to the real backend service.
    /// If we inject the SIMULATED dao, it will simulate the backend service.
    // dao: RealDao(),
    dao: SimulatedDao(), // Another option.

    ifShowRunConfigInTheConfigScreen: true,
    ifPrintsDebugInfoToConsole: true,
    abTesting: AbTesting.A,
  );

  startApp(runConfig);
}
