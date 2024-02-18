import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from './counterSlice.ts';
import { RootState } from './store.tsx';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const $style: ViewStyle = { alignItems: 'center' };

  return (
    <View style={$style}>
      <TouchableOpacity onPress={() => dispatch(increment())}>
        <Text>Increment</Text>
      </TouchableOpacity>
      <Text>{count}</Text>
      <TouchableOpacity onPress={() => dispatch(decrement())}>
        <Text>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
}
