import { Model, model, modelAction, prop } from 'mobx-keystone';
import { AbTesting } from './ABTesting';
import React from 'react';

@model('RunConfig')
export class RunConfig extends Model({
  ifShowRunConfigInTheConfigScreen: prop<boolean>(),
  ifPrintsDebugInfoToConsole: prop<boolean>(),
  abTesting: prop<AbTesting>(),
}) {
  playground?: React.JSX.Element | null;

  constructor({
                playground,
                ifShowRunConfigInTheConfigScreen = false,
                ifPrintsDebugInfoToConsole = false,
                abTesting = AbTesting.A,
                ...rest
              }: {
    playground?: React.JSX.Element | null,
    ifShowRunConfigInTheConfigScreen?: boolean,
    ifPrintsDebugInfoToConsole?: boolean,
    abTesting: AbTesting,
  }) {
    super({ ifShowRunConfigInTheConfigScreen, ifPrintsDebugInfoToConsole, abTesting, ...rest });
    this.playground = playground;
  }

  @modelAction
  set({
        playground,
        ifShowRunConfigInTheConfigScreen,
        ifPrintsDebugInfoToConsole,
        abTesting
      }: {
    playground?: React.JSX.Element | null,
    ifShowRunConfigInTheConfigScreen?: boolean,
    ifPrintsDebugInfoToConsole?: boolean,
    abTesting?: AbTesting,
  }) {
    if (playground !== undefined) this.playground = playground;
    if (ifShowRunConfigInTheConfigScreen !== undefined) this.ifShowRunConfigInTheConfigScreen = ifShowRunConfigInTheConfigScreen;
    if (ifPrintsDebugInfoToConsole !== undefined) this.ifPrintsDebugInfoToConsole = ifPrintsDebugInfoToConsole;
    if (abTesting !== undefined) this.abTesting = abTesting;
  }

  toString(): string {
    return `
    playground: ${this.playground?.constructor.name}
    ifShowRunConfigInTheConfigScreen: ${this.ifShowRunConfigInTheConfigScreen}
    ifPrintsDebugInfoToConsole: ${this.ifPrintsDebugInfoToConsole}
    abTesting: ${this.abTesting}
    `;
  }
}
