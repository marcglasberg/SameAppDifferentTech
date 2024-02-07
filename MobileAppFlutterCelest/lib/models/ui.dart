import 'package:mobile_app_flutter_celest/client/infra/navigation/base_screen_chooser.dart';
import 'package:mobile_app_flutter_celest/models/utils/map_deserialization_extension.dart';

class Ui {
  final bool isDarkMode;
  final ScreenChoice screenChoice;

  static const DEFAULT = Ui(isDarkMode: false);

  const Ui({
    required this.isDarkMode,
    this.screenChoice = ScreenChoice.portfolioAndCashBalance,
  });

  Ui toggleLightAndDarkMode() => copy(isDarkMode: !isDarkMode);

  Ui copy({
    bool? isDarkMode,
    ScreenChoice? screenChoice,
  }) =>
      Ui(
        isDarkMode: isDarkMode ?? this.isDarkMode,
        screenChoice: screenChoice ?? this.screenChoice,
      );

  @override
  String toString() => 'Ui{isDarkMode: $isDarkMode, screenChoice: $screenChoice}';

  /// Don't include [screenChoice].
  Map<String, dynamic> toJson() => {
        'isDarkMode': isDarkMode,
      };

  /// Don't include [screenChoice].
  static Ui fromJson(Json? json) {
    if (json == null)
      return Ui.DEFAULT;
    else {
      bool isDarkMode = json.asBool('isDarkMode') ?? false;
      return Ui(isDarkMode: isDarkMode);
    }
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Ui &&
          runtimeType == other.runtimeType &&
          isDarkMode == other.isDarkMode &&
          screenChoice == other.screenChoice;

  @override
  int get hashCode => isDarkMode.hashCode ^ screenChoice.hashCode;
}
