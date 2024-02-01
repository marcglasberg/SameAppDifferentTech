// ignore_for_file: prefer_const_constructors

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/client/infra/navigation/base_screen_chooser.dart';
import 'package:mobile_app_flutter_redux/models/ui.dart';

void main() {
  test('should toggle dark mode', () {
    var ui = Ui(isDarkMode: false);
    ui = ui.toggleLightAndDarkMode();
    expect(ui.isDarkMode, true);

    ui = ui.toggleLightAndDarkMode();
    expect(ui.isDarkMode, false);
  });

  test('Copy', () {
    var ui = Ui(isDarkMode: true, screenChoice: ScreenChoice.portfolioAndCashBalance);
    var copiedUi = ui.copy();
    expect(copiedUi.isDarkMode, ui.isDarkMode);
    expect(copiedUi.screenChoice, ui.screenChoice);

    ui = Ui(isDarkMode: false, screenChoice: ScreenChoice.portfolioAndCashBalance);
    copiedUi = ui.copy(isDarkMode: true, screenChoice: ScreenChoice.configuration);
    expect(copiedUi.isDarkMode, true);
    expect(copiedUi.screenChoice, ScreenChoice.configuration);
  });

  test('toJson', () {
    final ui = Ui(isDarkMode: true, screenChoice: ScreenChoice.portfolioAndCashBalance);
    final json = ui.toJson();
    expect(json, {'isDarkMode': true});
  });

  test('fromJson', () {
    final json = {'isDarkMode': true};
    var ui = Ui.fromJson(json);
    expect(ui.isDarkMode, true);
    expect(ui.screenChoice, Ui.DEFAULT.screenChoice);

    ui = Ui.fromJson(null);
    expect(ui.isDarkMode, Ui.DEFAULT.isDarkMode);
    expect(ui.screenChoice, Ui.DEFAULT.screenChoice);
  });

  test('Equality', () {
    var ui1 = Ui(isDarkMode: true, screenChoice: ScreenChoice.portfolioAndCashBalance);
    var ui2 = Ui(isDarkMode: true, screenChoice: ScreenChoice.portfolioAndCashBalance);
    expect(ui1, ui2);
    ui2 = Ui(isDarkMode: false, screenChoice: ScreenChoice.configuration);
    expect(ui1, isNot(ui2));
  });

  test('HashCode', () {
    var ui1 = Ui(isDarkMode: true, screenChoice: ScreenChoice.portfolioAndCashBalance);
    var ui2 = Ui(isDarkMode: true, screenChoice: ScreenChoice.portfolioAndCashBalance);
    expect(ui1.hashCode, ui2.hashCode);

    ui2 = Ui(isDarkMode: false, screenChoice: ScreenChoice.configuration);
    expect(ui1.hashCode, isNot(ui2.hashCode));
  });

  test('fromJson with missing key', () {
    final json = {'missingKey': true};
    var ui = Ui.fromJson(json);
    expect(ui.isDarkMode, Ui.DEFAULT.isDarkMode);
    expect(ui.screenChoice, Ui.DEFAULT.screenChoice);
  });
}
