import 'dart:io';
import "dart:math";

import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:collection/collection.dart';
import "package:flutter/material.dart";
import 'package:flutter/services.dart';

// TODO: DONT REMOVE
// Future<void> sendEmail(String emailAddress, {String? subject}) async {
//   //
//   final Uri emailLaunchUri = _emailUri(emailAddress, assunto: subject);
//
//   bool ifItWorked;
//   try {
//     // Method canLaunchUrl can return false even if launchUrl would work in some circumstances.
//     // It is better to use launchUrl directly and handle failure.
//     ifItWorked = await launchUrl(emailLaunchUri);
//   } catch (error) {
//     ifItWorked = false;
//   }
//
//   if (!ifItWorked)
//     DefaultDialog.ok(
//         titulo: "Não foi possível abrir seu leitor de email",
//         texto: "Por favor, faça isso manualmente.");
// }
//
// Uri _emailUri(String emailAddress, {String? subject}) => Uri(
//       scheme: 'mailto',
//       path: emailAddress,
//       query:
//           (subject == null) ? null : _encodeQueryParameters(<String, String>{'subject': subject}),
//     );
//
// /// Used with [launchUrl]. Exemple:
// ///
// /// ```
// /// final Uri emailLaunchUri = Uri(
// ///     scheme: 'mailto',
// ///     path: 'smith@example.com',
// ///     query: encodeQueryParameters(<String, String>{
// ///       'subject': 'Example Subject & Symbols are allowed!',
// ///     }));
// /// launchUrl(emailLaunchUri);
// /// ```
// ///
// String? _encodeQueryParameters(Map<String, String> params) {
//   return params.entries
//       .map((MapEntry<String, String> e) =>
//           '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
//       .join('&');
// }

extension IterableUtilExtension<T> on Iterable<T> {
  //
  /// Performs a .join("\n"), but with an indentation of [ident] spaces.
  /// If Iterable has items, it includes [ini] and [end]. If Iterable is
  /// empty, it does not include ini or end.
  String listIt({int ident = 3, String ini = "", String end = ""}) => //
      "${length == 0 ? '' : ini}"
      "${space * ident}"
      "${join('\n${space * ident}')}"
      "${length == 0 ? '' : end}";
}

extension WidgetExtension<T> on Widget {
  //
  Widget pad({
    double all = 0.0,
    double vertical = 0.0,
    double horizontal = 0.0,
    double left = 0.0,
    double top = 0.0,
    double right = 0.0,
    double bottom = 0.0,
  }) =>
      Padding(
          padding: Pad(
            all: all,
            vertical: vertical,
            horizontal: horizontal,
            left: left,
            top: top,
            right: right,
            bottom: bottom,
          ),
          child: this);
}

extension FutureExtension<T> on Future<T?> {
  /// Waits at most [millis] for the future to complete.
  /// After this time has passed, it continues execution, without getting the future's value,
  /// but it DOES NOT interrupt the future (which keeps running).
  /// Note: After this time, in case of an error, the stacktrace will be lost.
  Future<T?> continueAfterMillis(int millis) => timeout(
        Duration(milliseconds: millis),
        onTimeout: () {
          return null;
        },
      );
}

/// It can return a widget, or null. See also [WidgetBuilder].
typedef WidgetBuilderNullable = Widget? Function(BuildContext context);

class BuilderNullable extends StatelessWidget {
  //
  const BuilderNullable({
    Key? key,
    required this.builder,
  }) : super(key: key);

  /// Called to obtain the child widget.
  ///
  /// This function is called whenever this widget is included in its parent's
  /// build and the old widget (if any) that it synchronizes with has a distinct
  /// object identity. Typically the parent's build method will construct
  /// a new tree of widgets and so a new Builder child will not be [identical]
  /// to the corresponding old one.
  final WidgetBuilderNullable? builder;

  @override
  Widget build(BuildContext context) => (builder == null) //
      ? const SizedBox()
      : builder!(context) ?? const SizedBox();
}

const String space = " ";
const String twoSpaces = "$space$space";
const String threeSpaces = "$space$space$space";

extension DoubleExtension on double? {
  //
  /// Will apply the [calculation] if the value is NOT null.
  /// If the [calculation] is not provided, return `toInt`.
  /// However, if the value is null, return null.
  int? toIntOrNull<T extends num>([int Function(double)? calculation]) {
    return (this == null) ? null : ((calculation == null) ? this!.toInt() : calculation(this!));
  }
}

extension FunctionExtension on bool Function(String) {
  /// Merges String functions that return a boolean.
  /// Example: isNullOrEmpty.or(ifNumberIsValid)
  bool Function(String) or(bool Function(String) other) =>
      (String value) => this(value) || other(value);

  /// Merges String functions that return a boolean.
  /// Example: isNullOrEmpty.and(ifNumberIsValid)
  bool Function(String) and(bool Function(String) other) =>
      (String value) => this(value) && other(value);
}

extension ObjectExtension on Object {
  ///  If it is absolutely necessary to ensure that a toString does not throw an error,
  /// this method does a try/catch on toString. If an error occurs, it returns only the runtimeType.
  String toSafeString() {
    try {
      return toString();
    } catch (error) {
      return "[toString ERROR: $runtimeType]";
    }
  }
}

extension StringExtensionNullable on String? {
  bool get isNullOrEmpty => (this == null) || this!.isEmpty;

  bool get isNullOrTrimmedEmpty => (this == null) || this!.trim().isEmpty;

  bool get isNotNullNotEmpty => (this != null) && this!.isNotEmpty;

  bool get isEmptyButNotNull => (this != null) && this!.isEmpty;

  bool get isNotNullOrTrimmedEmpty => (this != null) && this!.trim().isNotEmpty;

  /// Never returns empty.
  /// 1) If the string is null, returns null.
  /// 2) If the string is empty (after trimming), returns null.
  /// 3) If the string is NOT empty, returns the trimmed string.
  String? trimOrNull([int? maxLength]) {
    if (this == null) return null;
    String trimmed = this!.trim();
    if (maxLength != null) trimmed = trimmed.cutsUnicode(maxLength);
    return trimmed.isEmpty ? null : trimmed;
  }

  /// Never returns null.
  /// 1) If the string is null, returns empty.
  /// 2) If the string is empty (after trimming), returns empty.
  /// 3) If the string is NOT empty, returns the trimmed string.
  String trimOrEmpty([int? maxLength]) {
    if (this == null) return "";
    String trimmed = this!.trim();
    if (maxLength != null) trimmed = trimmed.cutsUnicode(maxLength);

    return trimmed;
  }

  /// This method checks if the string is not null and if its length is greater than a specified
  /// maximum number of characters (maxChars). It returns true if both conditions are met.
  bool ifNotNullAndHasLenghMoreThan(int maxChars) => (this != null) && this!.length > maxChars;

// TODO: DONT REMOVE
  /// May be slow.
  /// This method removes diacritical marks (like accents) from the string.
  /// If the string is null, it returns null. Otherwise, replaces diacritical marks in the string.
  /// (for example, replacing "é" with "e").
// String? withoutDiacritics() => (this == null) ? null : Diacritics.replace(this!);
}

const noBreakSpace = "\u00A0";

extension StringExtension on String {
  //
  /// Replaces all spaces with no-break spaces.
  String get allNonBreak => replaceAll(" ", noBreakSpace);

  /// Will break the text into double lines (at \n\n) and then apply addNoBreakSpaces to each line.
  String get nonBreak => addNoBreakSpacesForEachLine(10);

  /// Will break the text into double lines (at \n\n) and then apply addNoBreakSpaces to each line.
  String addNoBreakSpacesForEachLine(int endLength, [String newChar = noBreakSpace]) {
    var lines = split('\n\n');
    return lines.map((line) => line.addNoBreakSpaces(endLength, newChar)).join('\n\n');
  }

  /// This will check the last [endLength] chars of the string, and replace all spaces with
  /// no-break-spaces. This is useful to get a more 'balanced' string, that doesn't leave very
  /// short text in the last line. It's just to make the text more beautiful.
  /// If [endLength] is equal or larger to length, this method doesn't do anything.
  String addNoBreakSpaces(int endLength, [String newChar = noBreakSpace]) =>
      _addNoBreakSpaces(Characters(this), endLength, newChar);

  String _addNoBreakSpaces(Characters chars, int endLength, [String newChar = noBreakSpace]) {
    int count = length;
    return chars.map((char) {
      count--;
      if ((count < endLength) && (char == ' '))
        return newChar;
      else
        return char;
    }).join();
  }

  bool get isNotTrimmedEmpty => trim().isNotEmpty;

  bool hasLength(List<int> lengths) => lengths.contains(length);

  String lastChars(int numb) => substring((length - numb).clamp(0, length));

  String firstChar() => (length == 0) ? '' : substring(0, 1);

  /// Devolve true se a String contém algum dos [texts].
  bool containsAny(Iterable<String> texts) => texts.any((texto) => contains(texto));

  // Used to ensure that a string is unique within a given list of strings.
  // Here's a step-by-step explanation:
  // * The function takes two parameters: texts, which is an iterable of strings, and start, which is an optional parameter that defaults to 1.
  // * The function first trims the original string and all the strings in the texts list.
  // * It then checks if the original string already exists in the texts list. If it doesn't, the original string is returned as it is already unique.
  // * If the original string does exist in the texts list, the function removes any trailing numbers from the original string and trims it again.
  // * The function then enters a loop where it appends a counter (starting from the start value) to the original string, creating a new string each time.
  // * If this new string already exists in the texts list, the counter is incremented and the loop repeats.
  // * Once a new string is created that doesn't exist in the texts list, this unique string is returned.
  // In summary, this function ensures that a string is unique within a given list by appending a number to it if necessary.
  String makeItUniqueByNumbering(Iterable<String?> texts, {int start = 1}) {
    String original = trim();
    texts = texts.where((t) => t != null).map((t) => t!.trim()).toList();
    if (texts.every(((text) => text != original))) return original;
    original = original.removeTrailingNumbers().trim();

    String novo = original;
    int count = start;

    while (texts.any(((texto) => texto == novo))) {
      novo = "$original $count";
      count++;
    }
    return novo;
  }

  static final _allSpaces = RegExp(r'[\s]');

  String removeSpaces() => replaceAll(_allSpaces, "");

  /// Conta o numero de vezes que [sequencia] aparece no texto;
  int countIt(String sequence) => split(sequence).length - 1;

  /// Transforma espaços duplos em espaços simples.
  String removeDoubleSpaces() {
    String? lastChar;
    List<String> texto = [];
    for (var char in characters) {
      if (!(lastChar == " " && char == " ")) texto.add(char);
      lastChar = char;
    }
    return texto.join();
  }

  String removeTrailingNumbers() {
    if (isNullOrEmpty) return this;
    int pos = length - 1;
    while (pos >= 0 && codeUnitAt(pos).isInRange(48, 57)) {
      pos--;
    }
    return substring(0, pos + 1);
  }

  String removeTrailingQuestionMark() {
    if (!endsWith("?") || isEmpty) return this;
    return substring(0, length - 1);
  }

  // TODO: MARCELO Test
  /// Remove do final o primeiro dos texts passados que encontrar.
  String removeDoFinal(List<String> texts) {
    for (String text in texts) {
      if ((text.length <= length) && (endsWith(text))) return substring(0, length - text.length);
    }

    return this;
  }

  /// Pega os primeiros `qtd` code-units da `string` e ignora os grapheme-clusters restantes.
  ///
  /// Note que isso é necessário pois o método `subtring` pode cortar um grapheme-cluster
  /// no meio, e com isso gerar um character diferente daqueles contidos na String inicial.
  ///
  /// Por exemplo:
  ///
  /// ```dart
  /// assert('🥦'.length == 2);
  /// assert('🥦'.substring(0, 1) == '�');
  /// ```
  ///
  /// Ou seja, para não devolver caracteres diferentes ou inválidos, esse método remove
  /// grapheme-clusters inteiros, impedindo que sejam cortados ao meio.
  /// No exemplo acima, uma String vazia seria o resultado.
  ///
  /// Se `qtd` é maior que `string.length`, devolve a string original inalterada.
  String cutsUnicode(int tamanho) {
    String text = this;

    // Se o texto cabe no tamanho alocado, devolve inalterado.
    if (text.length <= tamanho)
      return text;
    //
    // Se o texto não cabe,
    else {
      // Começa com um texto cujo número de grapheme-clusters é o mesmo que o número de caracteres
      // da String. Como o espaço ocupado pelos grapheme-clusters é sempre MAIOR que o ocupado
      // pelas Strings, não precisa começar a com a String toda.
      text = text.characters.take(text.length).string;

      // Daí vai tirando grapheme-clusters por grapheme-clusters do final,
      // até que a String caiba no espaço alocado.
      while (text.length > tamanho) text = text.characters.skipLast(1).string;

      return text;
    }
  }

  static final _patternAllCharsExceptDigits = RegExp('[^0-9]');
  static final _patternAllCharsExceptDigitsDotComma = RegExp('[^0-9.,]');

  /// Devolve apenas os numeros de 0 a 9 (remove ponto, virgula e sinal de menos também).
  String onlyInts() => replaceAll(_patternAllCharsExceptDigits, '');

  /// Devolve apenas os numeros de 0 a 9, ponto ou virgula (remove sinal de menos também).
  String onlyIntsDotComma() => replaceAll(_patternAllCharsExceptDigitsDotComma, '');

  /// Devolve o caracter na posicao [pos]. O índice 0 é o primeiro caracter.
  /// Se [pos] é negativo, ou maior que o texto em si, devolve nulo.
  String? getCharInPosition(int pos) => (pos < 0 || pos >= length) ? null : substring(pos, pos + 1);

  /// Null to keep it unchanged.
  String capitalize(Capitalize? capitalize) {
    if (capitalize == null)
      return this;
    else if (capitalize == Capitalize.upperCase)
      return toUpperCase();
    else if (capitalize == Capitalize.lowerCase)
      return toLowerCase();
    else if (capitalize == Capitalize.firstLetter)
      return capitalizeFirstLetter(this);
    else if (capitalize == Capitalize.title)
      return capitalizeTitle(this);
    else
      throw AssertionError(capitalize);
  }

  /// To iterate a [String]: `"Hello".iterable()`
  /// This will use simple characters. If you want to use Unicode Grapheme
  /// from the [Characters] library, passa [chars] true.
  Iterable<String> iterable({bool unicode = false}) sync* {
    if (unicode) {
      var iterator = Characters(this).iterator;
      while (iterator.moveNext()) {
        yield iterator.current;
      }
    } else
      for (var i = 0; i < length; i++) {
        yield this[i];
      }
  }
}

class MutableInt {
  int value;

  MutableInt(this.value);

  bool get isZero => value == 0;

  bool get isNotZero => value != 0;

  void add(int value) => this.value += value;

  void subtract(int value) => this.value -= value;

  void increment() => value++;

  void decrement() => value--;

  void zera() {
    value = 0;
  }
}

/// Dado um objeto, devolve seu `toString()`.
/// Mas se o objeto é nulo, devolve string vazia.
String toStringOrEmpty(Object? obj) => obj == null ? "" : obj.toString();

T? orNull<T>(dynamic value, T func(dynamic)) => value == null ? null : func(value);

/// Para uso em .where
bool naoEhNulo(Object? obj) => obj != null;

/// Para uso em .where
bool ehNulo(Object? obj) => obj == null;

/// Para uso em .where
bool ehNuloOuZero(int? number) => number == null || number == 0;

/// Para uso em .where
bool naoEhNuloNemZero(int? number) => number != null && number != 0;

/// Para uso em .where
bool ehNuloOuVazio(String? text) => text == null || text.isEmpty;

/// Para uso em .where
bool naoEhNuloNemVazio(String? text) => text != null && text.isNotEmpty;

/// Para uso em .where
bool naoEhVazio(String text) => text.isNotEmpty;

/// Para uso em .where
bool naoEhTrimmedVazio(String text) => text.trim().isNotEmpty;

/// Nota: Se for String, faz trim antes de verificar se é vazio.
bool saoTodosNulosOuStringsVazias(List<Object?> objs) {
  for (var obj in objs) {
    if (obj != null && (obj is! String || obj.trim().isNotEmpty)) return false;
  }
  return true;
}

bool seUmESomenteUmNaoEhNulo(List<Object?> objs) {
  var achou = false;
  for (var obj in objs) {
    if (obj != null) {
      if (achou) return false;
      achou = true;
    }
  }
  if (!achou) return false;
  return true;
}

bool saoTodosNulos(List<Object?> objs) {
  for (var obj in objs) {
    if (obj != null) return false;
  }
  return true;
}

bool saoTodosNaoNulos(List<Object?> objs) {
  for (var obj in objs) {
    if (obj == null) return false;
  }
  return true;
}

bool seAlgumNaoEhNulo(List<Object?> objs) => objs.any((obj) => obj != null);

/// Se um é fornecido, todos devem ser.
bool saoTodosNulosOuTodosNaoNulos(List<Object?> objs) =>
    saoTodosNulos(objs) || saoTodosNaoNulos(objs);

bool atLeastOneIsNotNullNorEmpty(List<String> texts) {
  for (var text in texts) {
    if (text.isNotNullNotEmpty) return true;
  }
  return false;
}

bool allAreNotNullNorEmpty(List<String> texts) {
  for (var text in texts) {
    if (text.isEmpty) return false;
  }
  return true;
}

bool areAllNullOrEmpty(List<String> texts) {
  for (var text in texts) {
    if (text.isNotNullNotEmpty) return false;
  }
  return true;
}

/// Junta duas palavras, separadas por um espaço ou outro delimitador.
/// Se uma das palavras passadas é nula ou vazia (ou trimmed vazia), devolve somente
/// a outra, sem o delimitador. Nunca devolve nulo (pode devolver vazio).
String juntaPalavras(
  String? palavra1,
  String? palavra2, {
  String delimitador = " ",
  bool sePrimeira = true,
  bool seSegunda = true,
}) {
  bool seNaoTemPalavra1 = !sePrimeira || palavra1.isNullOrTrimmedEmpty;
  bool seNaoTemPalavra2 = !seSegunda || palavra2.isNullOrTrimmedEmpty;

  if (seNaoTemPalavra1 && seNaoTemPalavra2) {
    return "";
  }
  //
  else if (seNaoTemPalavra1) {
    return seNaoTemPalavra2 ? "" : palavra2!;
  }
  //
  else if (seNaoTemPalavra2) {
    return seNaoTemPalavra1 ? "" : palavra1!;
  }
  //
  else
    return "$palavra1$delimitador$palavra2";
}

/// Junta palavras com vírgula e "e".
///
/// Exemplos:
/// juntaTudo([]) -> ""
/// juntaTudo(["José"]) -> "José"
/// juntaTudo(["José"]) -> "José"
/// juntaTudo(["José", "Maria"]) -> "José e Maria"
/// juntaTudo(["José", "Maria", "Sandra"]) -> "José, Maria e Sandra"
/// juntaTudo(["José", "Maria", "Sandra", "João"]) -> "José, Maria, Sandra e João"
String juntaTudo(Iterable<String?> palavras, {bool seComPontoFinal = false, String? delimitador}) {
  //
  List<String> lista = palavras.whereNotNull().toList();

  if (lista.isEmpty) return "";
  if (lista.length == 1) return '${lista[0]}${seComPontoFinal ? '.' : ''}';
  if (lista.length == 2) return '${lista[0]} e ${lista[1]}${seComPontoFinal ? '.' : ''}';
  return "${lista.sublist(0, lista.length - 1).join(delimitador ?? ', ')} e ${lista.last}${seComPontoFinal ? '.' : ''}";
}

/// Encapsula uma callback, fazendo vibrar quanto ela é chamada.
VoidCallback? vibrateCallback([VoidCallback? callback]) => (callback == null)
    ? null
    : () {
        vibrate();
        callback();
      };

/// Vibra o dispositivo.
void vibrate() {
  if (Platform.isIOS)
    HapticFeedback.lightImpact();
  else
    HapticFeedback.vibrate();
}

/// Copia texto (e vibra o dispositivo).
void copiaTextoParaOClipboard(String texto) {
  vibrate();
  Clipboard.setData(ClipboardData(text: texto));
}

/// Testar se isso só funciona em Android, e mesmo assim só nas versões mais novas.
void click() => SystemSound.play(SystemSoundType.click);

enum Capitalize {
  firstLetter, // As demais letras são inalteradas.
  title, // Primeira letra de cada palavra maiuscula, menos algumas conjunções.
  upperCase, // Todas as maiusculas.
  lowerCase, // Todas em minusculas.
}

String capitalizeFirstLetter(String text) {
  if (text.isEmpty)
    return text;
  //
  else {
    var characters = Characters(text);
    return (characters.take(1).toUpperCase() + characters.skip(1)).string;
  }
}

/// Evite usar em textos longos, pois pode ser lento.
String capitalizeTitle(String text, {bool seDemaisLetrasMinusculas = true}) {
  if (text.isEmpty)
    return text;
  //
  else {
    var chars = <String>[];
    var characters = Characters(text);

    int conta = 0;
    bool seEspaco = false;
    for (String char in characters) {
      //
      if (conta == 0 || seEspaco)
        chars.add(char.toUpperCase());
      else
        chars.add(seDemaisLetrasMinusculas ? char.toLowerCase() : char);

      seEspaco = (char == " ");
      conta++;
    }

    characters = Characters(chars.join());
    characters = characters.replaceAll(Characters(" E "), Characters(" e "));
    characters = characters.replaceAll(Characters(" De "), Characters(" de "));
    characters = characters.replaceAll(Characters(" Da "), Characters(" da "));
    characters = characters.replaceAll(Characters(" Do "), Characters(" do "));
    characters = characters.replaceAll(Characters(" Para "), Characters(" para "));

    return characters.toString();
  }
}

enum Wins { min, max }

/// Times que aceita null. Se qualquer deles é null, devolve null.
double? timesN(double? a, double? b) {
  if (a == null)
    return null;
  else if (b == null) return null;
  return a * b;
}

/// Min que aceita null. Se qualquer deles é null, ignora e devolve o outro valor.
double? minN(double? a, double? b) {
  if (a == null)
    return b;
  else if (b == null) return a;
  return min(a, b);
}

/// Max que aceita null. Se qualquer deles é null, ignora e devolve o outro valor.
double? maxN(double? a, double? b) {
  if (a == null)
    return b;
  else if (b == null) return a;
  return max(a, b);
}

List<double?> calculateConstraints({
  double? available,
  double? size,
  double? sizeRatio,
  double? minAbsolute,
  double? maxAbsolute,
  double? minRatio,
  double? maxRatio,
  required Wins wins,
}) {
  assert(size == null || sizeRatio == null);
  // ---

  double? min, max;

  if (sizeRatio != null) size = sizeRatio * available!;

  min = maxN(minAbsolute, timesN(minRatio, available));
  max = minN(maxAbsolute, timesN(maxRatio, available));

  // Se tem um valor de size exato, aplica min/max e devolve exato.
  if (size != null) {
    size = clipN(minValue: min, value: size, maxValue: max, wins: wins);
    return [size, size];
  }

  // Se NÃO tem um valor de size exato, devolve min/max.
  else {
    min ??= 0.0;
    max ??= double.infinity;

    if (min > max) {
      if (wins == Wins.min)
        max = min;
      else if (wins == Wins.max)
        min = max;
      else
        throw AssertionError();
    }

    return [min, max];
  }
}

/// Clip (mínimo e máximo) que aceita null.
/// Se value é null, devolve null.
/// Se minValue é null, ignora o mínimo.
/// Se maxValue é null, ignora o máximo.
double? clipN({
  required double? minValue,
  required double? value,
  required double? maxValue,
  required Wins wins,
}) {
  if (value == null)
    return null;
  else if (wins == Wins.min)
    return maxN(minN(value, maxValue), minValue);
  else if (wins == Wins.max)
    return minN(maxN(value, minValue), maxValue);
  else
    throw AssertionError();
}

/// Função identidade para suprimir a regra do linter `prefer_const_constructors`.
///
/// Por exemplo:
///
/// ```dart
/// class C {
///   const C(this.i);
///
///   final int i;
/// }
///
/// var c1 = C(42);
/// var c2 = C(nonConst(42));
/// ```
///
/// No código acima, a expressão `C(42)` ativa o linter `prefer_const_constructors`, enquanto que
/// a expressão `C(nonConst(42))` não ativa.
T nonConst<T>(T value) => value;

extension NumberExtension on num {
  bool isInRange(num ini, num fim) => this >= ini && this <= fim;

  bool isNotInRange(num ini, num fim) => this < ini || this > fim;
}
