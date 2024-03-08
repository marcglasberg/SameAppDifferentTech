import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/client/utils/utils.dart';

import '../test_utils/matchers.dart';

void main() {
  test(
    'listar()',
    () {
      expect(["abc", "xyz", "123"].listIt(), "Hello");
    },
    skip: "Marcelo",
  );

  test('String.lastChars()', () {
    expect("Hello".lastChars(0), "");
    expect("Hello".lastChars(1), "o");
    expect("Hello".lastChars(2), "lo");
    expect("Hello".lastChars(3), "llo");
    expect("Hello".lastChars(4), "ello");
    expect("Hello".lastChars(5), "Hello");
    expect("Hello".lastChars(6), "Hello");
    expect("Hello".lastChars(7), "Hello");
  });

  test('String.lastChars()', () {
    expect("".firstChar(), "");
    expect("Hello".firstChar(), "H");
  });

  test('String.lastChars()', () {
    expect("Hello".hasLength([5]), isTrue);
    expect("Hello".hasLength([1, 5, 4]), isTrue);
    expect("Hello".hasLength([1, 2, 4]), isFalse);
    expect("Hello".hasLength([1]), isFalse);
    expect("Hello".hasLength([]), isFalse);
  });

  test('String.iterable()', () {
    expect("Hello".iterable(), ["H", "e", "l", "l", "o"]);
    expect("Hello".iterable(unicode: true), ["H", "e", "l", "l", "o"]);

    expect("😊".iterable().length, 2);
    expect("😊".iterable().map((s) => s.codeUnitAt(0)), [55357, 56842]);

    expect("😊".iterable(unicode: true).length, 1);
    expect("😊".iterable(unicode: true), ["😊"]);
  });

  test('inRange / notInRange', () {
    expect(6.isInRange(8, 10), false);
    expect(7.isInRange(8, 10), false);
    expect(10.isInRange(8, 10), true);
    expect(10.isInRange(8, 11), true);
    expect(10.isInRange(10, 11), true);
    expect(11.isInRange(10, 11), true);
    expect(12.isInRange(10, 11), false);
    expect(13.isInRange(10, 11), false);

    expect(6.isNotInRange(8, 10), !false);
    expect(7.isNotInRange(8, 10), !false);
    expect(10.isNotInRange(8, 10), !true);
    expect(10.isNotInRange(8, 11), !true);
    expect(10.isNotInRange(10, 11), !true);
    expect(11.isNotInRange(10, 11), !true);
    expect(12.isNotInRange(10, 11), !false);
    expect(13.isNotInRange(10, 11), !false);
  });

  test('makeItUniqueByNumbering', () {
    expect("x".makeItUniqueByNumbering(["y", null]), "x");
    expect("x".makeItUniqueByNumbering(["y"]), "x");
    expect("x".makeItUniqueByNumbering(["x"]), "x 1");
    expect("x".makeItUniqueByNumbering(["x"], start: 0), "x 0");
    expect("x".makeItUniqueByNumbering(["x", "x 0"], start: 0), "x 1");
    expect(" x ".makeItUniqueByNumbering(["x"]), "x 1");
    expect("x".makeItUniqueByNumbering([" x "]), "x 1");
    expect(" x ".makeItUniqueByNumbering([" x "]), "x 1");
    expect("x".makeItUniqueByNumbering(["x 1"]), "x");
    expect("x".makeItUniqueByNumbering(["x", "x 1"]), "x 2");
    expect("x".makeItUniqueByNumbering(["x", "x 1", "x 2"]), "x 3");
    expect("x".makeItUniqueByNumbering(["x", "x 1", "x 3"]), "x 2");
    expect("x 2".makeItUniqueByNumbering(["x 1"]), "x 2");
    expect("x".makeItUniqueByNumbering(["x 1"]), "x");
    expect("x 2".makeItUniqueByNumbering(["x 2"]), "x");
    expect("x 2".makeItUniqueByNumbering(["x", "x 2"]), "x 1");
  });

  test('removeEspacos', () {
    expect("AB123".removeSpaces(), "AB123");
    expect("AB 123".removeSpaces(), "AB123");
    expect("  AB  123  ".removeSpaces(), "AB123");
    expect("AB\n123".removeSpaces(), "AB123");
    expect(" \nAB\n \t123 \r".removeSpaces(), "AB123");
  });

  test('removeNumeroDoFinal', () {
    expect("AB123".removeTrailingNumbers(), "AB");
    expect("AB120".removeTrailingNumbers(), "AB");
    expect("AB129".removeTrailingNumbers(), "AB");
    expect("AB0129".removeTrailingNumbers(), "AB");
    expect("AB000".removeTrailingNumbers(), "AB");
    expect("AB999".removeTrailingNumbers(), "AB");
  });

  test('removeNumeroDoFinal', () {
    expect("".removeDoubleSpaces(), "");
    expect("AB".removeDoubleSpaces(), "AB");
    expect(" AB ".removeDoubleSpaces(), " AB ");
    expect("  AB  ".removeDoubleSpaces(), " AB ");
    expect("AB 123".removeDoubleSpaces(), "AB 123");
    expect("AB  123".removeDoubleSpaces(), "AB 123");
    expect("  AB  123".removeDoubleSpaces(), " AB 123");
    expect("   AB  123".removeDoubleSpaces(), " AB 123");
    expect("  AB  123  ".removeDoubleSpaces(), " AB 123 ");
    expect("    AB    2 123   ".removeDoubleSpaces(), " AB 2 123 ");
  });

  test('conta', () {
    expect("AB 123".countIt("A"), 1);
    expect("AB 123".countIt("B"), 1);
    expect("AB 1B3".countIt("B"), 2);
    expect("AB 1BB".countIt("B"), 3);
    expect("BBBB".countIt("B"), 4);
    expect("".countIt("B"), 0);
    expect("Xaba".countIt("B"), 0);
  });

  test('removeDoFinal', () {
    expect("AB123".removeDoFinal([".", ",", ";", "?", "!"]), "AB123");
    expect("AB123.".removeDoFinal([".", ",", ";", "?", "!"]), "AB123");
    expect("AB123,".removeDoFinal([".", ",", ";", "?", "!"]), "AB123");
    expect("AB123;".removeDoFinal([".", ",", ";", "?", "!"]), "AB123");
    expect("AB123?".removeDoFinal([".", ",", ";", "?", "!"]), "AB123");
    expect("AB123!".removeDoFinal([".", ",", ";", "?", "!"]), "AB123");
    expect("AB123!".removeDoFinal([".", "123", ";", "?", "!"]), "AB123");
    expect("AB123!".removeDoFinal([".", "123!", ";", "?", "!"]), "AB");
    expect("AB123!".removeDoFinal([".", "!", ";", "?", "123!"]), "AB123");
  });

  test('apenasUmNaoEhNulo', () {
    expect(seUmESomenteUmNaoEhNulo([null, ""]), true);
    expect(seUmESomenteUmNaoEhNulo([null, 2]), true);
    expect(seUmESomenteUmNaoEhNulo(["", null, null]), true);
    expect(seUmESomenteUmNaoEhNulo(["", null, ""]), false);
    expect(seUmESomenteUmNaoEhNulo(["", ""]), false);
    expect(seUmESomenteUmNaoEhNulo([1, 2]), false);
    expect(seUmESomenteUmNaoEhNulo([null, null]), false);
  });

  test('Se algum não é nulo.', () {
    expectFalse(seAlgumNaoEhNulo([]));
    expectTrue(seAlgumNaoEhNulo(["", ""]));
    expectTrue(seAlgumNaoEhNulo(["", null]));
    expectFalse(seAlgumNaoEhNulo([null, null]));
  });

  test('Juntar palavras, separadas por um delimitador', () {
    //
    expect(juntaPalavras("", null), "");
    expect(juntaPalavras(null, ""), "");
    expect(juntaPalavras(null, null), "");
    expect(juntaPalavras("", ""), "");

    expect(juntaPalavras("a", null), "a");
    expect(juntaPalavras(null, "b"), "b");
    expect(juntaPalavras("a", "b"), "a b");
    expect(juntaPalavras("a", "b", delimitador: ","), "a,b");
    expect(juntaPalavras("a", ""), "a");
    expect(juntaPalavras("", "b"), "b");
    expect(juntaPalavras("a", "   "), "a");
    expect(juntaPalavras("   ", "b"), "b");

    expect(juntaPalavras("a", "b", sePrimeira: false), "b");
    expect(juntaPalavras("a", "b", seSegunda: false), "a");
    expect(juntaPalavras("a", "b", sePrimeira: false, seSegunda: false), "");
    expect(juntaPalavras("a", "b", sePrimeira: false, seSegunda: false, delimitador: ","), "");
    expect(juntaPalavras("a", "b", sePrimeira: true, seSegunda: true, delimitador: ","), "a,b");
  });

  test('Juntar tudo', () {
    //
    expect(juntaTudo([]), "");
    expect(juntaTudo(["José"]), "José");
    expect(juntaTudo(["José"]), "José");
    expect(juntaTudo(["José", "Maria"]), "José e Maria");
    expect(juntaTudo(["José", "Maria", "Sandra"]), "José, Maria e Sandra");
    expect(juntaTudo(["José", "Maria", "Sandra", "João"]), "José, Maria, Sandra e João");
  });

  test('Capitalizar a primeira letra', () {
    expect(capitalizeTitle("a"), "A");
    expect(capitalizeTitle("abc"), "Abc");
    expect(capitalizeTitle("alo alo"), "Alo Alo");
    expect(capitalizeTitle("aloalo"), "Aloalo");
    expect(capitalizeTitle("Aloalo"), "Aloalo");
    expect(capitalizeTitle(" aloalo"), " Aloalo");
    expect(capitalizeTitle("  aloalo"), "  Aloalo");
    expect(capitalizeTitle("  Aloalo"), "  Aloalo");
    expect(capitalizeTitle("éáí"), "Éáí");
    expect(capitalizeTitle("Éáí"), "Éáí");
    expect(capitalizeTitle("marcelo ferreira"), "Marcelo Ferreira");
    expect(capitalizeTitle("produtos e serviços"), "Produtos e Serviços");
    expect(capitalizeTitle("um presente para você"), "Um Presente para Você");
    expect(capitalizeTitle("um de dois"), "Um de Dois");
    expect(capitalizeTitle("dia da independência"), "Dia da Independência");
    expect(capitalizeTitle("dia do professor"), "Dia do Professor");
    expect(capitalizeTitle("DIA DO PROFESSOR"), "Dia do Professor");
    expect(
        capitalizeTitle("DIA DO PROFESSOR", seDemaisLetrasMinusculas: false), "DIA DO PROFESSOR");
  });

  test('Capitalizar a primeira letra', () {
    expect(capitalizeFirstLetter(""), "");
    expect(capitalizeFirstLetter("marcelo"), "Marcelo");
    expect(capitalizeFirstLetter("José"), "José");
    expect(capitalizeFirstLetter("marcelo ferreira"), "Marcelo ferreira");

    for (String emoji in [
      "😀a",
      "😁a",
      "😂a",
      "🤣a",
      "😃a",
      "😄a",
      "😅a",
      "😆a",
      "😉a",
      "😊a",
      "😋a",
      "😎a",
      "😍a",
      "😷a",
      "🤒a",
      "🤕a",
      "🤢a",
      "🤮a",
      "🤧a",
      "😇a",
      "🤠a",
      "🤡a",
      "🥳a",
      "🥴a",
      "🥺a",
      "😿a",
      "😾",
      "🏳️a",
      "🏴a",
      "🏁a",
      "🚩a",
      "🏳️‍🌈a",
      "🏴‍☠a",
      "🇦🇫a",
      "🇦🇽a",
      "🇦🇱a",
      "🇷🇪a",
      "🇷🇴a",
      "🇷🇺a",
      "🇷🇼a",
      "🇼🇸a",
      "🇸🇲a",
      "🇸🇦a",
      "🇸🇳a",
      "🇷🇸a",
      "🇸🇨a",
      "🇸🇱a",
      "🇿🇼"
    ]) {
      expect(capitalizeFirstLetter(emoji), emoji);
    }
  });

  test('Testa min, max e times.', () {
    //
    expect(minN(1, 1), 1);
    expect(minN(-1, 1), -1);
    expect(minN(-2, -1), -2);
    expect(minN(2, 10), 2);
    expect(minN(2, null), 2);
    expect(minN(null, null), null);
    expect(minN(1, -1), -1);
    expect(minN(-1, -2), -2);
    expect(minN(10, 2), 2);
    expect(minN(null, 2), 2);

    expect(maxN(1, 1), 1);
    expect(maxN(-1, 1), 1);
    expect(maxN(-2, -1), -1);
    expect(maxN(2, 10), 10);
    expect(maxN(2, null), 2);
    expect(maxN(null, null), null);
    expect(maxN(1, -1), 1);
    expect(maxN(-1, -2), -1);
    expect(maxN(10, 2), 10);
    expect(maxN(null, 2), 2);

    expect(timesN(1, 1), 1);
    expect(timesN(-1, 1), -1);
    expect(timesN(-2, -1), 2);
    expect(timesN(2, 10), 20);
    expect(timesN(2, null), null);
    expect(timesN(null, null), null);
    expect(timesN(1, -1), -1);
    expect(timesN(-1, -2), 2);
    expect(timesN(10, 2), 20);
    expect(timesN(null, 2), null);
  });

  test('Testa clipar (aplicar min e max).', () {
    //
    expect(clipN(minValue: 10, value: 5, maxValue: 20, wins: Wins.min), 10);
    expect(clipN(minValue: 10, value: 15, maxValue: 20, wins: Wins.min), 15);
    expect(clipN(minValue: 10, value: 5, maxValue: 20, wins: Wins.min), 10);
    expect(clipN(minValue: 10, value: 25, maxValue: 20, wins: Wins.min), 20);
    expect(clipN(minValue: 10, value: 25, maxValue: 5, wins: Wins.min), 10);
    expect(clipN(minValue: 10, value: 2, maxValue: 5, wins: Wins.min), 10);

    expect(clipN(minValue: 10, value: 5, maxValue: 20, wins: Wins.max), 10);
    expect(clipN(minValue: 10, value: 15, maxValue: 20, wins: Wins.max), 15);
    expect(clipN(minValue: 10, value: 5, maxValue: 20, wins: Wins.max), 10);
    expect(clipN(minValue: 10, value: 25, maxValue: 20, wins: Wins.max), 20);
    expect(clipN(minValue: 10, value: 25, maxValue: 5, wins: Wins.max), 5);
    expect(clipN(minValue: 10, value: 2, maxValue: 5, wins: Wins.max), 5);

    expect(clipN(minValue: -20, value: -15, maxValue: -10, wins: Wins.min), -15);
    expect(clipN(minValue: -5, value: -25, maxValue: -10, wins: Wins.min), -5);
    expect(clipN(minValue: -5, value: -2, maxValue: -10, wins: Wins.min), -5);
    expect(clipN(minValue: -5, value: -25, maxValue: -10, wins: Wins.max), -10);
    expect(clipN(minValue: -5, value: -2, maxValue: -10, wins: Wins.max), -10);

    // Com nulos: ---

    expect(clipN(minValue: 5, value: null, maxValue: 20, wins: Wins.min), null);
    expect(clipN(minValue: null, value: null, maxValue: null, wins: Wins.min), null);
    expect(clipN(minValue: null, value: null, maxValue: 20, wins: Wins.min), null);
    expect(clipN(minValue: 5, value: null, maxValue: null, wins: Wins.min), null);

    expect(clipN(minValue: null, value: 10, maxValue: 20, wins: Wins.min), 10);
    expect(clipN(minValue: null, value: 10, maxValue: 5, wins: Wins.min), 5);
    expect(clipN(minValue: 10, value: 15, maxValue: null, wins: Wins.min), 15);
    expect(clipN(minValue: 10, value: 5, maxValue: null, wins: Wins.min), 10);
    expect(clipN(minValue: null, value: 8, maxValue: null, wins: Wins.min), 8);

    expect(clipN(minValue: null, value: 10, maxValue: 20, wins: Wins.max), 10);
    expect(clipN(minValue: null, value: 10, maxValue: 5, wins: Wins.max), 5);
    expect(clipN(minValue: 10, value: 15, maxValue: null, wins: Wins.max), 15);
    expect(clipN(minValue: 10, value: 5, maxValue: null, wins: Wins.max), 10);
    expect(clipN(minValue: null, value: 8, maxValue: null, wins: Wins.max), 8);
  });

  test('Testa calcular constraints, quando se passa um size (absoluto ou ratio).', () {
    //

    // Não permite definir ambos size e sizeRatio.
    expect(
        () => calculateConstraints(
            available: 100,
            size: 50,
            sizeRatio: 0.5,
            minAbsolute: 10,
            maxAbsolute: 80,
            minRatio: null,
            maxRatio: null,
            wins: Wins.min),
        throwsAssertionError);

    // Valor 50, está entre [10, 80]. Então devolve 50.
    expect(
        calculateConstraints(
            available: 100,
            size: 50,
            sizeRatio: null,
            minAbsolute: 10,
            maxAbsolute: 80,
            minRatio: null,
            maxRatio: null,
            wins: Wins.min),
        [50, 50]);

    // Valor 50, entre [10, 80] dá 60.
    expect(
        calculateConstraints(
            available: 100,
            size: 50,
            sizeRatio: null,
            minAbsolute: 60,
            maxAbsolute: 80,
            minRatio: null,
            maxRatio: null,
            wins: Wins.min),
        [60, 60]);

    // Valor 50, entre [10, 40] dá 40.
    expect(
        calculateConstraints(
            available: 100,
            size: 50,
            sizeRatio: null,
            minAbsolute: 10,
            maxAbsolute: 40,
            minRatio: null,
            maxRatio: null,
            wins: Wins.min),
        [40, 40]);

    // Ratio 0.45 de 100 = valor 45, entre [10, 80] dá 45.
    expect(
        calculateConstraints(
            available: 100,
            size: null,
            sizeRatio: 0.45,
            minAbsolute: 10,
            maxAbsolute: 80,
            minRatio: null,
            maxRatio: null,
            wins: Wins.min),
        [45, 45]);

    // Ratio 0.45 de 100 = valor 45, entre ratios [0.6, 0.8] dá 60.
    expect(
        calculateConstraints(
            available: 100,
            size: null,
            sizeRatio: 0.45,
            minAbsolute: null,
            maxAbsolute: null,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [60, 60]);

    // Ratio 0.45 de 100 = valor 45, entre ratios [0.6, 0.8] e absolutos [70, 75] dá 70.
    expect(
        calculateConstraints(
            available: 100,
            size: null,
            sizeRatio: 0.45,
            minAbsolute: 70,
            maxAbsolute: 75,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [70, 70]);

    // Ratio 0.45 de 100 = valor 45, entre ratios [0.6, 0.8] e absolutos [50, 85] dá 60.
    expect(
        calculateConstraints(
            available: 100,
            size: null,
            sizeRatio: 0.45,
            minAbsolute: 50,
            maxAbsolute: 85,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [60, 60]);

    // Ratio 0.95 de 100 = valor 95, entre ratios [0.6, 0.8] e absolutos [70, 75] dá 75.
    expect(
        calculateConstraints(
            available: 100,
            size: null,
            sizeRatio: 0.95,
            minAbsolute: 70,
            maxAbsolute: 75,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [75, 75]);

    // Ratio 0.95 de 100 = valor 95, entre ratios [0.6, 0.8] e absolutos [50, 85] dá 80.
    expect(
        calculateConstraints(
            available: 100,
            size: null,
            sizeRatio: 0.95,
            minAbsolute: 50,
            maxAbsolute: 85,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [80, 80]);
  });

  test('Testa calcular constraints, quando NÃO se passa um size.', () {
    //

    // Entre [10, 80].
    expect(
        calculateConstraints(
            available: 100,
            minAbsolute: 10,
            maxAbsolute: 80,
            minRatio: null,
            maxRatio: null,
            wins: Wins.min),
        [10, 80]);

    // Entre ratios [0.6, 0.8] dá [60, 80].
    expect(
        calculateConstraints(
            available: 100,
            minAbsolute: null,
            maxAbsolute: null,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [60, 80]);

    // Entre ratios [0.6, 0.8], e absolutos [70, 75], dá [70, 75].
    expect(
        calculateConstraints(
            available: 100,
            minAbsolute: 70,
            maxAbsolute: 75,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [70, 75]);

    // Entre ratios [0.6, 0.8], e absolutos [50, 85], dá [60, 80].
    expect(
        calculateConstraints(
            available: 100,
            minAbsolute: 50,
            maxAbsolute: 85,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [60, 80]);

    // Entre ratios [0.6, 0.8] e absolutos [70, 85] dá [70, 80].
    expect(
        calculateConstraints(
            available: 100,
            minAbsolute: 70,
            maxAbsolute: 85,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [70, 80]);

    // Entre ratios [0.6, 0.8] e absolutos [50, 70] dá [60, 70].
    expect(
        calculateConstraints(
            available: 100,
            minAbsolute: 50,
            maxAbsolute: 70,
            minRatio: 0.6,
            maxRatio: 0.8,
            wins: Wins.min),
        [60, 70]);
  });

  test('Testa calcular constraints que se sobrepõe, sem size, quando se tem Win.min e Win.max.',
      () {
    //

    // Entre min 70 e max 50, quando mínimo vence, dá 70.
    expect(calculateConstraints(available: 100, minAbsolute: 70, maxAbsolute: 50, wins: Wins.min),
        [70, 70]);

    // Entre min 70 e max 50, quando máximo vence, dá 50.
    expect(calculateConstraints(available: 100, minAbsolute: 70, maxAbsolute: 50, wins: Wins.max),
        [50, 50]);

    // Entre min ratio 0.7 e max 0.5, quando mínimo vence, dá 70.
    expect(calculateConstraints(available: 100, minRatio: 0.7, maxRatio: 0.5, wins: Wins.min),
        [70, 70]);

    // Entre min ratio 0.7 e max 0.5, quando máximo vence, dá 50.
    expect(calculateConstraints(available: 100, minRatio: 0.7, maxRatio: 0.5, wins: Wins.max),
        [50, 50]);

    // Entre min ratio 0.7 e max 50, quando mínimo vence, dá 70.
    expect(calculateConstraints(available: 100, minRatio: 0.7, maxAbsolute: 50, wins: Wins.min),
        [70, 70]);

    // Entre min ratio 0.7 e max 50, quando máximo vence, dá 50.
    expect(calculateConstraints(available: 100, minRatio: 0.7, maxAbsolute: 50, wins: Wins.max),
        [50, 50]);

    // Entre min ratio 0.7 e max 50, quando mínimo vence, dá 70.
    expect(calculateConstraints(available: 100, minAbsolute: 70, maxRatio: 0.5, wins: Wins.min),
        [70, 70]);

    // Entre min ratio 0.7 e max 50, quando máximo vence, dá 50.
    expect(calculateConstraints(available: 100, minAbsolute: 70, maxRatio: 0.5, wins: Wins.max),
        [50, 50]);
  });

  test('Testa calcular constraints que se sobrepõe, sem size, quando se tem Win.min e Win.max.',
      () {
    //

    // Entre min 70 e max 50, quando mínimo vence, dá 70.
    expect(
        calculateConstraints(
            available: 100, size: 10, minAbsolute: 70, maxAbsolute: 50, wins: Wins.min),
        [70, 70]);

    // Entre min 70 e max 50, quando máximo vence, dá 50.
    expect(
        calculateConstraints(
            available: 100, size: 90, minAbsolute: 70, maxAbsolute: 50, wins: Wins.max),
        [50, 50]);

    // Entre min ratio 0.7 e max 0.5, quando mínimo vence, dá 70.
    expect(
        calculateConstraints(
            available: 100, size: 60, minRatio: 0.7, maxRatio: 0.5, wins: Wins.min),
        [70, 70]);

    // Entre min ratio 0.7 e max 0.5, quando máximo vence, dá 50.
    expect(
        calculateConstraints(
            available: 100, size: 60, minRatio: 0.7, maxRatio: 0.5, wins: Wins.max),
        [50, 50]);

    // Entre min ratio 0.7 e max 50, quando mínimo vence, dá 70.
    expect(
        calculateConstraints(
            available: 100, size: 10, minRatio: 0.7, maxAbsolute: 50, wins: Wins.min),
        [70, 70]);

    // Entre min ratio 0.7 e max 50, quando máximo vence, dá 50.
    expect(
        calculateConstraints(
            available: 100, size: 100, minRatio: 0.7, maxAbsolute: 50, wins: Wins.max),
        [50, 50]);

    // Entre min ratio 0.7 e max 50, quando mínimo vence, dá 70.
    expect(
        calculateConstraints(
            available: 100, size: 60, minAbsolute: 70, maxRatio: 0.5, wins: Wins.min),
        [70, 70]);

    // Entre min ratio 0.7 e max 50, quando máximo vence, dá 50.
    expect(
        calculateConstraints(
            available: 100, size: 80, minAbsolute: 70, maxRatio: 0.5, wins: Wins.max),
        [50, 50]);
  });

  test('apenasInts.', () {
    expect(''.onlyInts(), '');
    expect('abc!'.onlyInts(), '');
    expect('0123456789'.onlyInts(), '0123456789');
    expect('01.23,45:6789'.onlyInts(), '0123456789');
    expect('0ab12c3!'.onlyInts(), '0123');
  });

  test('apenasIntsPontoOuVirgula.', () {
    expect(''.onlyIntsDotComma(), '');
    expect('abc!'.onlyIntsDotComma(), '');
    expect('0123456789'.onlyIntsDotComma(), '0123456789');
    expect('01.23,45:6789'.onlyIntsDotComma(), '01.23,456789');
    expect('0ab12c3!'.onlyIntsDotComma(), '0123');
  });

  test('caracterNaPosicao.', () {
    expect(''.getCharInPosition(-1), null);
    expect(''.getCharInPosition(0), null);
    expect(''.getCharInPosition(1), null);
    expect(''.getCharInPosition(2), null);

    expect('a'.getCharInPosition(-1), null);
    expect('a'.getCharInPosition(0), 'a');
    expect('a'.getCharInPosition(1), null);
    expect('a'.getCharInPosition(2), null);

    expect('ab'.getCharInPosition(-1), null);
    expect('ab'.getCharInPosition(0), 'a');
    expect('ab'.getCharInPosition(1), 'b');
    expect('ab'.getCharInPosition(2), null);
  });

  group('cortaUnicode', () {
    //
    /// Pride/rainbow flag.
    ///
    /// O editor pode reconhecer como vários caracteres,
    /// mas esse é apenas um grapheme-cluster composto por 6 code-units.
    ///
    /// Veja: https://emojipedia.org/rainbow-flag/
    const prideFlag = '🏳️‍🌈';

    test('Quantidade de code-units que reflete a quantidade de grapheme-clusters.', () {
      var string = 'Lorem ipsum dolor sit amet';
      expect(
        string.cutsUnicode(11),
        allOf(string.substring(0, 11), 'Lorem ipsum'),
      );
    });

    test('Argumento tamanho que combina com o fim do grapheme-cluster.', () {
      var string = 'Lorem $prideFlag ipsum';
      expect(
        string.cutsUnicode(12),
        allOf(string.substring(0, 12), 'Lorem $prideFlag'),
      );
    });

    test('Argumento tamanho entre começo e fim do grapheme-cluster.', () {
      //
      var string = 'Lorem $prideFlag ipsum';

      expect(
        'Lorem $prideFlag ipsum'.cutsUnicode(11),
        isNot(string.substring(0, 11)),
      );

      expect('Lorem $prideFlag ipsum'.cutsUnicode(11), 'Lorem ');
    });

    test('length menor que argumento tamanho.', () {
      expect('Lorem'.cutsUnicode(10), 'Lorem');
    });
  });
}
