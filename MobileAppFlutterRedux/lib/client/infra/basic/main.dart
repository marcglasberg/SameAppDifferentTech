import 'package:mobile_app_flutter_redux/client/infra/basic/start_app.dart';

import '../dao/simulated_dao/simulated_dao.dart';
import '../run_config/ab_testing.dart';
import '../run_config/run_config.dart';

void main() async {
  //

  /// Run configurations let you change app behavior at compile time. You can
  /// provide different `main` entry points with distinct configurations, or
  /// create a `RunConfig` instance programmatically and pass it to `startApp`.
  var runConfig = RunConfig(
    //
    /// If we inject the REAL dao, it will connect to the real backend service.
    /// If we inject the SIMULATED dao, it will simulate the backend service.
    // dao: RealDao(),
    dao: SimulatedDao(), // Another option.

    ifShowRunConfigInTheConfigScreen: true,
    abTesting: AbTesting.A,
  );

  startApp(runConfig);
}
