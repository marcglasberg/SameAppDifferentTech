class Ui {
  final bool isDarkMode;

  static const DEFAULT = Ui(isDarkMode: false);

  const Ui({
    required this.isDarkMode,
  });

  Ui toggleLightAndDarkMode() {
    return copy(
      isDarkMode: !isDarkMode,
    );
  }

  Ui copy({bool? isDarkMode}) {
    return Ui(
      isDarkMode: isDarkMode ?? this.isDarkMode,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Ui && runtimeType == other.runtimeType && isDarkMode == other.isDarkMode;

  @override
  int get hashCode => isDarkMode.hashCode;
}
