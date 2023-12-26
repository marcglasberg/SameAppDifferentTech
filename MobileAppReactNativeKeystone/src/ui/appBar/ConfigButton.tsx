import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { store } from '../../inject';

const ConfigButton: React.FC<{}> = ({}) => {

  return (

    <TouchableOpacity
      onPress={() => {
        store.ui.toggleConfigScreen();
      }}
      style={{ padding: 16 }}
    >
      <Icon name={'settings'} size={24} color={'white'} />
    </TouchableOpacity>

  );
};

export default ConfigButton;
