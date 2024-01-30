import 'package:collection/collection.dart';
import 'package:flutter/foundation.dart';

import 'available_stock.dart';

@immutable
class AvailableStocks {
  final List<AvailableStock> list;

  AvailableStocks({
    required this.list,
  });

  AvailableStock findBySymbol(String ticker) {
    AvailableStock? stock = list.firstWhereOrNull((s) => s.ticker == ticker);
    if (stock == null) throw Exception('Stock not found: $ticker');
    return stock;
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is AvailableStocks &&
              runtimeType == other.runtimeType &&
              list == other.list;

  @override
  int get hashCode => list.hashCode;
}
