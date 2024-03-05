import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/utils/json.dart';
import 'package:meta/meta.dart';

@immutable
class CashBalance {
  static const CashBalance ZERO = CashBalance._(0);

  final double amount;

  CashBalance(double amount) : amount = amount.isNaN ? 0 : round(amount);

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

  Object? toJsonPersistor() => serialize<CashBalance>(this);

  factory CashBalance.fromJsonPersistor(Object? value) => deserialize<CashBalance>(value);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CashBalance && runtimeType == other.runtimeType && amount == other.amount;

  @override
  int get hashCode => amount.hashCode;
}
