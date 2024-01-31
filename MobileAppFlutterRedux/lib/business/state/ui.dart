import 'package:mobile_app_flutter_redux/business/utils/map_deserialization_extension.dart';

class Ui {
  final bool isDarkMode;

  static const DEFAULT = Ui(isDarkMode: false);

  const Ui({
    required this.isDarkMode,
  });

  Ui toggleLightAndDarkMode() => copy(isDarkMode: !isDarkMode);

  Ui copy({bool? isDarkMode}) => Ui(isDarkMode: isDarkMode ?? this.isDarkMode);

  @override
  String toString() => 'Ui{isDarkMode: $isDarkMode}';

  Map<String, dynamic> toJson() => {
        'isDarkMode': isDarkMode,
      };

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
      other is Ui && runtimeType == other.runtimeType && isDarkMode == other.isDarkMode;

  @override
  int get hashCode => isDarkMode.hashCode;
}
