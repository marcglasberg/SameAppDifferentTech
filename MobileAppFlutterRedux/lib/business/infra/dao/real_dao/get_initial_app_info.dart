import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:mobile_app_flutter_redux/business/state/available_stock.dart';
import 'package:mobile_app_flutter_redux/client/utils/errors_and_exceptions.dart';

import '../dao.dart';

mixin GetInitialAppInfo implements Dao {
  //
  @override
  Future<IList<AvailableStock>> readAvailableStocks() async {
    throw NotYetImplementedError();
  }
}
