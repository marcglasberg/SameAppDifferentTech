import React from 'react';
import { StyleSheet, View } from 'react-native';
import Color from '../theme/Color';

/**
 * A thin 1-pixel-thin line on the device.
 */
const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.divider,
    width: '100%',
  },
});

export default Divider;
