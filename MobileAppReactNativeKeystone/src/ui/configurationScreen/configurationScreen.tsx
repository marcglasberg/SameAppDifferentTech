import React, { ReactNode } from 'react';
import { Text } from 'react-native';

import { observer } from 'mobx-react-lite';
import { dao, runConfig, store } from '../../inject';
import AppBar from '../appBar/AppBar';
import Color from '../theme/Color';
import AppSwitch from '../utils/AppSwitch';
import MaterialButton from '../utils/MaterialButton';
import Divider from '../utils/Divider';
import { Space } from '../theme/Space';
import { Column, Row, Spacer } from '../utils/Layout';
import { AbTesting } from '../../business/RunConfig/ABTesting';
import { print } from '../../business/utils/utils';
import { Font } from '../theme/Font';

const ConfigurationScreen: React.FC = observer(() => {

  return (
    <Column style={{ flex: 1, backgroundColor: Color.background }}>

      <AppBar title="Configuration" />

      <Column style={{ flex: 1 }}>

        <Column style={{ padding: 16 }}>
          {option1()}
          {runConfig.ifShowRunConfigInTheConfigScreen && runConfigOptions()}
        </Column>

        <Spacer />

        <MaterialButton label="Done"
                        backgroundColor={'green'}
                        padding={10}
                        onPress={() => {
                          store.ui.toggleConfigScreen();
                        }} />
      </Column>
    </Column>
  );

  function option1() {
    return <Item
      content={
        <>
          <Text style={Font.medium()}>{store.ui.isLightMode ? 'Light' : 'Dark'} mode</Text>
          <AppSwitch
            value={store.ui.isLightMode}
            onValueChange={(_) => store.ui.toggleLightAndDarkMode()}
          />
        </>
      } />;
  }

  function runConfigOptions() {
    return <>
      <Space.px16 />
      <Divider />
      <Space.px16 />
      <Text>Run Configuration</Text>
      <Space.px12 />
      {runConfigOption1()}
      {runConfigOption2()}
      {runConfigOption3()}
      {runConfigOption4()}
    </>;
  }

  function runConfigOption1() {
    return <Item
      content={
        <>
          <Text style={Font.medium()}>Show Run Configuration</Text>
          <AppSwitch
            value={runConfig.ifShowRunConfigInTheConfigScreen}
            onValueChange={(_) => runConfig.set({ ifShowRunConfigInTheConfigScreen: !runConfig.ifShowRunConfigInTheConfigScreen })}
          />
        </>
      } />;
  }

  function runConfigOption2() {

    return (
      <Item
        content={
          <>
            <Text style={Font.medium()}>Print debug info to console</Text>

            <AppSwitch
              value={runConfig.ifPrintsDebugInfoToConsole}
              onValueChange={(_) => {
                runConfig.set({ ifPrintsDebugInfoToConsole: !runConfig.ifPrintsDebugInfoToConsole });
              }}
            />
          </>
        }
      />);
  }

  function runConfigOption3() {

    return (
      <Item
        content={
          <>
            <Text style={Font.medium()}>A/B Testing</Text>

            <MaterialButton label={runConfig.abTesting.toString()}
                            backgroundColor={Color.blueText}
                            minWidth={100}
                            fontSize={18}
                            onPress={() => {
                              let newValue: AbTesting;
                              if (runConfig.abTesting === AbTesting.A) newValue = AbTesting.B;
                              else if (runConfig.abTesting === AbTesting.B) newValue = AbTesting.AUTO;
                              else newValue = AbTesting.A;
                              runConfig.set({ abTesting: newValue });
                              print(runConfig.abTesting);
                            }} />
          </>
        }
      />);
  }

  function runConfigOption4() {
    return <Item
      content={
        <>
          <Text style={Font.medium()}>
            Simulation is {dao.constructor.name === 'SimulatedDao' ? 'ON' : 'OFF'}
          </Text>
        </>
      } />;
  }

});

const Item: React.FC<{
  content: ReactNode;
}> = ({ content }) => {
  return (
    <Row
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingBottom: 16,
      }}>
      {content}
    </Row>
  );
};

export default ConfigurationScreen;
