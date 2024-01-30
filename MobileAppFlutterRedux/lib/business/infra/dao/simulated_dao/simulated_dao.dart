import 'package:mobile_app_flutter_redux/business/infra/dao/simulated_dao/get_stock_prices.dart';
import 'package:mobile_app_flutter_redux/business/infra/dao/simulated_dao/sim_backend.dart';
import 'package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart';

import '../dao.dart';
import 'get_initial_app_info.dart';

class SimulatedDao extends Dao with GetInitialAppInfo, GetStockPrices {
  //
  static SimulatedDao get instance => RunConfig.instance.dao as SimulatedDao;

  SimulatedDao();

  @override
  Future<void> init() async {
    await SimBackend.init();
  }
}
