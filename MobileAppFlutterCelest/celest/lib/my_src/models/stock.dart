import 'package:celest_backend/src/client/serializers.dart';
import 'package:meta/meta.dart';

import 'utils/json.dart';

/// Stocks the user has.
@immutable
class Stock {
  final String ticker;
  final int howManyShares;
  final double averagePrice;

  Stock(
    this.ticker, {
    required this.howManyShares,
    required this.averagePrice,
  });

  double get costBasis => howManyShares * averagePrice;

  String get averagePriceStr => 'US\$ ${averagePrice.toStringAsFixed(2)}';

  @override
  String toString() => '$howManyShares $ticker @$averagePrice';

  Json toJsonPersistor() => const StockSerializer().serialize(this);

  factory Stock.fromJsonPersistor(Object? value) => const StockSerializer().deserialize(value);

  // TODO: MARCELO
  // Map<String, dynamic> toJson() => {
  //       'ticker': ticker,
  //       'howManyShares': howManyShares,
  //       'averagePrice': averagePrice,
  //     };
  //
  // static Stock fromJson(Json json) {
  //   return Stock(
  //     json.asString('ticker')!,
  //     howManyShares: json.asInt('howManyShares')!,
  //     averagePrice: json.asDouble('averagePrice')!,
  //   );
  // }

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
