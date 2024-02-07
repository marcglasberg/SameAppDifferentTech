import 'package:mobile_app_flutter_celest/client/utils/errors_and_exceptions.dart';

import '../dao.dart';

mixin GetStockPrices implements Dao {
  //
  @override
  Future<void> startListeningToStockPriceUpdates({required PriceUpdate callback}) async {
    throw NotYetImplementedError();
  }

  @override
  Future<void> stopListeningToStockPriceUpdates() async {
    throw NotYetImplementedError();
  }
}
