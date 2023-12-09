import 'react-native';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { AbTesting } from '../../src/business/RunConfig/ABTesting';
import RunConfig from '../../src/business/RunConfig/RunConfig';
import React from 'react';
import { View } from 'react-native';

describe('RunConfig', () => {
  let runConfig: RunConfig;
  let abTesting: AbTesting;

  beforeEach(() => {
    abTesting = AbTesting.A;
    runConfig = new RunConfig({
      playground: <View />,
      ifShowRunConfigInTheConfigScreen: true,
      ifPrintsDebugInfoToConsole: true,
      abTesting: abTesting,
    });
  });

  it('should initialize with provided values.', () => {
    expect(runConfig.playground).not.toBeNull();
    expect(runConfig.ifShowRunConfigInTheConfigScreen).toBe(true);
    expect(runConfig.ifPrintsDebugInfoToConsole).toBe(true);
    expect(runConfig.abTesting).toBe(abTesting);
  });

  it('should update values when set is called.', () => {
    runConfig.set({
      playground: null,
      ifShowRunConfigInTheConfigScreen: false,
      ifPrintsDebugInfoToConsole: false,
      abTesting: AbTesting.B,
    });

    expect(runConfig.playground).toBeNull();
    expect(runConfig.ifShowRunConfigInTheConfigScreen).toBe(false);
    expect(runConfig.ifPrintsDebugInfoToConsole).toBe(false);
    expect(runConfig.abTesting).not.toBe(abTesting);
  });

  it('should not update values when undefined is passed to set.', () => {
    runConfig.set({
      playground: undefined,
      ifShowRunConfigInTheConfigScreen: undefined,
      ifPrintsDebugInfoToConsole: undefined,
      abTesting: undefined,
    });

    expect(runConfig.playground).not.toBeNull();
    expect(runConfig.ifShowRunConfigInTheConfigScreen).toBe(true);
    expect(runConfig.ifPrintsDebugInfoToConsole).toBe(true);
    expect(runConfig.abTesting).toBe(abTesting);
  });
});
