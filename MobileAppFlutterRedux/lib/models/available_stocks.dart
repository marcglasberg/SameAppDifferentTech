import 'package:collection/collection.dart';
import 'package:fast_immutable_collections/fast_immutable_collections.dart';

import 'available_stock.dart';

class AvailableStocks {
  static const AvailableStocks EMPTY = AvailableStocks._(IListConst([]));

  final IList<AvailableStock> list;

  AvailableStocks(Iterable<AvailableStock> list) : list = IList(list);

  const AvailableStocks._(this.list);

  AvailableStock? findBySymbolOrNull(String ticker) {
    return list.firstWhereOrNull((s) => s.ticker == ticker);
  }

  AvailableStock findBySymbol(String ticker) {
    final stock = findBySymbolOrNull(ticker);
    if (stock == null) throw Exception('Stock not found: $ticker');
    return stock;
  }

  void forEach(void Function(AvailableStock availableStock) callback) {
    list.forEach(callback);
  }

  AvailableStocks withAvailableStock(AvailableStock newAvailableStock) {
    final newList =
        list.map((s) => s.ticker == newAvailableStock.ticker ? newAvailableStock : s).toIList();

    return AvailableStocks(newList);
  }

  @override
  String toString() {
    return 'AvailableStocks: ${list.isEmpty ? 'empty' : list}';
  }
}
