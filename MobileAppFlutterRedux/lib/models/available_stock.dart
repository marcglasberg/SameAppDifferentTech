import 'package:flutter/foundation.dart';

import 'stock.dart';
import 'utils/utils.dart';

@immutable
class AvailableStock {
  final String ticker;
  final String name;
  final double currentPrice;

  AvailableStock(
    this.ticker, {
    required this.name,
    required double currentPrice,
  }) : currentPrice = round(currentPrice);

  String get currentPriceStr => 'US\$ ${currentPrice.toStringAsFixed(2)}';

  AvailableStock withCurrentPrice(double price) =>
      AvailableStock(ticker, name: name, currentPrice: round(price));

  Stock toStock({int shares = 1}) {
    return Stock(
      ticker,
      howManyShares: shares,
      averagePrice: currentPrice,
    );
  }

  @override
  String toString() => '$ticker ($name)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AvailableStock &&
          runtimeType == other.runtimeType &&
          ticker == other.ticker &&
          name == other.name &&
          currentPrice == other.currentPrice;

  @override
  int get hashCode => ticker.hashCode ^ name.hashCode ^ currentPrice.hashCode;
}
