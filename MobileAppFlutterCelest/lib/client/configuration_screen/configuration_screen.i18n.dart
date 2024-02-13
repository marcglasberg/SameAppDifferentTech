import 'package:i18n_extension_core/i18n_extension_core.dart';

extension Localization on String {
  static final _t = Translations.byLocale("en_us") +
      {
        "en_us": {
          'Configuration': 'Configuration',
          'Light mode': 'Light mode',
          'Dark mode': 'Dark mode',
          'Run Configuration': 'Run Configuration',
          'Show Run Configuration': 'Show Run Configuration',
          'A/B Testing': 'A/B Testing',
          'Simulation is ON': 'Simulation is ON',
          'Simulation is OFF': 'Simulation is OFF',
          'Done': 'Done',
          'Missing translation keys': 'Missing translation keys',
          'Missing translations': 'Missing translations',
        },
        "sp_es": {
          'Configuration': 'Configuración',
          'Light mode': 'Modo claro',
          'Dark mode': 'Modo oscuro',
          'Run Configuration': 'Configuración de Ejecución',
          'Show Run Configuration': 'Mostrar Configuración de Ejecución',
          'A/B Testing': 'Pruebas A/B',
          'Simulation is ON': 'Simulación ACTIVADA',
          'Simulation is OFF': 'Simulación DESACTIVADA',
          'Done': 'Guardar',
          'Missing translation keys': 'Claves de traducción faltantes',
          'Missing translations': 'Traducciones faltantes',
        }
      };

  String get i18n => localize(this, _t);
}
