import 'package:i18n_extension/i18n_extension.dart';

extension Localization on String {
  static final _t = Translations("en_us") +
      {
        "en_us": "Buy",
        "sp_es": "Comprar",
      } +
      {
        "en_us": "Sell",
        "sp_es": "Vender",
      } +
      {
        "en_us": "shares".one("share"),
        "sp_es": "acciones".one("acción"),
      } +
      {
        "en_us": "Cash Balance:",
        "sp_es": "Efectivo:",
      } +
      {
        "en_us": "Portfolio:",
        "sp_es": "Cartera:",
      };

  String get i18n => localize(this, _t);

  String plural(value) => localizePlural(value, this, _t);
}
