import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Color from '../theme/Color';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'; // Sets: Foundation, Ionicons, FontAwesome, FontAwesome5, MaterialIcons, etc.

const CircleButton: React.FC<{
  icon: string;
  color: string;
  backgroundColor: string;
  onPress: (event: GestureResponderEvent) => void;
}> = ({ icon, color, backgroundColor, onPress }) => {

  const $circleButton: ViewStyle = {
    width: 50, // You can adjust width and height to match your design
    height: 50,
    borderRadius: 25, // Half the width/height to create a circle
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // This adds a shadow on Android
    shadowOffset: { width: 1, height: 1 }, // This adds a shadow on iOS
    shadowColor: Color.palette.black,
    shadowOpacity: 0.3,
    shadowRadius: 2,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[$circleButton, { backgroundColor }]}
    >
      <Icon name={icon} size={24} color={color} />
    </TouchableOpacity>
  );
};

export default CircleButton;
