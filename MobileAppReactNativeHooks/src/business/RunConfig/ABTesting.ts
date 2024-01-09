/**
 * Choose between different UIs.
 * You may add more states than simple A/B, as needed.
 * */
export class AbTesting {
  static AUTO = new AbTesting('AUTO');
  static A = new AbTesting('A');
  static B = new AbTesting('B');

  // TODO: Should get the real user's ID instead, or from something like Firebase A/B testing.
  // Integer random number.
  private static readonly id = Math.floor(Math.random() * 1000);

  private constructor(private value: string) {
  }

  /**
   * Given 2 values, choose the appropriate one.
   * In production, this should be AUTO, which means that the app will
   * automatically choose between A and B, based on some criteria.
   * During development or tests, you may choose A or B.
   */
  choose<T>(valueA: T, valueB: T): T {
    if (this === AbTesting.A) {
      return valueA;
    } else if (this === AbTesting.B) {
      return valueB;
    } else {
      // Auto means that the app will automatically choose between A and B,
      // based on some criteria like the user's ID, or according to some
      // framework like <a href='https://firebase.google.com/docs/ab-testing'>Firebase A/B testing</a>.
      return (AbTesting.id % 2 === 0) ? valueA : valueB;
    }
  }

  toString() {
    return this.value;
  }
}
