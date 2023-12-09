import 'react-native';
import { describe, expect, it } from '@jest/globals';
import { AbTesting } from '../../src/business/RunConfig/ABTesting';

describe('AbTesting', () => {
  it('should return firstValueA when A is chosen, ' +
    'and secondValue when B is chosen', () => {
    expect(AbTesting.A.choose('first', 'second')).toEqual('first');
    expect(AbTesting.B.choose('first', 'second')).toEqual('second');
  });

  it('should return either valueA or valueB when AUTO is chosen', () => {
    expect(['first', 'second']).toContain(AbTesting.AUTO.choose('first', 'second'));
  });

  it('should return the correct string representation', () => {
    expect(AbTesting.A.toString()).toEqual('A');
    expect(AbTesting.B.toString()).toEqual('B');
    expect(AbTesting.AUTO.toString()).toEqual('AUTO');
  });
});
