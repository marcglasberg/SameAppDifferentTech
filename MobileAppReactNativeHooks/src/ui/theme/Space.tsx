import React from 'react';
import { View } from 'react-native';

/**
 * Import it like this:
 * import { Space } from '../theme/Space';
 *
 * Use it like this:
 * <Space.px4 />
 * <Space.px8 />
 */
export const Space = (length: number) => {
  return <View style={{ width: length, height: length }} />;
};

Space.px4 = () => <View style={{ width: 4, height: 4 }} />;
Space.px8 = () => <View style={{ width: 8, height: 8 }} />;
Space.px12 = () => <View style={{ width: 12, height: 12 }} />;
Space.px16 = () => <View style={{ width: 16, height: 16 }} />;
Space.px20 = () => <View style={{ width: 20, height: 20 }} />;

