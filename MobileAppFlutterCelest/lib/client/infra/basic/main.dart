import 'package:celest_backend/client.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/start_app.dart';

import '../dao/real_dao.dart';
import '../run_config/ab_testing.dart';
import '../run_config/run_config.dart';

void main() async {
  //

  /// A run-configuration let us change some of the app characteristics at compile time.
  /// We can have multiple main methods with different run-configurations, or we can create
  /// the run-configuration programmatically.
  var runConfig = RunConfig(
    dao: RealDao(),
    // dao: SimulatedDao(), // Another option.
    ifShowRunConfigInTheConfigScreen: true,
    abTesting: AbTesting.A,
  );

  celest.init();
  startApp(runConfig);
}
