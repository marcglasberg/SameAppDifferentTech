import React from 'react';
import {AbTesting} from './ABTesting';

/**
 * Holds information about how to run the app. The UI must be updated when
 * RunConfig properties change, but you should only change the RunConfig
 * during development.
 *
 * When creating components, you may define a {@link playground} for that
 * component. When the app runs, it will run it instead of the regular app.
 */
class RunConfig {

    /** If you define a playground, it will be shown instead of the regular app. */
    playground: React.JSX.Element | null | undefined;

    /** If the use can see and change the RunConfig options in the Configuration Screen. */
    ifShowRunConfigInTheConfigScreen: boolean;

    /** Only if true, the {@link print} function will print to the console. */
    ifPrintsDebugInfoToConsole: boolean;

    /** Choose between different UIs. Add more states than simple A/B, as needed. */
    abTesting: AbTesting;

    public constructor({
                           playground,
                           ifShowRunConfigInTheConfigScreen,
                           ifPrintsDebugInfoToConsole,
                           abTesting,
                       }: {
        playground: React.JSX.Element | null | undefined;
        ifShowRunConfigInTheConfigScreen: boolean;
        ifPrintsDebugInfoToConsole: boolean;
        abTesting: AbTesting;
    }) {

        this.playground = playground;
        this.ifShowRunConfigInTheConfigScreen = ifShowRunConfigInTheConfigScreen;
        this.ifPrintsDebugInfoToConsole = ifPrintsDebugInfoToConsole;
        this.abTesting = abTesting;
    }

    set({
            playground,
            ifShowRunConfigInTheConfigScreen,
            ifPrintsDebugInfoToConsole,
            abTesting,
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

export default RunConfig;
