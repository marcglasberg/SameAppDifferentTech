import 'dart:math';

/// Choose between different UIs.
/// You may add more states than simple A/B, as needed.
class AbTesting {
  static const AbTesting AUTO = AbTesting._('AUTO');
  static const AbTesting A = AbTesting._('A');
  static const AbTesting B = AbTesting._('B');

  // TODO: Should get the real user's ID instead, or from something like Firebase A/B testing.
  // Integer random number.
  static final int id = Random().nextInt(1000);

  final String value;

  const AbTesting._(this.value);

  /// Given 2 values, choose the appropriate one.
  /// In production, this should be AUTO, which means that the app will
  /// automatically choose between A and B, based on some criteria.
  /// During development or tests, you may choose A or B.
  T choose<T>(T valueA, T valueB) {
    if (this == AbTesting.A) {
      return valueA;
    } else if (this == AbTesting.B) {
      return valueB;
    } else {
      // Auto means that the app will automatically choose between A and B,
      // based on some criteria like the user's ID, or according to some
      // framework like <a href='https://firebase.google.com/docs/ab-testing'>Firebase A/B testing</a>.
      return (AbTesting.id % 2 == 0) ? valueA : valueB;
    }
  }

  @override
  String toString() => value;
}
