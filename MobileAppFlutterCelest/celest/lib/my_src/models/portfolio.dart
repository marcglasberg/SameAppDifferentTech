import 'package:async_redux_core/async_redux_core.dart';
import 'package:celest_backend/exceptions.dart';
import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/buy_or_sell.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:celest_backend/my_src/models/utils/map_deserialization_extension.dart';
import 'package:collection/collection.dart';
import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:i18n_extension_core/default.i18n.dart';
import 'package:meta/meta.dart';

import 'utils/json.dart';

@immutable
class Portfolio {
  static const Portfolio EMPTY = Portfolio._();

  final IList<Stock> stocks;
  final CashBalance cashBalance;

  Portfolio({
    Iterable<Stock>? stocks,
    this.cashBalance = CashBalance.ZERO,
  }) : stocks = IList.orNull(stocks) ?? const IListConst([]);

  const Portfolio._()
      : stocks = const IListConst([]),
        cashBalance = CashBalance.ZERO;

  Portfolio copyWith({
    Iterable<Stock>? stocks,
    CashBalance? cashBalance,
  }) {
    return Portfolio(
      stocks: (stocks != null) ? stocks.toIList() : this.stocks,
      cashBalance: cashBalance ?? this.cashBalance,
    );
  }

  bool get isEmpty => stocks.isEmpty;

  Portfolio withCashBalance(CashBalance newCashBalance) => copyWith(cashBalance: newCashBalance);

  Portfolio addCashBalance(double howMuch) => copyWith(cashBalance: cashBalance.add(howMuch));

  Portfolio removeCashBalance(double howMuch) {
    if (cashBalance.amount < howMuch) {
      throw UserException('Not enough money to remove.'.i18n);
    }

    return copyWith(cashBalance: cashBalance.remove(howMuch));
  }

  Portfolio withoutStock(String ticker) => withStock(ticker, 0, 0.0);

  Portfolio withAddedStock(AvailableStock availableStock, int howMany) {
    final pos = _getStockPositionInList(availableStock);
    List<Stock> newStocks;

    if (pos == -1) {
      newStocks = [...stocks, availableStock.toStock(shares: howMany)];
    } else {
      final stock = stocks[pos];
      final newShares = stock.howManyShares + howMany;
      final newAveragePrice = round(
          ((stock.howManyShares * stock.averagePrice) + (howMany * availableStock.currentPrice)) /
              newShares);

      newStocks = [...stocks];
      newStocks[pos] = Stock(
        stock.ticker,
        howManyShares: newShares,
        averagePrice: newAveragePrice,
      );
    }

    return copyWith(stocks: newStocks);
  }

  Portfolio withoutStocks() {
    return copyWith(stocks: []);
  }

  Portfolio withStock(String ticker, int quantity, double averagePrice) {
    final newStocks = stocks.where((stock) => stock.ticker != ticker).toList();

    if (quantity > 0) {
      final newStock = Stock(ticker, howManyShares: quantity, averagePrice: averagePrice);
      newStocks.add(newStock);
    }

    return copyWith(stocks: newStocks);
  }

  int howManyStocks(String ticker) {
    final stock = getStockOrNull(ticker);
    return stock?.howManyShares ?? 0;
  }

  Stock getStock(String ticker) {
    final stock = getStockOrNull(ticker);
    if (stock == null) {
      throw UserException('Stock %s not found.'.i18n.fill([ticker]));
    }
    return stock;
  }

  Stock? getStockOrNull(String ticker) {
    return stocks.firstWhereOrNull((stock) => stock.ticker == ticker);
  }

  bool hasStock(AvailableStock availableStock) {
    return _getStockPositionInList(availableStock) != -1;
  }

  bool hasMoneyToBuyStock(AvailableStock availableStock) {
    return cashBalance.amount >= availableStock.currentPrice;
  }

  Portfolio buyOrSell(BuyOrSell buyOrSell, AvailableStock availableStock, int howMany) {
    return (buyOrSell == BuyOrSell.buy)
        ? buy(availableStock, howMany: howMany)
        : sell(availableStock, howMany: howMany);
  }

  /// Buys [howMany] shares of [availableStock].
  /// If the user does not have enough money, throws a [UserException].
  Portfolio buy(AvailableStock availableStock, {required int howMany}) {
    if (cashBalance.amount < availableStock.currentPrice * howMany) {
      throw UserException('Not enough money to buy stock'.i18n);
    } else {
      final newCashBalance =
          CashBalance(cashBalance.amount - availableStock.currentPrice * howMany);
      final newPortfolio = withAddedStock(availableStock, howMany);
      return newPortfolio.copyWith(cashBalance: newCashBalance);
    }
  }

  /// Sells [howMany] shares of [availableStock].
  /// If the user does not own the stock, or does not own enough shares, throws a [UserException].
  /// This exception will be shown to the user in a dialog.
  Portfolio sell(AvailableStock availableStock, {required int howMany}) {
    final pos = _getStockPositionInList(availableStock);

    if (pos == -1) {
      throw UserException('Cannot sell stock you do not own'.i18n);
    } else {
      final stock = stocks[pos];

      if (stock.howManyShares < howMany) {
        throw UserException('Cannot sell %d shares of stock you do not own'.i18n.fill([howMany]));
      } else {
        final newShares = stock.howManyShares - howMany;
        final newAveragePrice = round(
            ((stock.howManyShares * stock.averagePrice) - (howMany * availableStock.currentPrice)) /
                newShares);

        var newStocks = [...stocks];
        newStocks[pos] = Stock(
          stock.ticker,
          howManyShares: newShares,
          averagePrice: newAveragePrice,
        );

        if (newShares == 0) {
          newStocks = newStocks.where((stock) => stock.ticker != availableStock.ticker).toList();
        }

        final newCashBalance =
            CashBalance(cashBalance.amount + availableStock.currentPrice * howMany);
        return copyWith(stocks: newStocks, cashBalance: newCashBalance);
      }
    }
  }

  int _getStockPositionInList(AvailableStock availableStock) {
    return stocks.indexWhere((stock) => stock.ticker == availableStock.ticker);
  }

  double get totalCostBasis {
    return stocks.fold(0.0, (sum, stock) => sum + stock.costBasis) + cashBalance.amount;
  }

  @override
  String toString() => 'Portfolio{stocks: $stocks, cashBalance: $cashBalance}';

  Map<String, dynamic> toJson() => {
        'stocks': stocks.map((stock) => stock.toJsonPersistor()).toList(),
        'cashBalance': cashBalance.toJsonPersistor(),
      };

  static Portfolio fromJson(Json? json) {
    if (json == null)
      return Portfolio.EMPTY;
    else {
      IList<Stock> stocks = json.asIListOf('stocks', Stock.fromJsonPersistor);
      CashBalance cashBalance = json.asCashBalance('cashBalance') ?? CashBalance.ZERO;
      return Portfolio(stocks: stocks, cashBalance: cashBalance);
    }
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Portfolio &&
          runtimeType == other.runtimeType &&
          stocks == other.stocks &&
          cashBalance == other.cashBalance;

  @override
  int get hashCode => stocks.hashCode ^ cashBalance.hashCode;
}
