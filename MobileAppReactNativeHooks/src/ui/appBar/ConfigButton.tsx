import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUi } from '../../business/state/Hooks';

const ConfigButton: React.FC<{}> = ({}) => {

  const { ui, setUi } = useUi();

  return (

    <TouchableOpacity
      onPress={() => {
        setUi(ui.toggleConfigScreen());
      }}
      style={{ padding: 16 }}
    >
      <Icon name={'settings'} size={24} color={'white'} />
    </TouchableOpacity>

  );
};

export default ConfigButton;
