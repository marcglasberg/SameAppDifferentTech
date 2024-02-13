import 'package:i18n_extension/i18n_extension.dart';

extension Localization on String {
  static final _t = Translations("en_us") +
      {
        "en_us": "Buy",
        "es_es": "Comprar",
      } +
      {
        "en_us": "Sell",
        "es_es": "Vender",
      } +
      {
        "en_us": "shares".one("share"),
        "es_es": "acciones".one("acción"),
      } +
      {
        "en_us": "Cash Balance:",
        "es_es": "Efectivo:",
      } +
      {
        "en_us": "Portfolio:",
        "es_es": "Cartera:",
      };

  String get i18n => localize(this, _t);

  String plural(value) => localizePlural(value, this, _t);
}
