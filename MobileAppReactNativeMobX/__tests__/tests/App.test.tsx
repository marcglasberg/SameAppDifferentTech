import 'react-native';
import { beforeEach, expect, test } from '@jest/globals';
import { inject, store } from '../../src/inject';

beforeEach(async () => {
  inject({});
});

test('The default language is English.', (): void => {
  expect(store.ui.language).toBe('en_US');
});

test('The cash balance starts as zero, and can be added.', (): void => {
  expect(store.portfolio.cashBalance.amount).toBe(0);
  store.portfolio.cashBalance.add(100);
  expect(store.portfolio.cashBalance.amount).toBe(100);
});
