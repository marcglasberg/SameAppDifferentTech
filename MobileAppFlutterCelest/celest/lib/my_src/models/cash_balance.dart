import 'package:celest_backend/models.dart';
import 'package:celest_backend/src/client/serializers.dart';
import 'package:meta/meta.dart';

@immutable
class CashBalance {
  static const CashBalance ZERO = CashBalance._(0);

  final double amount;

  CashBalance(double amountX) : amount = amountX.isNaN ? 0 : round(amountX);

  const CashBalance._(this.amount);

  CashBalance withAmount(double amount) => CashBalance(round(amount));

  CashBalance add(double howMuch) {
    double newAmount = round(amount + howMuch);
    print('Added $howMuch. Cash balance is now: $newAmount.');
    return CashBalance(newAmount);
  }

  CashBalance remove(double howMuch) {
    double newAmount = round(amount - howMuch);
    if (newAmount < 0) newAmount = 0;
    print('Removed $howMuch. Cash balance is now: $newAmount.');
    return CashBalance(newAmount);
  }

  @override
  String toString() => 'US\$ ${amount.toStringAsFixed(2)}';

  Map<String, dynamic> toJsonPersistor() => const CashBalanceSerializer().serialize(this);

  factory CashBalance.fromJsonPersistor(Map<String, dynamic> value) =>
      const CashBalanceSerializer().deserialize(value);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CashBalance && runtimeType == other.runtimeType && amount == other.amount;

  @override
  int get hashCode => amount.hashCode;
}
