import { Model, model, prop } from 'mobx-keystone';

@model('AbTesting')
export class AbTesting extends Model({
  value: prop<string>()
}, {
  valueType: true
}) {
  static AUTO: AbTesting;
  static A: AbTesting;
  static B: AbTesting;

  private static readonly id = Math.floor(Math.random() * 1000);

  choose<T>(valueA: T, valueB: T): T {
    if (this === AbTesting.A) {
      return valueA;
    } else if (this === AbTesting.B) {
      return valueB;
    } else {
      return (AbTesting.id % 2 === 0) ? valueA : valueB;
    }
  }

  toString(): string {
    return this.value;
  }
}

// We have to do this outside the class, because of mobx-keystone timing issues.
AbTesting.AUTO = new AbTesting({ value: 'AUTO' });
AbTesting.A = new AbTesting({ value: 'A' });
AbTesting.B = new AbTesting({ value: 'B' });


// This code is wrong, but the error message doesn't explain what the problem is.
// import { Model, model, prop } from 'mobx-keystone';
//
// @model('AbTesting')
// export class AbTesting extends Model({
//   value: prop<string>()
// }, {
//   valueType: true
// }) {
//
//   static AUTO = new AbTesting({ value: 'AUTO' });
//   static A = new AbTesting({ value: 'A' });
//   static B = new AbTesting({ value: 'B' });
// }

