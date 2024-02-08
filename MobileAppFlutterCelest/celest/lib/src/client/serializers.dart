// ignore_for_file: type=lint, unused_local_variable, unnecessary_cast, unnecessary_import

import 'package:celest/celest.dart';
import 'package:celest_backend/my_src/models/available_stock.dart';
import 'package:fast_immutable_collections/src/ilist/ilist.dart';

final class AvailableStockSerializer extends Serializer<AvailableStock> {
  const AvailableStockSerializer();

  @override
  AvailableStock deserialize(Object? value) {
    final serialized = assertWireType<Map<String, Object?>>(value);
    return AvailableStock(
      (serialized[r'ticker'] as String),
      name: (serialized[r'name'] as String),
      currentPrice: (serialized[r'currentPrice'] as num).toDouble(),
    );
  }

  @override
  Map<String, Object?> serialize(AvailableStock value) => {
        r'ticker': value.ticker,
        r'name': value.name,
        r'currentPrice': value.currentPrice,
      };
}

final class IListAvailableStockSerializer
    extends Serializer<IList<AvailableStock>> {
  const IListAvailableStockSerializer();

  @override
  IList<AvailableStock> deserialize(Object? value) {
    final serialized = assertWireType<dynamic>(value);
    return IList<AvailableStock>.fromJson(
      serialized,
      (value) => Serializers.instance.deserialize<AvailableStock>(value),
    );
  }

  @override
  Object serialize(IList<AvailableStock> value) => value
      .toJson((value) => Serializers.instance.serialize<AvailableStock>(value));
}

final class Record$ma0bzgSerializer extends Serializer<Record$ma0bzg> {
  const Record$ma0bzgSerializer();

  @override
  Record$ma0bzg deserialize(Object? value) {
    final serialized = assertWireType<Map<String, Object?>>(value);
    return (
      price: (serialized[r'price'] as num).toDouble(),
      ticker: (serialized[r'ticker'] as String)
    );
  }

  @override
  Map<String, Object?> serialize(Record$ma0bzg value) => {
        r'price': value.price,
        r'ticker': value.ticker,
      };
}

typedef Record$ma0bzg = ({double price, String ticker});
