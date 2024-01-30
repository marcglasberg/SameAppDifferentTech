import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:mobile_app_flutter_redux/business/infra/dao/simulated_dao/sim_backend.dart';
import 'package:mobile_app_flutter_redux/business/state/available_stock.dart';

import '../dao.dart';

class _Stock {
  final String ticker;
  final String name;
  double price;

  _Stock(this.ticker, this.name, this.price);
}

mixin GetInitialAppInfo implements Dao {
  //
  static List<_Stock> stocks = [
    _Stock('IBM', 'International Business Machines', 132.64),
    _Stock('AAPL', 'Apple', 183.58),
    _Stock('GOOG', 'Alphabet', 126.63),
    _Stock('AMZN', 'Amazon', 125.30),
    _Stock('META', 'Meta Platforms', 271.39),
    _Stock('INTC', 'Intel', 29.86),
  ];

  @override
  Future<IList<AvailableStock>> readAvailableStocks() async {
    await simulatesWaiting(250);

    print('Just read ${stocks.length} stocks.');

    return stocks
        .map((stock) => AvailableStock(
              stock.ticker,
              name: stock.name,
              currentPrice: stock.price,
            ))
        .toIList();
  }
}
