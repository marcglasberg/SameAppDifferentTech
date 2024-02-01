// ignore_for_file: prefer_const_constructors

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/models/cash_balance.dart';

void main() {
  test('add', () {
    var cashBalance = CashBalance(100.0);
    cashBalance = cashBalance.add(50.0);
    expect(cashBalance.amount, 150.0);
  });

  test('remove', () {
    var cashBalance = CashBalance(100.0);
    cashBalance = cashBalance.remove(50.0);
    expect(cashBalance.amount, 50.0);
  });

  test('add negative', () {
    var cashBalance = CashBalance(100.0);
    cashBalance = cashBalance.add(-50.0);
    expect(cashBalance.amount, 50.0);
  });

  test('remove more than balance', () {
    var cashBalance = CashBalance(100.0);
    cashBalance = cashBalance.remove(150.0);
    expect(cashBalance.amount, 0.0);
  });

  test('remove negative', () {
    var cashBalance = CashBalance(100.0);
    cashBalance = cashBalance.remove(-50.0);
    expect(cashBalance.amount, 150.0);
  });

  test('constructor with NaN', () {
    var cashBalance = CashBalance(double.nan);
    expect(cashBalance.amount, 0.0);
  });

  test('constructor with negative', () {
    var cashBalance = CashBalance(-100.0);
    expect(cashBalance.amount, -100.0); // or 0.0 if negative amounts should not be allowed.
  });

  test('toJson', () {
    final cashBalance = CashBalance(100.0);
    final json = cashBalance.toJson();
    expect(json, {'amount': 100.0});
  });

  test('fromJson', () {
    final json = {'amount': 100.0};
    var cashBalance = CashBalance.fromJson(json);
    expect(cashBalance.amount, 100.0);
  });

  test('Equality', () {
    var cashBalance1 = CashBalance(100.0);
    var cashBalance2 = CashBalance(100.0);
    expect(cashBalance1, cashBalance2);

    cashBalance2 = CashBalance(101.0);
    expect(cashBalance1, isNot(cashBalance2));
  });

  test('HashCode', () {
    var cashBalance1 = CashBalance(100.0);
    var cashBalance2 = CashBalance(100.0);
    expect(cashBalance1.hashCode, cashBalance2.hashCode);

    cashBalance2 = CashBalance(101.0);
    expect(cashBalance1.hashCode, isNot(cashBalance2.hashCode));
  });
}
