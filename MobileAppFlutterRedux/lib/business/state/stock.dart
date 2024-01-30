import 'package:flutter/foundation.dart';

/// Stocks the user has.
@immutable
class Stock {
  final String ticker;
  final int howManyShares;
  final double averagePrice;

  Stock({
    required this.ticker,
    required this.howManyShares,
    required this.averagePrice,
  });

  double get costBasis => howManyShares * averagePrice;

  String get averagePriceStr => 'US\$ ${averagePrice.toStringAsFixed(2)}';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Stock &&
          runtimeType == other.runtimeType &&
          ticker == other.ticker &&
          howManyShares == other.howManyShares &&
          averagePrice == other.averagePrice;

  @override
  int get hashCode => ticker.hashCode ^ howManyShares.hashCode ^ averagePrice.hashCode;
}
