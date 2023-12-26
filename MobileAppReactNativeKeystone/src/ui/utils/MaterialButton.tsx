import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Color from '../theme/Color';

interface MaterialButtonProps extends TouchableOpacityProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  minWidth?: number;
  fontSize?: number;
  onPress?: () => void;
}

const MaterialButton: React.FC<MaterialButtonProps>
  = ({
       label,
       color = '#FFFFFF',
       backgroundColor = '#2196F3',
       disabled = false,
       padding = 0,
       minWidth = 64,
       fontSize = 14,
       onPress = () => null,
     }) => {

  // Adjust styles when disabled.
  const buttonStyles = [
    styles.button,
    { backgroundColor, minWidth },
    disabled && {
      color: Color.disabledText,
      backgroundColor: Color.disabledBackground,
      shadowColor: Color.transparent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
  ];

  const textStyles = [
    styles.text,
    { color, fontSize },
    disabled && { color: Color.disabledText },
  ];

  return (
    <View style={{ padding: padding }}>
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        activeOpacity={0.4}
        disabled={disabled}
      >
        <Text style={textStyles}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2, // Shadow for Android.
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS.
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 1.25, // As per Material Design guidelines.
  },
});

export default MaterialButton;
