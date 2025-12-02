import 'package:i18n_extension/i18n_extension.dart';

extension Localization on String {
  static final _t = Translations.byText("en-US") +
      {
        "en-US": "Stocks App Demo",
        "es-ES": "Demo de la App de Acciones",
      };

  String get i18n => localize(this, _t);
}
