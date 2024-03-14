@public
import 'dart:math';

import 'package:celest/celest.dart';
import 'package:celest_backend/models.dart';
import 'package:fast_immutable_collections/fast_immutable_collections.dart';

import 'database.dart';

Future<IList<AvailableStock>> readAvailableStocks() async {
  print('Just read ${db.availableStocks.length} stocks.');
  return db.availableStocks.map(AvailableStock.from).toIList();
}

/// This function selects a random ticker, updates its price (with some random variation)
/// and returns the updated ticker/price pair.
///
/// For the moment, Celest has no features to read directly from a database with a websocket,
/// so I've created this functions to help me simulate this. As soon as Celest has websockets to
/// the database I'm going to remove this function and replace it with the real thing.
///
/// Note I'll also have to simulate the websocket client in the frontend code, to use
/// this function and convert it to a stream of values.
///
Future<({String ticker, double price})?> readUpdatedStockPrice() async {
  final List<({String ticker, String name, double price})> stocks = db.availableStocks;
  if (stocks.isEmpty) return null;

  final randomIndex = Random().nextInt(stocks.length);
  final randomStock = stocks[randomIndex];

  double newPrice = (randomStock.price + (Random().nextDouble() * 2 - 1) / 4).toDouble();

  newPrice = max(1, min(newPrice, 1000));

  stocks[randomIndex] = (
    ticker: randomStock.ticker,
    name: randomStock.ticker,
    price: newPrice,
  );

  return (ticker: randomStock.ticker, price: newPrice);
}
