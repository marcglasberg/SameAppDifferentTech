import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/business/state/available_stock.dart';

Dao get DAO => RunConfig.instance.dao;

abstract class Dao {
  //
  /// Initializes the DAO, if necessary.
  /// This is called in the app's initialization.
  Future<void> init();

  // Read the current list of available stocks from the backend.
  Future<IList<AvailableStock>> readAvailableStocks();

  /// Continuously get stock price updates from the backend.
  Future<void> startListeningToStockPriceUpdates({required PriceUpdate callback});

  /// Stop getting stock price updates from the backend.
  Future<void> stopListeningToStockPriceUpdates();
}

/// If the DAO cannot complete because of an error, it must throw this error.
class DaoGeneralError extends BackendError {
  DaoGeneralError([String? msg]) : super(msg);
}

/// If the DAO times out, it must throw this error.
class DaoTimeoutError extends BackendError {
  DaoTimeoutError() : super('The information could not be retrieved. Please, try again.');
}

class BackendError extends Error {
  final String? msg;

  BackendError([this.msg]);

  @override
  String toString() => '$runtimeType{msg: $msg}';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BackendError && runtimeType == other.runtimeType && msg == other.msg;

  @override
  int get hashCode => msg.hashCode;
}

typedef PriceUpdate = void Function({
  required String ticker,
  required double price,
});
