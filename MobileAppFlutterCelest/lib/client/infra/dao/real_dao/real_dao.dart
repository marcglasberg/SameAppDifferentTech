library module_graphql;

import '../dao.dart';
import 'get_initial_app_info.dart';
import 'get_stock_prices.dart';

class RealDao extends Dao with GetInitialAppInfo, GetStockPrices {
  //
  @override
  Future<void> init() async {
    // Do something, if necessary.
  }
}
