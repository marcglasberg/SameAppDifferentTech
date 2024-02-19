import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { toggleConfigScreen } from '../../uiSlice.ts';


const ConfigButton: React.FC<{}> = ({}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        toggleConfigScreen();
      }}
      style={{ padding: 16 }}
    >
      <Icon name={'settings'} size={24} color={'white'} />
    </TouchableOpacity>
  );
};

export default ConfigButton;
