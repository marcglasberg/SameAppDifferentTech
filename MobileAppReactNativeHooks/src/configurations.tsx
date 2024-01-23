import RunConfig from './business/RunConfig/RunConfig';
import { AbTesting } from './business/RunConfig/ABTesting';
import React from 'react';
import { Playground } from './ui/cashBalanceAndPortfolio/Playground';

export const anotherConfiguration = new RunConfig({
  playground: <Playground />,
  ifShowRunConfigInTheConfigScreen: true,
  ifPrintsDebugInfoToConsole: true,
  abTesting: AbTesting.A
});
