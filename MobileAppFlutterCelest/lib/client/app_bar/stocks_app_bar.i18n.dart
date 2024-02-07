import 'package:i18n_extension/i18n_extension.dart';

extension Localization on String {
  static final _t = Translations("en_us") +
      {
        "en_us": "Stocks App Demo",
        "sp_es": "Demo de la App de Acciones",
      };

  String get i18n => localize(this, _t);
}
