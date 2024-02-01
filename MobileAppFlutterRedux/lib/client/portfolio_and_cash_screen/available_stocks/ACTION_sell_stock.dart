import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/models/available_stock.dart';

class SellStock_Action extends AppAction {
  //
  final AvailableStock availableStock;
  final int howMany;

  SellStock_Action(
    this.availableStock, {
    required this.howMany,
  });

  @override
  AppState? reduce() {
    return state.copy(
      portfolio: state.portfolio.sell(availableStock, howMany: howMany),
    );
  }
}
