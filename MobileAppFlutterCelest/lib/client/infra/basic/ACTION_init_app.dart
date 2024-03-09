import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';
import 'ACTION_app.dart';

// Stuff the Store needs to do as soon as the app opens,
// like reading info from the backend, opening websockets, etc.
class InitApp_Action extends AppAction {
  //
  @override
  Future<AppState?> reduce() async {

    // Initializes the DAO, if necessary, fetching data from the backend.
    await DAO.init();

    // The portfolio will be loaded from the local device disk, using the persistor. However, we
    // still need to read it from the cloud, in case it was updated from another device. When this
    // action is called, the persistor already loaded the portfolio from the local device disk,
    // so there is no risk of a race condition where the info from the disk arrives later than
    // the info from the cloud.
    var portfolio = await DAO.readPortfolio();

    return state.copy(portfolio: portfolio);
  }
}
