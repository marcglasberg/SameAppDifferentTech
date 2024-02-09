import 'package:celest_backend/client.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/start_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/simulated_dao.dart';

import '../dao/real_dao.dart';
import '../run_config/ab_testing.dart';
import '../run_config/run_config.dart';

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
    abTesting: AbTesting.A,
  );

  celest.init();
  startApp(runConfig);
}
