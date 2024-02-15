// ignore_for_file: type=lint, unused_local_variable, unnecessary_cast, unnecessary_import

import 'package:celest/celest.dart';
import 'package:celest_backend/exceptions.dart';
import 'package:celest_backend/my_src/models/available_stock.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:celest_backend/my_src/models/portfolio.dart';
import 'package:celest_backend/my_src/models/stock.dart';
import 'package:fast_immutable_collections/src/ilist/ilist.dart';

final class CloudUserExceptionSerializer
    extends Serializer<CloudUserException> {
  const CloudUserExceptionSerializer();

  @override
  CloudUserException deserialize(Object? value) {
    final serialized = assertWireType<Map<String, Object?>>(value);
    return CloudUserException((serialized[r'msg'] as String));
  }

  @override
  Map<String, Object?> serialize(CloudUserException value) =>
      {r'msg': value.msg};
}

final class PortfolioSerializer extends Serializer<Portfolio> {
  const PortfolioSerializer();

  @override
  Portfolio deserialize(Object? value) {
    final serialized = assertWireType<Map<String, dynamic>?>(value);
    return Portfolio(
      stocks: ((serialized?[r'stocks'] as Iterable<Object?>?)
              ?.map((el) => Serializers.instance.deserialize<Stock>(el))
              .toList()) ??
          null,
      cashBalance: (Serializers.instance
              .deserialize<CashBalance?>(serialized?[r'cashBalance'])) ??
          CashBalance.ZERO,
    );
  }

  @override
  Map<String, dynamic> serialize(Portfolio value) => value.toJson();
}

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

final class CashBalanceSerializer extends Serializer<CashBalance> {
  const CashBalanceSerializer();

  @override
  CashBalance deserialize(Object? value) {
    final serialized = assertWireType<Map<String, Object?>>(value);
    return CashBalance((serialized[r'amount'] as num).toDouble());
  }

  @override
  Map<String, Object?> serialize(CashBalance value) =>
      {r'amount': value.amount};
}

final class StockSerializer extends Serializer<Stock> {
  const StockSerializer();

  @override
  Stock deserialize(Object? value) {
    final serialized = assertWireType<Map<String, Object?>>(value);
    return Stock(
      (serialized[r'ticker'] as String),
      howManyShares: (serialized[r'howManyShares'] as num).toInt(),
      averagePrice: (serialized[r'averagePrice'] as num).toDouble(),
    );
  }

  @override
  Map<String, Object?> serialize(Stock value) => {
        r'ticker': value.ticker,
        r'howManyShares': value.howManyShares,
        r'averagePrice': value.averagePrice,
      };
}

final class Record$z4p9fhSerializer extends Serializer<Record$z4p9fh> {
  const Record$z4p9fhSerializer();

  @override
  Record$z4p9fh deserialize(Object? value) {
    final serialized = assertWireType<Map<String, Object?>>(value);
    return (
      cashBalance: Serializers.instance
          .deserialize<CashBalance>(serialized[r'cashBalance']),
      stock: Serializers.instance.deserialize<Stock>(serialized[r'stock'])
    );
  }

  @override
  Map<String, Object?> serialize(Record$z4p9fh value) => {
        r'cashBalance':
            Serializers.instance.serialize<CashBalance>(value.cashBalance),
        r'stock': Serializers.instance.serialize<Stock>(value.stock),
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

typedef Record$z4p9fh = ({CashBalance cashBalance, Stock stock});
typedef Record$ma0bzg = ({double price, String ticker});
