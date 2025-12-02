import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/infra/dao/dao.dart';
import 'package:mobile_app_flutter_redux/client/utils/connectivity.dart';

class FluctuateStockPrice extends AppAction with CheckInternet, RespectRunConfig {
  //
  // Pass true to start the timer, false to stop it.
  final bool start;

  FluctuateStockPrice(this.start);

  @override
  AppState? reduce() {
    //
    if (start)
      DAO.startListeningToStockPriceUpdates(callback: startListeningToStockPriceUpdates);
    else
      DAO.stopListeningToStockPriceUpdates();

    return null;
  }

  void startListeningToStockPriceUpdates({
    required String ticker,
    required double price,
  }) {
    dispatch(SetStockPrice(ticker, price));
  }

  @override
  String toString() => 'FluctuateStockPrice($start)';
}

class SetStockPrice extends AppAction {
  //
  final String ticker;
  final double price;

  SetStockPrice(this.ticker, this.price);

  @override
  AppState? reduce() {
    var availableStock = state.availableStocks.findBySymbolOrNull(ticker);

    // We ignore the price update if the stock is not already found in the state.
    if (availableStock == null)
      return null;
    //
    // Update the stock price.
    else {
      var newStock = availableStock.withCurrentPrice(price);

      return state.copy(
        availableStocks: state.availableStocks.withAvailableStock(newStock),
      );
    }
  }

  @override
  String toString() => 'SetStockPrice($ticker, $price)';
}
