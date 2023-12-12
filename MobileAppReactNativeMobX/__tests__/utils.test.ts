import 'react-native';
import { expect, test } from '@jest/globals';
import { round } from '../src/business/utils/utils';

test('round', () => {
  expect(round(1.2345)).toBe(1.23);
  expect(round(1.236)).toBe(1.24);
  expect(round(1.234)).toBe(1.23);
  expect(round(1.23)).toBe(1.23);
  expect(round(1)).toBe(1);
  expect(round(-1.2345)).toBe(-1.23);
});
