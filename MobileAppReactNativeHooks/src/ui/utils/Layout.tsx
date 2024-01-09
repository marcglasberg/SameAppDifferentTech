import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { View } from 'react-native';

export const Row: React.FC<{
  children: ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return (
    <View style={{ flexDirection: 'row', ...style }}>
      {children}
    </View>
  );
};

export const Column: React.FC<{
  children: ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return (
    <View style={{ flexDirection: 'column', ...style }}>
      {children}
    </View>
  );
};

/**
 * You can add the Spacer component inside rows and columns.
 *
 * Spacer creates an adjustable, empty space that can be used to tune the
 * spacing between components inside the <View> flexbox component.
 * The space's flexibility can be set via the `flex` prop.
 *
 *  In a React Native flex container (<View>), setting justifyContent to 'space-around',
 *  'space-between', or 'space-evenly' will distribute space based on the flex items
 *  within it. Including a Spacer component with a flex property will absorb the
 *  additional space, affecting how the justifyContent property works. The more
 *  'flex' allocated to the Spacer, the more space it will take up, potentially leaving
 *  less room for space distribution among other components.
 *
 * Props:
 *   - flex (optional): A number that specifies the flex value of the spacer.
 *     It defines how much of the remaining space in the flex container the item
 *     should take up. If not provided, defaults to a flex value of 1.
 *
 * Example usage:
 * ```jsx
 * <View style={{ flexDirection: 'row', alignItems: 'center' }}>
 *    <Text>Some text</Text>
 *    <Spacer />
 *    <Text>More text</Text>
 * <View />
 * ```
 */
export const Spacer: React.FC<{
  flex?: number;
}> = ({ flex }) => {
  return <View style={{ flex: flex ?? 1 }} />;
};


