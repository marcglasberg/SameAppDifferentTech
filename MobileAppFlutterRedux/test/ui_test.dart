// ignore_for_file: prefer_const_constructors

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/business/state/ui.dart';

void main() {
  test('should toggle dark mode', () {
    var ui = Ui(isDarkMode: false);
    ui = ui.toggleLightAndDarkMode();
    expect(ui.isDarkMode, true);

    ui = ui.toggleLightAndDarkMode();
    expect(ui.isDarkMode, false);
  });

  test('Copy', () {
    var ui = Ui(isDarkMode: true);
    var copiedUi = ui.copy();
    expect(copiedUi.isDarkMode, ui.isDarkMode);

    ui = Ui(isDarkMode: false);
    copiedUi = ui.copy(isDarkMode: true);
    expect(copiedUi.isDarkMode, true);
  });

  test('toJson', () {
    final ui = Ui(isDarkMode: true);
    final json = ui.toJson();
    expect(json, {'isDarkMode': true});
  });

  test('fromJson', () {
    final json = {'isDarkMode': true};
    var ui = Ui.fromJson(json);
    expect(ui.isDarkMode, true);

    ui = Ui.fromJson(null);
    expect(ui.isDarkMode, Ui.DEFAULT.isDarkMode);
  });

  test('Equality', () {
    var ui1 = Ui(isDarkMode: true);
    var ui2 = Ui(isDarkMode: true);
    expect(ui1, ui2);

    ui2 = Ui(isDarkMode: false);
    expect(ui1, isNot(ui2));
  });

  test('HashCode', () {
    var ui1 = Ui(isDarkMode: true);
    var ui2 = Ui(isDarkMode: true);
    expect(ui1.hashCode, ui2.hashCode);

    ui2 = Ui(isDarkMode: false);
    expect(ui1.hashCode, isNot(ui2.hashCode));
  });

  test('fromJson with missing key', () {
    final json = {'missingKey': true};
    var ui = Ui.fromJson(json);
    expect(ui.isDarkMode, Ui.DEFAULT.isDarkMode);
  });
}
