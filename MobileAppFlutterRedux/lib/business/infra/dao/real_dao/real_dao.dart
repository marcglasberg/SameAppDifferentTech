library module_graphql;

import '../dao.dart';
import 'get_initial_app_info.dart';

class RealDao extends Dao with GetInitialAppInfo {
  //
  /// Initializes the DAO, if necessary.
  /// This is called in the app's initialization.
  @override
  Future<void> init() async {
  }
}
