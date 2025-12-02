import 'package:i18n_extension/i18n_extension.dart';

extension Localization on String {
  static final _t = Translations.byText("en-US") +
      {
        "en-US": "Buy",
        "es-ES": "Comprar",
      } +
      {
        "en-US": "Sell",
        "es-ES": "Vender",
      } +
      {
        "en-US": "shares".one("share"),
        "es-ES": "acciones".one("acción"),
      } +
      {
        "en-US": "Cash Balance:",
        "es-ES": "Efectivo:",
      } +
      {
        "en-US": "Portfolio:",
        "es-ES": "Cartera:",
      };

  String get i18n => localize(this, _t);

  String plural(int value) => localizePlural(value, this, _t);
}
