// ignore_for_file: type=lint, unused_local_variable, unnecessary_cast, unnecessary_import

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:async_redux_core/src/user_exception.dart' as _$user_exception;
import 'package:celest/celest.dart';
import 'package:celest_backend/my_src/models/available_stock.dart'
    as _$available_stock;
import 'package:celest_backend/my_src/models/cash_balance.dart'
    as _$cash_balance;
import 'package:celest_backend/my_src/models/portfolio.dart' as _$portfolio;
import 'package:celest_backend/my_src/models/stock.dart' as _$stock;
import 'package:celest_core/src/exception/cloud_exception.dart';
import 'package:celest_core/src/exception/serialization_exception.dart';
import 'package:fast_immutable_collections/src/ilist/ilist.dart' as _$ilist;

void initSerializers() {
  Serializers.instance
      .put(Serializer.define<Record$z4p9fh, Map<String, Object?>>(
    serialize: ($value) => {
      r'cashBalance': Serializers.instance
          .serialize<_$cash_balance.CashBalance>($value.cashBalance),
      r'stock': Serializers.instance.serialize<_$stock.Stock>($value.stock),
    },
    deserialize: ($serialized) {
      return (
        cashBalance: Serializers.instance
            .deserialize<_$cash_balance.CashBalance>(
                $serialized[r'cashBalance']),
        stock: Serializers.instance
            .deserialize<_$stock.Stock>($serialized[r'stock'])
      );
    },
  ));
  Serializers.instance
      .put(Serializer.define<Record$ma0bzg, Map<String, Object?>>(
    serialize: ($value) => {
      r'price': $value.price,
      r'ticker': $value.ticker,
    },
    deserialize: ($serialized) {
      return (
        price: ($serialized[r'price'] as num).toDouble(),
        ticker: ($serialized[r'ticker'] as String)
      );
    },
  ));
  Serializers.instance.put(
      Serializer.define<_$user_exception.UserException, Map<String, Object?>>(
    serialize: ($value) => {
      r'message': $value.message,
      r'code': $value.code,
      r'reason': $value.reason,
    },
    deserialize: ($serialized) {
      return _$user_exception.UserException(
        ($serialized[r'message'] as String?),
        code: ($serialized[r'code'] as num?)?.toInt(),
        reason: ($serialized[r'reason'] as String?),
      );
    },
  ));
  Serializers.instance.put(
      Serializer.define<_$available_stock.AvailableStock, Map<String, Object?>>(
    serialize: ($value) => {
      r'ticker': $value.ticker,
      r'name': $value.name,
      r'currentPrice': $value.currentPrice,
    },
    deserialize: ($serialized) {
      return _$available_stock.AvailableStock(
        ($serialized[r'ticker'] as String),
        name: ($serialized[r'name'] as String),
        currentPrice: ($serialized[r'currentPrice'] as num).toDouble(),
      );
    },
  ));
  Serializers.instance
      .put(Serializer.define<_$cash_balance.CashBalance, Map<String, Object?>>(
    serialize: ($value) => {r'amount': $value.amount},
    deserialize: ($serialized) {
      return _$cash_balance.CashBalance(
          ($serialized[r'amount'] as num).toDouble());
    },
  ));
  Serializers.instance
      .put(Serializer.define<_$portfolio.Portfolio, Map<String, dynamic>>(
    serialize: ($value) => $value.toJson(),
    deserialize: ($serialized) {
      return _$portfolio.Portfolio.fromJson($serialized);
    },
  ));
  Serializers.instance
      .put(Serializer.define<_$stock.Stock, Map<String, Object?>>(
    serialize: ($value) => {
      r'ticker': $value.ticker,
      r'howManyShares': $value.howManyShares,
      r'averagePrice': $value.averagePrice,
    },
    deserialize: ($serialized) {
      return _$stock.Stock(
        ($serialized[r'ticker'] as String),
        howManyShares: ($serialized[r'howManyShares'] as num).toInt(),
        averagePrice: ($serialized[r'averagePrice'] as num).toDouble(),
      );
    },
  ));
  Serializers.instance
      .put(Serializer.define<BadRequestException, Map<String, Object?>>(
    serialize: ($value) => {r'message': $value.message},
    deserialize: ($serialized) {
      return BadRequestException(($serialized[r'message'] as String));
    },
  ));
  Serializers.instance
      .put(Serializer.define<InternalServerException, Map<String, Object?>>(
    serialize: ($value) => {r'message': $value.message},
    deserialize: ($serialized) {
      return InternalServerException(($serialized[r'message'] as String));
    },
  ));
  Serializers.instance
      .put(Serializer.define<UnauthorizedException, Map<String, Object?>?>(
    serialize: ($value) => {r'message': $value.message},
    deserialize: ($serialized) {
      return UnauthorizedException(
          (($serialized?[r'message'] as String?)) ?? 'Unauthorized');
    },
  ));
  Serializers.instance
      .put(Serializer.define<SerializationException, Map<String, Object?>>(
    serialize: ($value) => {
      r'message': $value.message,
      r'offset': $value.offset,
      r'source': $value.source,
    },
    deserialize: ($serialized) {
      return SerializationException(($serialized[r'message'] as String));
    },
  ));
  Serializers.instance.put(Serializer.define<
      _$ilist.IList<_$available_stock.AvailableStock>, dynamic>(
    serialize: ($value) => $value.toJson((value) => Serializers.instance
        .serialize<_$available_stock.AvailableStock>(value)),
    deserialize: ($serialized) {
      return _$ilist.IList<_$available_stock.AvailableStock>.fromJson(
        $serialized,
        (value) => Serializers.instance
            .deserialize<_$available_stock.AvailableStock>(value),
      );
    },
  ));
}

typedef Record$ma0bzg = ({double price, String ticker});
typedef Record$z4p9fh = ({
  _$cash_balance.CashBalance cashBalance,
  _$stock.Stock stock
});
